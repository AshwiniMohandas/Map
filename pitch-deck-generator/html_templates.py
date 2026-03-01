"""HTML template generator for pitch deck slides."""

from typing import List, Dict
import html


def generate_slide_html(slide: dict) -> str:
    """Generate HTML for a single slide."""
    headline = html.escape(slide.get("headline", ""))
    bullets = slide.get("bullets", [])
    visual_rec = html.escape(slide.get("visual_recommendation", ""))
    slide_name = html.escape(slide.get("slide_name", ""))
    priority = html.escape(slide.get("priority", ""))
    key_metrics = slide.get("key_metrics", {})
    data_sources = slide.get("data_sources", [])
    
    # Build bullets HTML
    bullets_html = ""
    if bullets:
        bullets_html = "<ul class='slide-bullets'>\n"
        for bullet in bullets:
            bullets_html += f"        <li>{html.escape(str(bullet))}</li>\n"
        bullets_html += "      </ul>"
    
    # Build metrics HTML
    metrics_html = ""
    if key_metrics:
        metrics_html = "<div class='key-metrics'>\n"
        for name, value in key_metrics.items():
            metrics_html += f"""        <div class='metric'>
          <span class='metric-value'>{html.escape(str(value))}</span>
          <span class='metric-name'>{html.escape(str(name))}</span>
        </div>\n"""
        metrics_html += "      </div>"
    
    # Build sources HTML
    sources_html = ""
    if data_sources:
        sources_html = "<div class='data-sources'>\n        <small>Sources: "
        sources_html += ", ".join([html.escape(str(s)) for s in data_sources])
        sources_html += "</small>\n      </div>"
    
    priority_class = priority.lower().replace("-", "_").replace(" ", "_")
    
    return f"""
    <section class="slide" data-slide-id="{html.escape(slide.get('slide_id', ''))}">
      <div class="slide-header">
        <span class="slide-type">{slide_name}</span>
        <span class="slide-priority priority-{priority_class}">{priority}</span>
      </div>
      <h2 class="slide-headline">{headline}</h2>
      {bullets_html}
      {metrics_html}
      {f'<div class="visual-recommendation"><strong>Visual:</strong> {visual_rec}</div>' if visual_rec else ''}
      {sources_html}
    </section>
"""


