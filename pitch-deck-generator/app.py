"""Flask web application for generating pitch decks."""

import os
import json
from flask import Flask, render_template_string, request, jsonify, Response
from dotenv import load_dotenv
from slide_generator import SlideGenerator
from html_templates import generate_deck_html, generate_single_slide_html
from config import SLIDE_TYPES

load_dotenv()

app = Flask(__name__)

# HTML Templates
INDEX_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pitch Deck Generator</title>
  <style>
    :root {
      --primary: #2563eb;
      --primary-dark: #1e40af;
      --bg: #f8fafc;
      --card: #ffffff;
      --text: #1e293b;
      --text-muted: #64748b;
      --border: #e2e8f0;
      --success: #10b981;
      --error: #ef4444;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.6;
    }
    
    .container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 2rem;
    }
    
    header {
      text-align: center;
      padding: 3rem 0;
    }
    
    h1 {
      font-size: 2.5rem;
      background: linear-gradient(135deg, var(--primary), var(--primary-dark));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 0.5rem;
    }
    
    .subtitle {
      color: var(--text-muted);
      font-size: 1.1rem;
    }
    
    .card {
      background: var(--card);
      border-radius: 16px;
      padding: 2rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      border: 1px solid var(--border);
    }
    
    .card h2 {
      font-size: 1.25rem;
      margin-bottom: 1.5rem;
      color: var(--primary);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .form-group {
      margin-bottom: 1.25rem;
    }
    
    label {
      display: block;
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: var(--text);
    }
    
    .label-hint {
      font-weight: 400;
      color: var(--text-muted);
      font-size: 0.875rem;
    }
    
    input, select, textarea {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 2px solid var(--border);
      border-radius: 8px;
      font-size: 1rem;
      font-family: inherit;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    
    input:focus, select:focus, textarea:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }
    
    textarea {
      min-height: 100px;
      resize: vertical;
    }
    
    .row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }
    
    .provider-select {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    
    .provider-option {
      flex: 1;
      padding: 1rem;
      border: 2px solid var(--border);
      border-radius: 8px;
      cursor: pointer;
      text-align: center;
      transition: all 0.2s;
    }
    
    .provider-option:hover {
      border-color: var(--primary);
    }
    
    .provider-option.selected {
      border-color: var(--primary);
      background: rgba(37, 99, 235, 0.05);
    }
    
    .provider-option input {
      display: none;
    }
    
    .slide-options {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 0.75rem;
    }
    
    .slide-option {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem;
      border-radius: 6px;
      cursor: pointer;
      transition: background 0.2s;
    }
    
    .slide-option:hover {
      background: var(--bg);
    }
    
    .slide-option input[type="checkbox"] {
      width: auto;
      cursor: pointer;
    }
    
    .priority-badge {
      font-size: 0.625rem;
      padding: 0.125rem 0.375rem;
      border-radius: 4px;
      margin-left: auto;
    }
    
    .priority-critical { background: #fee2e2; color: #dc2626; }
    .priority-important { background: #fef3c7; color: #d97706; }
    .priority-nice-to-have { background: #dbeafe; color: #2563eb; }
    
    .actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }
    
    button {
      padding: 0.875rem 2rem;
      font-size: 1rem;
      font-weight: 600;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .btn-primary {
      background: linear-gradient(135deg, var(--primary), var(--primary-dark));
      color: white;
    }
    
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
    }
    
    .btn-secondary {
      background: var(--bg);
      color: var(--text);
      border: 2px solid var(--border);
    }
    
    .btn-secondary:hover {
      border-color: var(--primary);
      color: var(--primary);
    }
    
    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
    
    .progress-section {
      display: none;
    }
    
    .progress-section.active {
      display: block;
    }
    
    .progress-bar {
      height: 8px;
      background: var(--border);
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 1rem;
    }
    
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--primary), var(--success));
      border-radius: 4px;
      transition: width 0.3s;
      width: 0%;
    }
    
    .progress-status {
      color: var(--text-muted);
      text-align: center;
    }
    
    .slides-preview {
      margin-top: 1.5rem;
    }
    
    .slide-preview-item {
      padding: 1rem;
      border: 1px solid var(--border);
      border-radius: 8px;
      margin-bottom: 0.75rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .slide-preview-item:hover {
      border-color: var(--primary);
      background: rgba(37, 99, 235, 0.02);
    }
    
    .slide-preview-item.completed {
      border-left: 4px solid var(--success);
    }
    
    .slide-preview-item.error {
      border-left: 4px solid var(--error);
    }
    
    .slide-preview-item.generating {
      border-left: 4px solid var(--primary);
      animation: pulse 1.5s infinite;
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }
    
    .result-actions {
      display: flex;
      gap: 1rem;
      margin-top: 1.5rem;
      justify-content: center;
    }
    
    .error-message {
      background: #fef2f2;
      border: 1px solid #fecaca;
      color: #dc2626;
      padding: 1rem;
      border-radius: 8px;
      margin-top: 1rem;
      display: none;
    }
    
    .error-message.show {
      display: block;
    }
    
    footer {
      text-align: center;
      padding: 2rem 0;
      color: var(--text-muted);
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>🚀 Pitch Deck Generator</h1>
      <p class="subtitle">Create investor-ready pitch decks powered by AI with real-time web research</p>
    </header>
    
    <form id="deckForm">
      <div class="card">
        <h2>🏢 Company Information</h2>
        
        <div class="form-group">
          <label>Company Name *</label>
          <input type="text" name="company_name" required placeholder="e.g., Acme Inc.">
        </div>
        
        <div class="form-group">
          <label>One-Line Description * <span class="label-hint">What does your company do?</span></label>
          <input type="text" name="description" required placeholder="e.g., AI-powered inventory management for small businesses">
        </div>
        
        <div class="row">
          <div class="form-group">
            <label>Stage *</label>
            <select name="stage" required>
              <option value="">Select stage...</option>
              <option value="Pre-seed">Pre-seed</option>
              <option value="Seed">Seed</option>
              <option value="Series A">Series A</option>
              <option value="Series B">Series B</option>
              <option value="Growth">Growth</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Raise Amount *</label>
            <input type="text" name="raise_amount" required placeholder="e.g., $2M">
          </div>
        </div>
        
        <div class="row">
          <div class="form-group">
            <label>Industry / Sector *</label>
            <input type="text" name="industry" required placeholder="e.g., SaaS, FinTech, Healthcare">
          </div>
          
          <div class="form-group">
            <label>Target Investor Profile</label>
            <input type="text" name="investor_profile" placeholder="e.g., VC, Angel, Strategic">
          </div>
        </div>
        
        <div class="form-group">
          <label>Business Model * <span class="label-hint">How does your company make money?</span></label>
          <input type="text" name="business_model" required placeholder="e.g., B2B SaaS subscription, Transaction fees">
        </div>
        
        <div class="form-group">
          <label>Key Metrics <span class="label-hint">Top 3-5 metrics that matter</span></label>
          <textarea name="key_metrics" placeholder="e.g., $50K MRR, 150 customers, 20% MoM growth, 95% retention"></textarea>
        </div>
        
        <div class="form-group">
          <label>Additional Context <span class="label-hint">Any other relevant information</span></label>
          <textarea name="additional_context" placeholder="e.g., Team background, notable customers, competitive advantages, recent milestones..."></textarea>
        </div>
      </div>
      
      <div class="card">
        <h2>🤖 AI Provider</h2>
        
        <div class="provider-select">
          <label class="provider-option selected">
            <input type="radio" name="provider" value="openai" checked>
            <div><strong>OpenAI</strong></div>
            <div style="font-size: 0.875rem; color: var(--text-muted);">GPT-4o</div>
          </label>
          <label class="provider-option">
            <input type="radio" name="provider" value="perplexity">
            <div><strong>Perplexity</strong></div>
            <div style="font-size: 0.875rem; color: var(--text-muted);">Sonar Pro (Web-grounded)</div>
          </label>
          <label class="provider-option">
            <input type="radio" name="provider" value="azure">
            <div><strong>Azure OpenAI</strong></div>
            <div style="font-size: 0.875rem; color: var(--text-muted);">GPT-4o (Azure AD)</div>
          </label>
        </div>
        
        <div class="form-group" id="apiKeyGroup">
          <label>API Key * <span class="label-hint">Your API key (stored only in browser)</span></label>
          <input type="password" name="api_key" required placeholder="Enter your API key...">
        </div>
        
        <div class="azure-ad-notice" style="display: none; background: #dbeafe; border: 1px solid #93c5fd; border-radius: 8px; padding: 1rem; margin-bottom: 1rem;">
          <strong>🔐 Azure AD Authentication</strong>
          <p style="margin: 0.5rem 0 0 0; font-size: 0.875rem; color: #1e40af;">
            No API key needed. Uses your Azure credentials via:<br>
            • Azure CLI (<code>az login</code>)<br>
            • VS Code Azure extension<br>
            • Environment variables
          </p>
        </div>
        
        <div class="form-group azure-config" style="display: none;">
          <label>Azure Endpoint <span class="label-hint">Leave blank to use default</span></label>
          <input type="text" name="azure_endpoint" placeholder="https://your-resource.openai.azure.com">
        </div>
        
        <div class="form-group azure-config" style="display: none;">
          <label>Deployment Name <span class="label-hint">Leave blank for default (csnf-gpt-4o)</span></label>
          <input type="text" name="azure_deployment" placeholder="csnf-gpt-4o">
        </div>
      </div>
      
      <div class="card">
        <h2>📊 Slides to Generate</h2>
        
        <div class="slide-options">
          {% for slide in slides %}
          <label class="slide-option">
            <input type="checkbox" name="slides" value="{{ slide.id }}" 
              {% if slide.priority in ['Critical', 'Important'] %}checked{% endif %}>
            <span>{{ slide.name }}</span>
            <span class="priority-badge priority-{{ slide.priority.lower().replace(' ', '-') }}">
              {{ slide.priority }}
            </span>
          </label>
          {% endfor %}
        </div>
        
        <div style="margin-top: 1rem; display: flex; gap: 1rem;">
          <button type="button" onclick="selectAll()" class="btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.875rem;">Select All</button>
          <button type="button" onclick="selectCritical()" class="btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.875rem;">Critical Only</button>
        </div>
      </div>
      
      <div class="card">
        <div class="actions">
          <button type="submit" class="btn-primary" id="generateBtn">
            <span>✨</span> Generate Pitch Deck
          </button>
          <button type="button" class="btn-secondary" onclick="generateSingleSlide()">
            <span>📄</span> Generate Single Slide
          </button>
        </div>
        
        <div class="error-message" id="errorMessage"></div>
      </div>
    </form>
    
    <div class="card progress-section" id="progressSection">
      <h2>⏳ Generating Your Pitch Deck</h2>
      
      <div class="progress-bar">
        <div class="progress-fill" id="progressFill"></div>
      </div>
      
      <p class="progress-status" id="progressStatus">Preparing...</p>
      
      <div class="slides-preview" id="slidesPreview"></div>
      
      <div class="result-actions" id="resultActions" style="display: none;">
        <button onclick="viewDeck()" class="btn-primary">
          <span>👁️</span> View Full Deck
        </button>
        <button onclick="downloadDeck()" class="btn-secondary">
          <span>⬇️</span> Download HTML
        </button>
        <button onclick="resetForm()" class="btn-secondary">
          <span>🔄</span> Start Over
        </button>
      </div>
    </div>
    
    <footer>
      <p>Built with ❤️ using AI-powered content generation</p>
    </footer>
  </div>
  
  <script>
    let generatedDeck = null;
    let companyName = '';
    
    // Provider selection
    document.querySelectorAll('.provider-option').forEach(option => {
      option.addEventListener('click', () => {
        document.querySelectorAll('.provider-option').forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
        
        // Show/hide Azure-specific fields and API key
        const provider = option.querySelector('input').value;
        const isAzure = provider === 'azure';
        
        document.querySelectorAll('.azure-config').forEach(el => {
          el.style.display = isAzure ? 'block' : 'none';
        });
        
        // Toggle API key visibility for Azure (uses Azure AD)
        const apiKeyGroup = document.getElementById('apiKeyGroup');
        const apiKeyInput = document.querySelector('input[name="api_key"]');
        const azureAdNotice = document.querySelector('.azure-ad-notice');
        
        if (isAzure) {
          apiKeyGroup.style.display = 'none';
          apiKeyInput.removeAttribute('required');
          azureAdNotice.style.display = 'block';
        } else {
          apiKeyGroup.style.display = 'block';
          apiKeyInput.setAttribute('required', 'required');
          azureAdNotice.style.display = 'none';
        }
      });
    });
    
    function selectAll() {
      document.querySelectorAll('input[name="slides"]').forEach(cb => cb.checked = true);
    }
    
    function selectCritical() {
      document.querySelectorAll('input[name="slides"]').forEach(cb => {
        const badge = cb.closest('.slide-option').querySelector('.priority-badge');
        cb.checked = badge.classList.contains('priority-critical');
      });
    }
    
    document.getElementById('deckForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      await generateDeck();
    });
    
    async function generateDeck() {
      const form = document.getElementById('deckForm');
      const formData = new FormData(form);
      
      const selectedSlides = Array.from(document.querySelectorAll('input[name="slides"]:checked'))
        .map(cb => cb.value);
      
      if (selectedSlides.length === 0) {
        showError('Please select at least one slide to generate.');
        return;
      }
      
      companyName = formData.get('company_name');
      
      const data = {
        company_context: {
          company_name: formData.get('company_name'),
          description: formData.get('description'),
          stage: formData.get('stage'),
          raise_amount: formData.get('raise_amount'),
          industry: formData.get('industry'),
          business_model: formData.get('business_model'),
          key_metrics: formData.get('key_metrics'),
          investor_profile: formData.get('investor_profile'),
          additional_context: formData.get('additional_context')
        },
        slides: selectedSlides,
        provider: formData.get('provider'),
        api_key: formData.get('api_key'),
        azure_endpoint: formData.get('azure_endpoint'),
        azure_deployment: formData.get('azure_deployment')
      };
      
      // Show progress section
      document.getElementById('progressSection').classList.add('active');
      document.getElementById('generateBtn').disabled = true;
      document.getElementById('resultActions').style.display = 'none';
      hideError();
      
      // Initialize slide previews
      const previewContainer = document.getElementById('slidesPreview');
      previewContainer.innerHTML = selectedSlides.map((slideId, i) => {
        const slideConfig = {{ slides_json | safe }}.find(s => s.id === slideId);
        return `<div class="slide-preview-item" id="preview-${slideId}">
          <strong>${i + 1}. ${slideConfig ? slideConfig.name : slideId}</strong>
          <span style="float: right; color: var(--text-muted);">Pending</span>
        </div>`;
      }).join('');
      
      generatedDeck = [];
      
      // Generate slides one by one
      for (let i = 0; i < selectedSlides.length; i++) {
        const slideId = selectedSlides[i];
        const progress = ((i) / selectedSlides.length) * 100;
        document.getElementById('progressFill').style.width = progress + '%';
        document.getElementById('progressStatus').textContent = `Generating slide ${i + 1} of ${selectedSlides.length}...`;
        
        const previewEl = document.getElementById('preview-' + slideId);
        previewEl.classList.add('generating');
        previewEl.querySelector('span').textContent = 'Generating...';
        
        try {
          const response = await fetch('/api/generate-slide', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...data,
              slide_id: slideId
            })
          });
          
          const result = await response.json();
          
          previewEl.classList.remove('generating');
          
          if (result.error) {
            previewEl.classList.add('error');
            previewEl.querySelector('span').textContent = 'Error';
            showError(result.error);
            // Stop generation on first error (likely API key issue)
            if (i === 0) {
              document.getElementById('progressStatus').textContent = 'Generation failed - please check your API key';
              document.getElementById('generateBtn').disabled = false;
              return;
            }
          } else {
            previewEl.classList.add('completed');
            previewEl.querySelector('span').textContent = '✓ Complete';
            generatedDeck.push(result);
          }
        } catch (err) {
          previewEl.classList.remove('generating');
          previewEl.classList.add('error');
          previewEl.querySelector('span').textContent = 'Error';
          showError('Network error: ' + err.message);
        }
      }
      
      document.getElementById('progressFill').style.width = '100%';
      document.getElementById('progressStatus').textContent = 'Generation complete!';
      document.getElementById('resultActions').style.display = 'flex';
      document.getElementById('generateBtn').disabled = false;
    }
    
    async function generateSingleSlide() {
      const slideSelect = prompt('Enter slide type (e.g., problem, solution, market_size, traction, team, ask):');
      if (!slideSelect) return;
      
      const form = document.getElementById('deckForm');
      const formData = new FormData(form);
      
      const data = {
        company_context: {
          company_name: formData.get('company_name'),
          description: formData.get('description'),
          stage: formData.get('stage'),
          raise_amount: formData.get('raise_amount'),
          industry: formData.get('industry'),
          business_model: formData.get('business_model'),
          key_metrics: formData.get('key_metrics'),
          investor_profile: formData.get('investor_profile'),
          additional_context: formData.get('additional_context')
        },
        slide_id: slideSelect.toLowerCase().replace(/ /g, '_'),
        provider: formData.get('provider'),
        api_key: formData.get('api_key'),
        azure_endpoint: formData.get('azure_endpoint'),
        azure_deployment: formData.get('azure_deployment')
      };
      
      try {
        const response = await fetch('/api/generate-slide', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.error) {
          showError(result.error);
        } else {
          // Open single slide in new window
          const htmlResponse = await fetch('/api/slide-html', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              slide: result,
              company_name: formData.get('company_name')
            })
          });
          
          const html = await htmlResponse.text();
          const newWindow = window.open();
          newWindow.document.write(html);
          newWindow.document.close();
        }
      } catch (err) {
        showError('Failed to generate slide: ' + err.message);
      }
    }
    
    async function viewDeck() {
      if (!generatedDeck || generatedDeck.length === 0) {
        showError('No slides generated yet.');
        return;
      }
      
      const response = await fetch('/api/deck-html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slides: generatedDeck,
          company_name: companyName
        })
      });
      
      const html = await response.text();
      const newWindow = window.open();
      newWindow.document.write(html);
      newWindow.document.close();
    }
    
    async function downloadDeck() {
      if (!generatedDeck || generatedDeck.length === 0) {
        showError('No slides generated yet.');
        return;
      }
      
      const response = await fetch('/api/deck-html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slides: generatedDeck,
          company_name: companyName
        })
      });
      
      const html = await response.text();
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = (companyName || 'pitch-deck').replace(/[^a-z0-9]/gi, '_').toLowerCase() + '_pitch_deck.html';
      a.click();
      URL.revokeObjectURL(url);
    }
    
    function resetForm() {
      document.getElementById('progressSection').classList.remove('active');
      generatedDeck = null;
      document.getElementById('progressFill').style.width = '0%';
      document.getElementById('slidesPreview').innerHTML = '';
    }
    
    function showError(message) {
      const el = document.getElementById('errorMessage');
      el.textContent = message;
      el.classList.add('show');
    }
    
    function hideError() {
      document.getElementById('errorMessage').classList.remove('show');
    }
  </script>
