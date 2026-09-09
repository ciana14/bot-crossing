# Social Media Trend Agent

An intelligent agent that monitors, analyzes, and predicts social media trends using Claude AI.

## Features

- **Real-time Trend Analysis**: Analyzes trends across Twitter, TikTok, Instagram, and YouTube
- **AI-Powered Insights**: Uses Claude to identify patterns, sentiment, and growth momentum
- **Predictive Analytics**: Forecasts trend lifecycles and peak times
- **Historical Tracking**: Maintains trend history for longitudinal analysis
- **Actionable Recommendations**: Generates content strategy recommendations based on trends
- **Webhook Support**: Can push updates to external systems

## Installation

```bash
npm install @anthropic-ai/sdk express
```

## Quick Start

```javascript
import { SocialMediaTrendAgent } from './socialMediaTrendAgent.mjs';

const agent = new SocialMediaTrendAgent({
  model: 'claude-opus-5',
  platforms: ['twitter', 'tiktok', 'instagram', 'youtube'],
  updateInterval: 3600000 // 1 hour
});

// Get a trend report
const report = await agent.generateTrendReport();
console.log(report);
```

## API Endpoints

### GET /api/trends/report
Get the latest trend report across all platforms.

**Response:**
```json
{
  "timestamp": "2025-01-15T10:30:00Z",
  "platforms": ["twitter", "tiktok", "instagram", "youtube"],
  "analysis": {
    "topTrends": [...],
    "sentiment": {...},
    "momentum": {...},
    "recommendations": [...]
  }
}
```

### GET /api/trends/report/:platform
Get trends for a specific platform.

**Parameters:**
- `platform`: twitter | tiktok | instagram | youtube

### POST /api/trends/analyze
Analyze custom trend data.

**Request Body:**
```json
{
  "trendData": {
    "hashtags": [...],
    "volumes": [...],
    "timestamps": [...]
  }
}
```

### GET /api/trends/predict/:trendName
Predict trend velocity and lifecycle.

**Parameters:**
- `trendName`: Name of the trend to analyze

**Response:**
```json
{
  "confidence": 0.85,
  "prediction": "Peak within 7 days",
  "reasoning": "..."
}
```

### GET /api/trends/history
Get historical trend analysis.

**Query Parameters:**
- `days`: Number of days to analyze (default: 7)

### POST /api/trends/monitor
Start monitoring trends with webhook delivery.

**Request Body:**
```json
{
  "webhookUrl": "https://example.com/webhook"
}
```

**Response:**
```json
{
  "status": "monitoring",
  "monitoringId": "...",
  "message": "Trend monitoring started"
}
```

### GET /api/trends/recommendations
Get actionable content strategy recommendations.

**Response:**
```json
{
  "timestamp": "...",
  "analysis": {...},
  "recommendations": [
    {
      "title": "Leverage AI hashtags on TikTok",
      "action": "Create 5-second clips demonstrating AI tools"
    },
    ...
  ]
}
```

## Usage Examples

### Basic Analysis
```javascript
const agent = new SocialMediaTrendAgent();
const report = await agent.generateTrendReport(['twitter', 'tiktok']);
console.log(report.analysis.recommendations);
```

### Predict Trend Lifecycle
```javascript
const prediction = await agent.predictTrendVelocity('#AI');
if (prediction.confidence > 0.8) {
  console.log(`High confidence: ${prediction.prediction}`);
}
```

### Monitor Trends Over Time
```javascript
const intervalId = await agent.monitorTrends((error, report) => {
  if (!error) {
    console.log('New trends detected:', report.analysis.topTrends);
  }
});

// Stop monitoring
clearInterval(intervalId);
```

### Historical Analysis
```javascript
const history = await agent.getHistoricalAnalysis(30); // Last 30 days
console.log(`Analyzed ${history.reports.length} reports`);
```

## How It Works

1. **Data Collection**: Fetches trend data from social media APIs (currently uses mock data)
2. **AI Analysis**: Sends data to Claude for sophisticated analysis
3. **Pattern Recognition**: Identifies emerging trends, sentiment shifts, and growth patterns
4. **Prediction**: Forecasts trend lifecycle and peak times
5. **Recommendations**: Generates actionable content strategy recommendations
6. **Historical Tracking**: Maintains trend history for comparative analysis

## Configuration

```javascript
const agent = new SocialMediaTrendAgent({
  model: 'claude-opus-5',           // Claude model to use
  platforms: ['twitter', 'tiktok'], // Platforms to monitor
  updateInterval: 3600000            // Update frequency (ms)
});
```

## Integration with Server

Add to your Express server:

```javascript
import trendsRouter from './routes/trends.mjs';

app.use('/api/trends', trendsRouter);
```

## Production Considerations

- Replace mock data fetching with real social media APIs (Twitter API v2, TikTok API, etc.)
- Implement rate limiting for API endpoints
- Add authentication for sensitive endpoints
- Store trend history in a database
- Cache results to reduce API calls
- Implement error handling and retry logic
- Monitor Claude API usage and costs

## License

MIT