def generate_deck_html(slides: List[Dict], company_name: str = "Pitch Deck") -> str:
    """Generate complete HTML document for the pitch deck."""
    
    slides_html = "\n".join([generate_slide_html(slide) for slide in slides])
    
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{html.escape(company_name)} - Pitch Deck</title>
  <style>
    :root {{
      --primary-color: #2563eb;
      --secondary-color: #1e40af;
      --accent-color: #3b82f6;
      --bg-color: #f8fafc;
      --card-bg: #ffffff;
      --text-primary: #1e293b;
      --text-secondary: #64748b;
      --border-color: #e2e8f0;
      --success-color: #10b981;
      --warning-color: #f59e0b;
      --info-color: #6366f1;
    }}
    
    * {{
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }}
    
    body {{
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
      background: var(--bg-color);
      color: var(--text-primary);
      line-height: 1.6;
    }}
    
    .deck-container {{
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }}
    
    .deck-header {{
      text-align: center;
      padding: 3rem 0;
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      color: white;
      border-radius: 16px;
      margin-bottom: 2rem;
    }}
    
    .deck-header h1 {{
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }}
    
    .deck-header p {{
      font-size: 1.1rem;
      opacity: 0.9;
    }}
    
    .slide {{
      background: var(--card-bg);
      border-radius: 16px;
      padding: 2rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      border: 1px solid var(--border-color);
      transition: transform 0.2s, box-shadow 0.2s;
      page-break-inside: avoid;
    }}
    
    .slide:hover {{
      transform: translateY(-2px);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }}
    
    .slide-header {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 0.75rem;
      border-bottom: 2px solid var(--border-color);
    }}
    
    .slide-type {{
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--primary-color);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }}
    
    .slide-priority {{
      font-size: 0.75rem;
      font-weight: 500;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
    }}
    
    .priority-critical {{
      background: #fee2e2;
      color: #dc2626;
    }}
    
    .priority-important {{
      background: #fef3c7;
      color: #d97706;
    }}
    
    .priority-nice_to_have {{
      background: #dbeafe;
      color: #2563eb;
    }}
    
    .slide-headline {{
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 1.5rem;
      line-height: 1.3;
    }}
    
    .slide-bullets {{
      list-style: none;
      margin-bottom: 1.5rem;
    }}
    
    .slide-bullets li {{
      position: relative;
      padding-left: 1.5rem;
      margin-bottom: 0.75rem;
      color: var(--text-primary);
    }}
    
    .slide-bullets li::before {{
      content: '';
      position: absolute;
      left: 0;
      top: 0.5rem;
      width: 8px;
      height: 8px;
      background: var(--accent-color);
      border-radius: 50%;
    }}
    
    .key-metrics {{
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin: 1.5rem 0;
    }}
    
    .metric {{
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 12px;
      text-align: center;
      min-width: 120px;
    }}
    
    .metric-value {{
      display: block;
      font-size: 1.5rem;
      font-weight: 700;
    }}
    
    .metric-name {{
      display: block;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      opacity: 0.9;
    }}
    
    .visual-recommendation {{
      background: #f0f9ff;
      border: 1px solid #bae6fd;
      border-radius: 8px;
      padding: 1rem;
      margin-top: 1rem;
      color: #0369a1;
      font-size: 0.875rem;
    }}
    
    .data-sources {{
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px dashed var(--border-color);
      color: var(--text-secondary);
    }}
    
    .navigation {{
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      display: flex;
      gap: 0.5rem;
      z-index: 100;
    }}
    
    .nav-btn {{
      background: var(--primary-color);
      color: white;
      border: none;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 1.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      transition: background 0.2s, transform 0.2s;
    }}
    
    .nav-btn:hover {{
      background: var(--secondary-color);
      transform: scale(1.1);
    }}
    
    .toc {{
      background: var(--card-bg);
      border-radius: 16px;
      padding: 2rem;
      margin-bottom: 2rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }}
    
    .toc h3 {{
      margin-bottom: 1rem;
      color: var(--primary-color);
    }}
    
    .toc-list {{
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 0.5rem;
      list-style: none;
    }}
    
    .toc-list a {{
      color: var(--text-primary);
      text-decoration: none;
      padding: 0.5rem;
      border-radius: 8px;
      display: block;
      transition: background 0.2s;
    }}
    
    .toc-list a:hover {{
      background: var(--bg-color);
      color: var(--primary-color);
    }}
    
    @media print {{
      .navigation, .toc {{
        display: none;
      }}
      
      .slide {{
        break-inside: avoid;
        box-shadow: none;
        border: 1px solid #ccc;
      }}
      
      .deck-header {{
        background: var(--primary-color) !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }}
    }}
    
    @media (max-width: 768px) {{
      .deck-container {{
        padding: 1rem;
      }}
      
      .slide {{
        padding: 1.5rem;
      }}
      
      .slide-headline {{
        font-size: 1.25rem;
      }}
      
      .key-metrics {{
        flex-direction: column;
      }}
      
      .metric {{
        width: 100%;
      }}
    }}
  </style>
</head>
<body>
  <div class="deck-container">
    <header class="deck-header">
      <h1>{html.escape(company_name)}</h1>
      <p>Investor Pitch Deck</p>
    </header>
    
    <nav class="toc">
      <h3>📋 Table of Contents</h3>
      <ul class="toc-list">
        {generate_toc_items(slides)}
      </ul>
    </nav>
    
    <main class="slides-container">
      {slides_html}
    </main>
  </div>
  
  <nav class="navigation">
    <button class="nav-btn" onclick="scrollToTop()" title="Back to Top">↑</button>
    <button class="nav-btn" onclick="window.print()" title="Print / Save as PDF">🖨</button>
  </nav>
  
  <script>
    function scrollToTop() {{
      window.scrollTo({{ top: 0, behavior: 'smooth' }});
    }}
    
    // Smooth scroll for TOC links
    document.querySelectorAll('.toc-list a').forEach(link => {{
      link.addEventListener('click', (e) => {{
        e.preventDefault();
        const targetId = link.getAttribute('href').slice(1);
        const target = document.querySelector(`[data-slide-id="${{targetId}}"]`);
        if (target) {{
          target.scrollIntoView({{ behavior: 'smooth', block: 'start' }});
        }}
      }});
    }});
  </script>