</body>
</html>
"""


@app.route('/')
def index():
    """Render the main page."""
    return render_template_string(
        INDEX_TEMPLATE, 
        slides=SLIDE_TYPES,
        slides_json=json.dumps(SLIDE_TYPES)
    )


@app.route('/api/generate-slide', methods=['POST'])
def generate_slide():
    """Generate a single slide."""
    data = request.json
    
    api_key = data.get('api_key', '').strip()
    provider = data.get('provider', 'openai')
    
    # Azure uses Azure AD authentication, so API key is not required
    if not api_key and provider != 'azure':
        return jsonify({'error': f'Please provide a valid {provider.upper()} API key'}), 400
    
    try:
        generator = SlideGenerator(
            api_key=api_key if api_key else None,
            provider=provider,
            azure_endpoint=data.get('azure_endpoint'),
            azure_deployment=data.get('azure_deployment')
        )
        
        slide = generator.generate_slide(
            slide_id=data['slide_id'],
            company_context=data['company_context']
        )
        
        return jsonify(slide)
        
    except Exception as e:
        error_msg = str(e)
        # Provide more helpful error messages
        if 'invalid_api_key' in error_msg.lower() or 'incorrect api key' in error_msg.lower():
            error_msg = f'Invalid {provider.upper()} API key. Please check your API key and try again.'
        elif 'DefaultAzureCredential' in error_msg or 'CredentialUnavailableError' in error_msg:
            error_msg = 'Azure AD authentication failed. Please login with Azure CLI (az login) or VS Code Azure extension.'
        elif 'authentication' in error_msg.lower():
            error_msg = f'Authentication failed. For Azure, ensure you are logged in via Azure CLI or VS Code.'
        elif 'rate limit' in error_msg.lower():
            error_msg = 'API rate limit exceeded. Please wait a moment and try again.'
        elif 'quota' in error_msg.lower():
            error_msg = 'API quota exceeded. Please check your billing/usage limits.'
        
        return jsonify({'error': error_msg}), 500


@app.route('/api/deck-html', methods=['POST'])
def deck_html():
    """Generate HTML for the full deck."""
    data = request.json
    html = generate_deck_html(
        slides=data['slides'],
        company_name=data.get('company_name', 'Pitch Deck')
    )
    return Response(html, mimetype='text/html')


@app.route('/api/slide-html', methods=['POST'])
def slide_html():
    """Generate HTML for a single slide."""
    data = request.json
    html = generate_single_slide_html(
        slide=data['slide'],
        company_name=data.get('company_name', 'Pitch Deck')
    )
    return Response(html, mimetype='text/html')


@app.route('/api/slides', methods=['GET'])
def get_slides():
    """Get list of available slide types."""
    return jsonify(SLIDE_TYPES)


if __name__ == '__main__':
    app.run(debug=True, port=5000)
