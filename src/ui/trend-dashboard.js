/**
 * Social Media Trend Dashboard UI
 * Vanilla JS module for displaying trend analysis
 */

export class TrendDashboard {
  constructor(containerSelector = '#trends-dashboard') {
    this.container = document.querySelector(containerSelector)
    this.report = null
    this.loading = false
    this.activeTab = 'trends'
    this.init()
  }

  init() {
    if (!this.container) {
      console.warn('Trend dashboard container not found')
      return
    }
    this.render()
    this.attachEventListeners()
  }

  render() {
    this.container.innerHTML = `
      <div class="trend-dashboard">
        <header class="trend-header">
          <h1>📱 Social Media Trend Agent</h1>
          <div class="trend-controls">
            <button class="trend-btn" id="refresh-trends">
              <span class="btn-label">Refresh Trends</span>
            </button>
            <button class="trend-btn" id="get-recommendations">
              Get Recommendations
            </button>
            <button class="trend-btn" id="view-history">
              View History
            </button>
          </div>
        </header>

        <div id="trend-error" class="trend-error" style="display: none;"></div>

        <div class="trend-tabs">
          <button class="trend-tab active" data-tab="trends">Trends</button>
          <button class="trend-tab" data-tab="sentiment">Sentiment</button>
          <button class="trend-tab" data-tab="recommendations">Recommendations</button>
          <button class="trend-tab" data-tab="raw">Raw Data</button>
        </div>

        <div class="trend-content">
          <div id="trends-tab" class="trend-section active">
            <h2>🔥 Trending Now</h2>
            <div id="trends-list" class="trends-list"></div>
          </div>

          <div id="sentiment-tab" class="trend-section">
            <h2>😊 Sentiment Analysis</h2>
            <div id="sentiment-grid" class="sentiment-grid"></div>
          </div>

          <div id="recommendations-tab" class="trend-section">
            <h2>💡 Recommended Actions</h2>
            <div id="recommendations-list" class="recommendations-list"></div>
          </div>

          <div id="raw-tab" class="trend-section">
            <h2>📊 Raw Data</h2>
            <pre id="raw-data" class="raw-data"></pre>
          </div>
        </div>

        <footer class="trend-footer">
          <p id="last-updated">Loading...</p>
          <p id="platforms-info">Analyzing...</p>
        </footer>
      </div>
    `

    this.addStyles()
  }