</body>
</html>
"""


def generate_toc_items(slides: List[Dict]) -> str:
    """Generate table of contents list items."""
    items = []
    for i, slide in enumerate(slides, 1):
        slide_id = html.escape(slide.get("slide_id", ""))
        slide_name = html.escape(slide.get("slide_name", f"Slide {i}"))
        items.append(f'<li><a href="#{slide_id}">{i}. {slide_name}</a></li>')
    return "\n        ".join(items)


def generate_single_slide_html(slide: dict, company_name: str = "Pitch Deck") -> str:
    """Generate HTML for viewing a single slide."""
    slide_html = generate_slide_html(slide)
    
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{html.escape(company_name)} - {html.escape(slide.get('slide_name', 'Slide'))}</title>
  <style>
    :root {{
      --primary-color: #2563eb;
      --secondary-color: #1e40af;
      --accent-color: #3b82f6;
      --bg-color: #f8fafc;
      --card-bg: #ffffff;
      --text-primary: #1e293b;
      --text-secondary: #64748b;
      --border-color: #e2e8f0;
    }}
    
    * {{
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }}
    
    body {{
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
      background: var(--bg-color);
      color: var(--text-primary);
      line-height: 1.6;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }}
    
    .slide {{
      background: var(--card-bg);
      border-radius: 16px;
      padding: 3rem;
      max-width: 900px;
      width: 100%;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }}
    
    .slide-header {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid var(--border-color);
    }}
    
    .slide-type {{
      font-size: 1rem;
      font-weight: 600;
      color: var(--primary-color);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }}
    
    .slide-priority {{
      font-size: 0.875rem;
      font-weight: 500;
      padding: 0.375rem 1rem;
      border-radius: 9999px;
    }}
    
    .priority-critical {{
      background: #fee2e2;
      color: #dc2626;
    }}
    
    .priority-important {{
      background: #fef3c7;
      color: #d97706;
    }}
    
    .priority-nice_to_have {{
      background: #dbeafe;
      color: #2563eb;
    }}
    
    .slide-headline {{
      font-size: 2rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 2rem;
      line-height: 1.3;
    }}
    
    .slide-bullets {{
      list-style: none;
      margin-bottom: 2rem;
    }}
    
    .slide-bullets li {{
      position: relative;
      padding-left: 2rem;
      margin-bottom: 1rem;
      font-size: 1.125rem;
    }}
    
    .slide-bullets li::before {{
      content: '';
      position: absolute;
      left: 0;
      top: 0.625rem;
      width: 10px;
      height: 10px;
      background: var(--accent-color);
      border-radius: 50%;
    }}
    
    .key-metrics {{
      display: flex;
      flex-wrap: wrap;
      gap: 1.5rem;
      margin: 2rem 0;
    }}
    
    .metric {{
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      color: white;
      padding: 1.5rem 2rem;
      border-radius: 12px;
      text-align: center;
      min-width: 150px;
    }}
    
    .metric-value {{
      display: block;
      font-size: 2rem;
      font-weight: 700;
    }}
    
    .metric-name {{
      display: block;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      opacity: 0.9;
    }}
    
    .visual-recommendation {{
      background: #f0f9ff;
      border: 1px solid #bae6fd;
      border-radius: 8px;
      padding: 1.25rem;
      margin-top: 1.5rem;
      color: #0369a1;
    }}
    
    .data-sources {{
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px dashed var(--border-color);
      color: var(--text-secondary);
    }}
  </style>
</head>
<body>
  {slide_html}
</body>
</html>
"""
