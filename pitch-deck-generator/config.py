"""Configuration for the Pitch Deck Generator."""

SLIDE_TYPES = [
    {
        "id": "executive_summary",
        "name": "Executive Summary",
        "priority": "Critical",
        "question": "Why should I keep reading?",
        "guidance": """
- Lead with the most compelling fact about your company
- Include: what you do, traction highlight, and the ask
- One paragraph maximum
- Make the investor want to see the next slide
"""
    },
    {
        "id": "problem",
        "name": "Problem",
        "priority": "Critical",
        "question": "What pain exists and for whom?",
        "guidance": """
- Quantify the pain (cost, time, frequency)
- Name who feels it most acutely
- Explain why existing solutions fail
- Make investors feel the problem before seeing the solution
"""
    },
    {
        "id": "solution",
        "name": "Solution",
        "priority": "Critical",
        "question": "How do you solve this pain?",
        "guidance": """
- State what you do in one sentence
- Connect directly to problems stated
- Avoid feature lists — focus on outcomes
- Include product visual recommendation if possible
"""
    },
    {
        "id": "market_size",
        "name": "Market Size",
        "priority": "Critical",
        "question": "Is this worth pursuing?",
        "guidance": """
- Show TAM → SAM → SOM with methodology
- Bottom-up calculation preferred over top-down
- Cite credible sources
- Show growth rate, not just current size
"""
    },
    {
        "id": "product",
        "name": "Product",
        "priority": "Critical",
        "question": "What does the user actually experience?",
        "guidance": """
- Show the actual product or mockups
- Highlight key features that solve the problem
- Focus on user experience and outcomes
- Include metrics on product performance if available
"""
    },
    {
        "id": "business_model",
        "name": "Business Model",
        "priority": "Critical",
        "question": "How do you make money?",
        "guidance": """
- Show all revenue streams
- Clarify pricing logic
- Include unit economics if strong
- Show margin structure if favorable
"""
    },
    {
        "id": "traction",
        "name": "Traction",
        "priority": "Critical",
        "question": "Is this working?",
        "guidance": """
- Lead with most impressive metric
- Show trajectory, not just current state
- Include 3-5 metrics maximum
- Contextualize against benchmarks
"""
    },
    {
        "id": "team",
        "name": "Team",
        "priority": "Critical",
        "question": "Can you execute?",
        "guidance": """
- Lead with why this team wins
- Highlight relevant experience (not just impressive titles)
- Connect past experience to current problem
- Include notable investors/advisors if credibility-building
"""
    },
    {
        "id": "ask",
        "name": "Ask / Use of Funds",
        "priority": "Critical",
        "question": "What do you need and why?",
        "guidance": """
- State amount clearly
- Break down use of funds (percentages)
- Tie to specific milestones
- Include timeline and what this gets you to
"""
    },
    {
        "id": "why_now",
        "name": "Why Now",
        "priority": "Important",
        "question": "Why is this the right moment?",
        "guidance": """
- Identify market timing factors
- Reference recent changes (regulatory, technological, behavioral)
- Explain why this couldn't have worked 5 years ago
- Show urgency without desperation
"""
    },
    {
        "id": "go_to_market",
        "name": "Go-to-Market",
        "priority": "Important",
        "question": "How will you acquire customers?",
        "guidance": """
- Outline primary customer acquisition channels
- Include CAC if favorable
- Show sales cycle and conversion rates
- Demonstrate repeatable growth strategy
"""
    },
    {
        "id": "competition",
        "name": "Competition",
        "priority": "Important",
        "question": "Why will you win?",
        "guidance": """
- Never say "no competition"
- Use framework (2x2 matrix, table, or landscape)
- Be honest about competitor strengths
- Emphasize your differentiation, not competitor weakness
"""
    },
    {
        "id": "customer_profile",
        "name": "Customer Profile",
        "priority": "Important",
        "question": "Who exactly is the target user?",
        "guidance": """
- Define ideal customer profile clearly
- Include demographics, psychographics, behaviors
- Quantify the segment size
- Show why they are the right first target
"""
    },
    {
        "id": "unit_economics",
        "name": "Unit Economics",
        "priority": "Important",
        "question": "Is growth sustainable?",
        "guidance": """
- Show LTV:CAC ratio
- Include payback period
- Display gross margins
- Demonstrate path to profitability
"""
    },
    {
        "id": "roadmap",
        "name": "Roadmap",
        "priority": "Important",
        "question": "What will you do with the money?",
        "guidance": """
- Show 12-18 month plan
- Tie milestones to funding
- Include key hires, product launches, expansion
- Make milestones measurable
"""
    },
    {
        "id": "testimonials",
        "name": "Testimonials / Social Proof",
        "priority": "Nice-to-Have",
        "question": "Do customers love it?",
        "guidance": """
- Include real customer quotes
- Show logos of notable customers
- Include NPS or satisfaction scores
- Reference case studies or success stories
"""
    },
    {
        "id": "partnerships",
        "name": "Partnerships",
        "priority": "Nice-to-Have",
        "question": "Who validates/accelerates you?",
        "guidance": """
- List strategic partnerships
- Show how partnerships accelerate growth
- Include integration partners
- Highlight exclusive relationships
"""
    },
    {
        "id": "global_precedent",
        "name": "Global Precedent / Comparables",
        "priority": "Nice-to-Have",
        "question": "Has this worked elsewhere?",
        "guidance": """
- Reference similar successful companies in other markets
- Show valuation comparisons
- Highlight relevant outcomes
- Demonstrate pattern recognition for investors
"""
    },
    {
        "id": "vision",
        "name": "Vision",
        "priority": "Nice-to-Have",
        "question": "Where does this go long-term?",
        "guidance": """
- Paint the 5-10 year picture
- Show expansion opportunities
- Demonstrate ambition without being unrealistic
- Connect to larger market trends
"""
    }
]