  addStyles() {
    if (document.getElementById('trend-dashboard-styles')) return

    const style = document.createElement('style')
    style.id = 'trend-dashboard-styles'
    style.textContent = `
      .trend-dashboard {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 12px;
        padding: 20px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        color: #2d3748;
      }

      .trend-header {
        background: rgba(255, 255, 255, 0.95);
        padding: 30px;
        border-radius: 12px;
        margin-bottom: 20px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      }

      .trend-header h1 {
        margin: 0 0 20px 0;
        font-size: 28px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .trend-controls {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      }

      .trend-btn {
        padding: 10px 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.3s ease;
        box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
      }

      .trend-btn:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
      }

      .trend-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .trend-error {
        background: #fed7d7;
        color: #742a2a;
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 20px;
        border-left: 4px solid #fc8181;
      }

      .trend-tabs {
        display: flex;
        gap: 0;
        background: rgba(255, 255, 255, 0.95);
        border-radius: 12px 12px 0 0;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      }

      .trend-tab {
        flex: 1;
        padding: 15px;
        background: transparent;
        border: none;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        color: #718096;
        transition: all 0.3s ease;
        border-bottom: 3px solid transparent;
      }

      .trend-tab:hover {
        color: #667eea;
        background: rgba(102, 126, 234, 0.05);
      }

      .trend-tab.active {
        color: #667eea;
        border-bottom-color: #667eea;
        background: rgba(102, 126, 234, 0.05);
      }

      .trend-content {
        background: rgba(255, 255, 255, 0.95);
        padding: 30px;
        border-radius: 0 0 12px 12px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      }

      .trend-section {
        display: none;
      }

      .trend-section.active {
        display: block;
      }

      .trend-section h2 {
        margin-top: 0;
        margin-bottom: 20px;
        color: #2d3748;
        font-size: 20px;
      }

      .trends-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 15px;
      }

      .trend-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 15px;
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
        border-radius: 8px;
        border-left: 4px solid #667eea;
        transition: all 0.3s ease;
      }

      .trend-item:hover {
        transform: translateX(4px);
        box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
      }

      .trend-rank {
        font-weight: bold;
        color: #667eea;
        font-size: 16px;
        min-width: 30px;
      }

      .trend-name {
        color: #2d3748;
        font-weight: 500;
        flex: 1;
      }

      .sentiment-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
      }

      .sentiment-card {
        padding: 20px;
        background: rgba(245, 247, 250, 0.8);
        border-radius: 8px;
        border: 2px solid #e2e8f0;
      }

      .sentiment-label {
        font-weight: 600;
        margin-bottom: 12px;
        color: #2d3748;
        font-size: 14px;
      }

      .sentiment-bar {
        background: #e2e8f0;
        height: 24px;
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 8px;
      }

      .sentiment-bar-fill {
        height: 100%;
        transition: width 0.3s ease;
      }

      .sentiment-bar-fill.positive {
        background: linear-gradient(90deg, #48bb78, #38a169);
      }

      .sentiment-bar-fill.neutral {
        background: linear-gradient(90deg, #ed8936, #dd6b20);
      }

      .sentiment-bar-fill.negative {
        background: linear-gradient(90deg, #f56565, #e53e3e);
      }

      .sentiment-value {
        text-align: right;
        font-size: 12px;
        font-weight: 600;
        color: #718096;
      }

      .recommendations-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 20px;
      }

      .recommendation-card {
        padding: 20px;
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
        border-radius: 8px;
        border-left: 4px solid #667eea;
      }

      .recommendation-card h3 {
        margin-top: 0;
        margin-bottom: 10px;
        color: #2d3748;
        font-size: 16px;
      }

      .recommendation-card p {
        margin: 0;
        color: #4a5568;
        font-size: 14px;
        line-height: 1.6;
      }

      .raw-data {
        background: #1a202c;
        color: #68d391;
        padding: 20px;
        border-radius: 8px;
        overflow: auto;
        font-size: 12px;
        line-height: 1.5;
        max-height: 500px;
      }

      .trend-footer {
        background: rgba(255, 255, 255, 0.95);
        padding: 20px;
        border-radius: 12px;
        margin-top: 20px;
        text-align: center;
        color: #718096;
        font-size: 13px;
      }

      .trend-footer p {
        margin: 5px 0;
      }

      .trend-loading {
        text-align: center;
        padding: 40px;
        color: #718096;
      }
    `
    document.head.appendChild(style)
  }

