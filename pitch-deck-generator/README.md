# Pitch Deck Generator

An AI-powered application that generates investor-ready pitch decks slide by slide, outputting beautiful HTML presentations.

## Features

- **Slide-by-Slide Generation**: Generate individual slides or complete decks
- **AI-Powered Content**: Uses OpenAI GPT-4o or Perplexity Sonar Pro for web-grounded research
- **McKinsey-Quality Framework**: Follows professional pitch deck best practices
- **Beautiful HTML Output**: Modern, responsive HTML with print-ready styling
- **19 Slide Types**: From Executive Summary to Vision, covering all investor expectations

## Slide Types

### Critical (Must-Have)
1. Executive Summary
2. Problem
3. Solution
4. Market Size
5. Product
6. Business Model
7. Traction
8. Team
9. Ask / Use of Funds

### Important
10. Why Now
11. Go-to-Market
12. Competition
13. Customer Profile
14. Unit Economics
15. Roadmap

### Nice-to-Have
16. Testimonials / Social Proof
17. Partnerships
18. Global Precedent / Comparables
19. Vision

## Installation

1. Clone or download this project:
```bash
cd pitch-deck-generator
```

2. Create a virtual environment:
```bash
python -m venv venv
venv\Scripts\activate  # Windows
# or
source venv/bin/activate  # macOS/Linux
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up your API key:
```bash
copy .env.example .env
# Edit .env and add your API key
```

## Usage

### Web Application

1. Start the Flask server:
```bash
python app.py
```

2. Open your browser to `http://localhost:5000`

3. Fill in your company information:
   - Company name and description
   - Stage (Pre-seed, Seed, Series A, etc.)
   - Raise amount
   - Industry/sector
   - Business model
   - Key metrics
   - Additional context

4. Select your AI provider and enter your API key

5. Choose which slides to generate

6. Click "Generate Pitch Deck"

7. View or download your HTML pitch deck

### Programmatic Usage

```python
from slide_generator import SlideGenerator
from html_templates import generate_deck_html

# Initialize generator
generator = SlideGenerator(
    api_key="your-api-key",
    provider="openai"  # or "perplexity"
)

# Company context
company_context = {
    "company_name": "Acme Inc.",
    "description": "AI-powered inventory management for SMBs",
    "stage": "Seed",
    "raise_amount": "$2M",
    "industry": "B2B SaaS",
    "business_model": "Subscription",
    "key_metrics": "$50K MRR, 100 customers, 15% MoM growth",
    "investor_profile": "VC",
    "additional_context": "Former Amazon team, patent pending"
}

# Generate a single slide
problem_slide = generator.generate_slide("problem", company_context)
print(problem_slide)

# Generate full deck
slides = generator.generate_full_deck(company_context, include_nice_to_have=False)

# Export to HTML
html = generate_deck_html(slides, company_name="Acme Inc.")
with open("pitch_deck.html", "w", encoding="utf-8") as f:
    f.write(html)
```

## AI Providers

### OpenAI (GPT-4o)
- Best for general content generation
- High-quality, creative outputs
- Requires OpenAI API key

### Perplexity (Sonar Pro)
- Web-grounded responses with real-time data
- Includes source citations
- Best for market research and competitor analysis
- Requires Perplexity API key

## Writing Guidelines

The generator follows McKinsey-style pitch deck best practices:

### Core Philosophy
1. **Pyramid Principle**: Lead with the answer, then support it
2. **One Slide, One Message**: Each slide makes exactly one claim
3. **Assertion, Not Description**: Headlines are arguments, not topics

### Headline Rules
- Complete sentences with standalone assertions
- Front-load the most important information
- Quantify wherever possible
- Maximum two lines

### Body Copy Rules
- 3-5 bullet points maximum
- Under 40 words per bullet
- Active voice, not passive
- Assertion first, evidence after

### Banned Phrases
"Innovative", "Best-in-class", "Synergy", "Disrupt", "Game-changing", "Cutting-edge", "Holistic", "Scalable solution", "First-mover advantage" (unless proven), etc.

## Output Format

Each slide includes:
- **Headline**: Complete sentence with key assertion
- **Bullets**: 3-5 supporting points with evidence
- **Key Metrics**: Visual representation of important numbers
- **Visual Recommendation**: Suggested charts or diagrams
- **Data Sources**: Citations for external data

## Customization

### Styling
Edit the CSS in `html_templates.py` to customize:
- Colors (via CSS variables)
- Typography
- Layout and spacing
- Print styles

### Slide Types
Modify `config.py` to:
- Add new slide types
- Change slide order
- Adjust priorities
- Update guidance per slide

## License

MIT License

## Contributing

Contributions welcome! Please feel free to submit a Pull Request.