SYSTEM_PROMPT = """You are a McKinsey-trained pitch deck strategist and copywriter. You help startups create investor-ready pitch decks that are clear, compelling, and complete.

## CORE PHILOSOPHY
1. Pyramid Principle: Lead with the answer, then support it. The reader should understand your point from the first line. Everything after is evidence.
2. One Slide, One Message: Each slide makes exactly one claim. If you need "and" to connect two ideas, you need two slides.
3. Assertion, Not Description: Slides are arguments, not topics.
   - Wrong: "Market Size"
   - Right: "The [market] represents a $[X]B opportunity growing [Y]% annually"

## HEADLINE RULES
- Headlines must be complete sentences with a standalone assertion
- Headlines carry the takeaway — if an investor reads only headlines, they should understand the entire thesis
- Front-load the insight — put the most important information first
- Use parallel structure when listing items
- Quantify wherever possible — specificity builds credibility
- Maximum two lines — if longer, tighten the language

Headline Formulas That Work:
- "[Metric] proves [conclusion]"
- "[Company] does [X], resulting in [Y]"
- "[Number] [things] demonstrate [point]"
- "[Insight]: [evidence]"
- "[Claim] — [proof]"

## BODY COPY RULES
- 3-5 bullet points maximum per slide
- 1-2 lines per bullet maximum
- Under 40 words per bullet
- Each bullet is a mini-argument: assertion first, evidence after
- Use active voice, not passive
- Eliminate filler words

## BANNED PHRASES
Never use: "We believe," "Helping to," "Innovative," "Best-in-class," "Synergy," "Leverage," "World-class," "Disrupt," "Revolutionize," "Unique," "Game-changing," "End-to-end," "Cutting-edge," "Holistic," "Robust," "Scalable solution," "Paradigm shift," "First-mover advantage" (unless proven), "Huge market," "Conservative estimates"

## TONE CALIBRATION
- Confident, not arrogant: State facts clearly without hedging excessively or overstating
- Precise, not vague: Every claim should be specific enough to verify
- Active, not passive: "[Users] do [X]" not "[X] is done by [users]"
- Professional, not casual: Investor document, not a blog post
- Investor-centric: Frame everything in terms of returns, risk mitigation, scalability, defensibility

## DATA PRESENTATION STANDARDS
- Always contextualize numbers with comparisons or benchmarks
- Use consistent notation:
  - Currency: $2M (not $2 million)
  - Large numbers: 4M users (not 4,000,000)
  - Percentages: 15% (not 15 percent)
  - Ratios: 4.1x (not 4.1 times)
  - Growth: 2x QoQ (not 100% quarter-over-quarter)
- Round appropriately — excessive precision undermines credibility
- Attribute all external data with source

## STAGE-SPECIFIC GUIDANCE
Pre-Seed / Seed: Emphasize team, vision, early signals of product-market fit, market timing. Traction expectations are lower; narrative and founder credibility matter more.

Series A: Prove product-market fit with data. Cohort analysis, unit economics, repeatable growth channels. Team execution evidence. Clear use of funds tied to milestones.

Series B+: Prove scalability. Path to profitability or market dominance. Competitive moat. Organizational capability. Detailed financial projections.

## IMPORTANT INSTRUCTIONS
- Search the web for current, accurate data about markets, competitors, and trends
- Use real statistics and cite sources where possible
- Make the content specific to the company's industry and stage
- Generate investor-ready content that passes the "so what?" test
"""

SLIDE_OUTPUT_FORMAT = """
Generate the slide content in the following JSON format:
{
    "headline": "One or two line assertion — complete sentence that captures the key insight",
    "descriptor": "One sentence explaining the slide's purpose (internal reference)",
    "bullets": [
        "Bullet 1 - assertion with evidence",
        "Bullet 2 - assertion with evidence",
        "Bullet 3 - assertion with evidence",
        "Bullet 4 - optional",
        "Bullet 5 - optional"
    ],
    "visual_recommendation": "What chart, image, or diagram should accompany this slide",
    "data_sources": ["Source 1", "Source 2"],
    "key_metrics": {
        "metric_name": "value"
    }
}
"""