  attachEventListeners() {
    // Refresh trends
    document.getElementById('refresh-trends').addEventListener('click', () => this.fetchTrends())

    // Get recommendations
    document.getElementById('get-recommendations').addEventListener('click', () => this.fetchRecommendations())

    // View history
    document.getElementById('view-history').addEventListener('click', () => this.fetchHistory())

    // Tab switching
    document.querySelectorAll('.trend-tab').forEach((tab) => {
      tab.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab))
    })

    // Initial load
    this.fetchTrends()
  }

  async fetchTrends() {
    this.setLoading(true)
    try {
      const response = await fetch('/api/trends/report')
      this.report = await response.json()
      this.renderTrends()
      this.hideError()
    } catch (error) {
      this.showError('Failed to fetch trends: ' + error.message)
    } finally {
      this.setLoading(false)
    }
  }

  async fetchRecommendations() {
    this.setLoading(true)
    try {
      const response = await fetch('/api/trends/recommendations')
      const data = await response.json()
      if (this.report) {
        this.report.recommendations = data.recommendations
      }
      this.renderRecommendations()
      this.switchTab('recommendations')
      this.hideError()
    } catch (error) {
      this.showError('Failed to fetch recommendations: ' + error.message)
    } finally {
      this.setLoading(false)
    }
  }

  async fetchHistory() {
    this.setLoading(true)
    try {
      const response = await fetch('/api/trends/history?days=7')
      const data = await response.json()
      console.log('History:', data)
      this.hideError()
    } catch (error) {
      this.showError('Failed to fetch history: ' + error.message)
    } finally {
      this.setLoading(false)
    }
  }

  renderTrends() {
    if (!this.report) return

    const trendsList = document.getElementById('trends-list')
    if (this.report.analysis?.topTrends) {
      trendsList.innerHTML = this.report.analysis.topTrends
        .map(
          (trend, idx) =>
            `<div class="trend-item">
          <span class="trend-rank">#${idx + 1}</span>
          <span class="trend-name">${trend}</span>
        </div>`
        )
        .join('')
    }

    this.renderSentiment()
    this.updateFooter()
  }

  renderSentiment() {
    if (!this.report?.analysis?.sentiment) return

    const grid = document.getElementById('sentiment-grid')
    const sentiment = this.report.analysis.sentiment

    grid.innerHTML = Object.entries(sentiment)
      .map(
        ([key, value]) => `
      <div class="sentiment-card">
        <div class="sentiment-label">
          ${key === 'positive' ? '😊' : key === 'neutral' ? '😐' : '😞'}
          ${key.charAt(0).toUpperCase() + key.slice(1)}
        </div>
        <div class="sentiment-bar">
          <div class="sentiment-bar-fill ${key}" style="width: ${value * 100}%"></div>
        </div>
        <div class="sentiment-value">${(value * 100).toFixed(1)}%</div>
      </div>
    `
      )
      .join('')
  }

  renderRecommendations() {
    if (!this.report?.recommendations) return

    const list = document.getElementById('recommendations-list')
    list.innerHTML = this.report.recommendations
      .map(
        (rec) => `
      <div class="recommendation-card">
        <h3>${rec.title}</h3>
        <p>${rec.action}</p>
      </div>
    `
      )
      .join('')
  }

  switchTab(tabName) {
    // Hide all sections
    document.querySelectorAll('.trend-section').forEach((s) => s.classList.remove('active'))
    document.querySelectorAll('.trend-tab').forEach((t) => t.classList.remove('active'))

    // Show selected section
    const section = document.getElementById(`${tabName}-tab`)
    if (section) {
      section.classList.add('active')
    }

    // Highlight tab
    event?.target?.classList.add('active')

    if (tabName === 'raw' && this.report) {
      document.getElementById('raw-data').textContent = JSON.stringify(this.report, null, 2)
    }

    if (tabName === 'recommendations' && this.report) {
      this.renderRecommendations()
    }
  }

  updateFooter() {
    if (!this.report) return

    const lastUpdated = document.getElementById('last-updated')
    const platformsInfo = document.getElementById('platforms-info')

    if (this.report.timestamp) {
      lastUpdated.textContent = `Last updated: ${new Date(this.report.timestamp).toLocaleString()}`
    }

    if (this.report.platforms) {
      platformsInfo.textContent = `Platforms: ${this.report.platforms.join(', ')}`
    }
  }

  setLoading(loading) {
    this.loading = loading
    const btn = document.getElementById('refresh-trends')
    if (btn) {
      btn.disabled = loading
      btn.querySelector('.btn-label').textContent = loading ? 'Refreshing...' : 'Refresh Trends'
    }
  }

  showError(message) {
    const errorEl = document.getElementById('trend-error')
    if (errorEl) {
      errorEl.textContent = message
      errorEl.style.display = 'block'
    }
  }

  hideError() {
    const errorEl = document.getElementById('trend-error')
    if (errorEl) {
      errorEl.style.display = 'none'
    }
  }
}
