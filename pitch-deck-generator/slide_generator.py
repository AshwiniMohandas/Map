"""Slide Generator using AI models with web access."""

import json
import os
import re
from typing import Optional
from openai import OpenAI, AzureOpenAI
from azure.identity import DefaultAzureCredential, get_bearer_token_provider
from config import SLIDE_TYPES, SYSTEM_PROMPT, SLIDE_OUTPUT_FORMAT


class SlideGenerator:
    """Generates pitch deck slides using AI models with web access."""
    
    def __init__(self, api_key: Optional[str] = None, provider: str = "openai", 
                 azure_endpoint: Optional[str] = None, azure_deployment: Optional[str] = None,
                 azure_api_version: Optional[str] = None):
        """
        Initialize the slide generator.
        
        Args:
            api_key: API key for the provider
            provider: "openai", "azure", or "perplexity"
            azure_endpoint: Azure OpenAI endpoint URL (for azure provider)
            azure_deployment: Azure OpenAI deployment name (for azure provider)
            azure_api_version: Azure OpenAI API version (for azure provider)
        """
        self.provider = provider
        
        if provider == "perplexity":
            self.client = OpenAI(
                api_key=api_key or os.getenv("PERPLEXITY_API_KEY"),
                base_url="https://api.perplexity.ai"
            )
            self.model = "sonar-pro"
        elif provider == "azure":
            # Azure OpenAI configuration with Azure AD authentication
            endpoint = azure_endpoint or os.getenv("AZURE_OPENAI_ENDPOINT", 
                "https://cs-newsandfeeds-singularity-aoai.openai.azure.com")
            deployment = azure_deployment or os.getenv("AZURE_OPENAI_DEPLOYMENT", "csnf-gpt-4o")
            api_version = azure_api_version or os.getenv("AZURE_OPENAI_API_VERSION", "2025-01-01-preview")
            
            # Use Azure AD authentication (DefaultAzureCredential)
            token_provider = get_bearer_token_provider(
                DefaultAzureCredential(),
                "https://cognitiveservices.azure.com/.default"
            )
            
            self.client = AzureOpenAI(
                azure_ad_token_provider=token_provider,
                api_version=api_version,
                azure_endpoint=endpoint
            )
            self.model = deployment
        else:
            self.client = OpenAI(
                api_key=api_key or os.getenv("OPENAI_API_KEY")
            )
            self.model = "gpt-4o"
    
    def get_slide_config(self, slide_id: str) -> Optional[dict]:
        """Get configuration for a specific slide type."""
        for slide in SLIDE_TYPES:
            if slide["id"] == slide_id:
                return slide
        return None
    
    def generate_slide(self, slide_id: str, company_context: dict) -> dict:
        """
        Generate content for a specific slide.
        
        Args:
            slide_id: The ID of the slide type to generate
            company_context: Dictionary containing company information
            
        Returns:
            Dictionary with slide content
        """
        slide_config = self.get_slide_config(slide_id)
        if not slide_config:
            raise ValueError(f"Unknown slide type: {slide_id}")
        
        # Build the company context string
        context_str = self._format_company_context(company_context)
        
        # Build the prompt for this specific slide
        prompt = f"""
## COMPANY CONTEXT
{context_str}

## TASK
Generate content for the "{slide_config['name']}" slide.

Core Question this slide must answer: {slide_config['question']}

Slide-Specific Guidance:
{slide_config['guidance']}

## IMPORTANT
- Search the web for current market data, competitor information, and industry trends relevant to this company
- Use real, verifiable data with sources
- Make assertions specific and quantified
- Follow all formatting rules from the system prompt

{SLIDE_OUTPUT_FORMAT}

Generate ONLY the JSON response, no additional text.
"""
        
        messages = [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt}
        ]
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=0.7,
                max_tokens=2000
            )
            
            content = response.choices[0].message.content
            
            # Parse JSON from response
            slide_content = self._parse_json_response(content)
            slide_content["slide_id"] = slide_id
            slide_content["slide_name"] = slide_config["name"]
            slide_content["priority"] = slide_config["priority"]
            
            return slide_content
            
        except Exception as e:
            return {
                "slide_id": slide_id,
                "slide_name": slide_config["name"],
                "priority": slide_config["priority"],
                "error": str(e),
                "headline": f"[Error generating {slide_config['name']} slide]",
                "bullets": [],
                "visual_recommendation": ""
            }
    
    def generate_full_deck(self, company_context: dict, 
                          include_nice_to_have: bool = False) -> list:
        """
        Generate a complete pitch deck.
        
        Args:
            company_context: Dictionary containing company information
            include_nice_to_have: Whether to include Nice-to-Have slides
            
        Returns:
            List of slide content dictionaries
        """
        slides = []
        
        for slide_type in SLIDE_TYPES:
            # Skip nice-to-have slides if not requested
            if slide_type["priority"] == "Nice-to-Have" and not include_nice_to_have:
                continue
            
            slide_content = self.generate_slide(slide_type["id"], company_context)
            slides.append(slide_content)
        
        return slides
    
    def _format_company_context(self, context: dict) -> str:
        """Format company context for the prompt."""
        return f"""
Company Name: {context.get('company_name', '[Not provided]')}
One-Line Description: {context.get('description', '[Not provided]')}
Stage: {context.get('stage', '[Not provided]')}
Raise Amount: {context.get('raise_amount', '[Not provided]')}
Industry/Sector: {context.get('industry', '[Not provided]')}
Business Model: {context.get('business_model', '[Not provided]')}
Key Metrics: {context.get('key_metrics', '[Not provided]')}
Target Investor Profile: {context.get('investor_profile', '[Not provided]')}
Additional Context: {context.get('additional_context', '')}
"""
    
    def _parse_json_response(self, content: str) -> dict:
        """Parse JSON from the AI response."""
        # Try to extract JSON from the response
        try:
            # First, try direct parsing
            return json.loads(content)
        except json.JSONDecodeError:
            pass
        
        # Try to find JSON block in markdown code blocks
        json_match = re.search(r'```(?:json)?\s*([\s\S]*?)```', content)
        if json_match:
            try:
                return json.loads(json_match.group(1).strip())
            except json.JSONDecodeError:
                pass
        
        # Try to find any JSON object in the content
        json_match = re.search(r'\{[\s\S]*\}', content)
        if json_match:
            try:
                return json.loads(json_match.group(0))
            except json.JSONDecodeError:
                pass
        
        # Return a default structure if parsing fails
        return {
            "headline": content[:200] if content else "[Failed to generate]",
            "bullets": [],
            "visual_recommendation": "",
            "parse_error": "Could not parse AI response as JSON"
        }
