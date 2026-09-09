# Social Media Trend Agent CLI

A powerful command-line tool for analyzing social media trends locally using Claude AI.

## Installation

```bash
npm install
npm link  # Make 'trend-agent' available globally
```

Or run directly:

```bash
npm run trend-agent [command] [options]
```

## Quick Start

### Get a full trend report
```bash
trend-agent report
```

### Get trends for specific platforms
```bash
trend-agent report twitter tiktok
```

### Predict a trend's lifecycle
```bash
trend-agent predict "#AI"
```

### Analyze custom trend data
```bash
trend-agent analyze ./cli/sample-trends.json
```

### Monitor trends in real-time
```bash
trend-agent monitor
# or for 30 minutes
trend-agent monitor 1800000
```

## Commands

### `report [platforms]`
Generate a comprehensive trend report across social media platforms.

**Arguments:**
- `platforms` (optional): Space-separated list of platforms to analyze
  - Available: `twitter`, `tiktok`, `instagram`, `youtube`
  - Default: All platforms

**Output:**
- 🔥 Top trending topics/hashtags
- 😊 Sentiment analysis (positive/neutral/negative)
- 📈 Growth momentum per trend
- 💡 Actionable recommendations

**Examples:**
```bash
trend-agent report
trend-agent report twitter tiktok instagram
trend-agent report youtube
```

---

### `predict <trend-name>`
Predict whether a trend will peak, sustain, or crash.

**Arguments:**
- `trend-name` (required): Name of the trend to analyze (e.g., "#AI", "web3", "coding")

**Output:**
- Prediction (peak within 7 days, sustain 30+, crash within 48h, etc.)
- Confidence level (0-100%)
- Reasoning and analysis

**Examples:**
```bash
trend-agent predict "#AI"
trend-agent predict "web3"
trend-agent predict "coding"
```

---

### `analyze <data-file>`
Analyze custom trend data from a JSON file.

**Arguments:**
- `data-file` (required): Path to a JSON file containing trend data

**File Format:**
```json
{
  "twitter": [
    {"hashtag": "#Topic", "volume": 100000, "growth": 25, "sentiment": 0.85},
    ...
  ],
  "tiktok": [
    {"sound": "...", "views": 1000000, "growth": 80, "sentiment": 0.88},
    ...
  ],
  "instagram": [...],
  "youtube": [...]
}
```

**Examples:**
```bash
trend-agent analyze ./cli/sample-trends.json
trend-agent analyze ~/my-trends.json
```

---

### `monitor [duration-ms]`
Start real-time trend monitoring with live updates.

**Arguments:**
- `duration-ms` (optional): How long to monitor in milliseconds
  - Default: 3,600,000 (1 hour)
  - 30 minutes: 1800000
  - 5 minutes: 300000

**Behavior:**
- Updates 5 times during the monitoring period
- Shows timestamp and update count
- Live sentiment and trend data
- Press `Ctrl+C` to stop early

**Examples:**
```bash
trend-agent monitor
trend-agent monitor 1800000  # 30 minutes
trend-agent monitor 300000   # 5 minutes
```

---

### `config`
Display current configuration.

Shows:
- Model being used (Claude version)
- Platforms being monitored
- Update interval
- Config file location

**Examples:**
```bash
trend-agent config
```

---

### `help`
Show help and examples.

**Aliases:**
```bash
trend-agent help
trend-agent -h
trend-agent --help
```

---

## Configuration

The CLI automatically creates a configuration file at:
- **Linux/Mac:** `~/.trend-agent/config.json`
- **Windows:** `%USERPROFILE%\.trend-agent\config.json`

### Default Configuration
```json
{
  "model": "claude-opus-5",
  "platforms": ["twitter", "tiktok", "instagram", "youtube"],
  "updateInterval": 3600000
}
```

### Customize Configuration
Edit the config file directly:

**Mac/Linux:**
```bash
nano ~/.trend-agent/config.json
```

**Windows:**
```bash
notepad %USERPROFILE%\.trend-agent\config.json
```

Then reload:
```bash
trend-agent config  # View updated config
```

## Environment Setup

### Set Your Claude API Key

```bash
# Linux/Mac
export ANTHROPIC_API_KEY="your-api-key"

# Windows (PowerShell)
$env:ANTHROPIC_API_KEY = "your-api-key"

# Windows (Command Prompt)
set ANTHROPIC_API_KEY=your-api-key
```

### Persistent Configuration (Optional)

**Linux/Mac:** Add to `~/.bashrc` or `~/.zshrc`
```bash
export ANTHROPIC_API_KEY="your-api-key"
```

**Windows:** Add to environment variables via System Settings

## Examples

### Scenario 1: Check Current Trends
```bash
$ trend-agent report

═════════════════════════════════════════════════════════════
  Social Media Trend Report
═════════════════════════════════════════════════════════════

Analyzing platforms: twitter, tiktok, instagram, youtube

Fetching and analyzing trends...

Report generated at: 1/15/2025, 10:30:00 AM

🔥 Top Trends:
  1. #ClaudeAI
  2. #WebDevelopment
  3. #OpenSource

😊 Sentiment Analysis:
  😊 positive  ████████████████░░░░ 82.5%
  😐 neutral   ████░░░░░░░░░░░░░░░░ 12.3%
  😞 negative  ██░░░░░░░░░░░░░░░░░░  5.2%

📈 Growth Momentum:
  ↗ #ClaudeAI: accelerating
  → #WebDevelopment: stable
  ↘ #OpenSource: declining

💡 Recommendations:
  1. Leverage #ClaudeAI trending on Twitter
     Create educational content about Claude API integrations
  ...
```

### Scenario 2: Predict a Specific Trend
```bash
$ trend-agent predict "#AI"

═════════════════════════════════════════════════════════════
  Predicting Trend: #AI
═════════════════════════════════════════════════════════════

Analyzing trend velocity and lifecycle...

🎯 Trend Prediction:
  Peak within 7 days
  Confidence: ████████████████░░ 85%
  Growth momentum is strong with consistent engagement across platforms
```

### Scenario 3: Analyze Custom Data
```bash
$ trend-agent analyze ./my-trends.json

═════════════════════════════════════════════════════════════
  Analyzing Custom Trend Data
═════════════════════════════════════════════════════════════

Analyzing custom trend data...

🔥 Top Trends:
  1. #ClaudeAI
  2. #TechStyle
  ...
```

### Scenario 4: Monitor Trends Live
```bash
$ trend-agent monitor 600000

═════════════════════════════════════════════════════════════
  Starting Trend Monitoring
═════════════════════════════════════════════════════════════

Monitoring for 10 minutes...

(Press Ctrl+C to stop)

Trend Monitor - Update #1
10:30:45 AM

🔥 Top Trends:
  1. #AI
  2. #WebDev
  ...

(Updates every 2 minutes)
```

## Troubleshooting

### Command not found: `trend-agent`
Make sure you installed the package:
```bash
npm install
npm link
```

Or run with npm:
```bash
npm run trend-agent report
```

### API Error
Ensure `ANTHROPIC_API_KEY` is set:
```bash
echo $ANTHROPIC_API_KEY  # Linux/Mac
echo %ANTHROPIC_API_KEY%  # Windows
```

### JSON Parse Error (analyze command)
Check that your JSON file is valid:
```bash
# Validate with jq (if installed)
jq . your-file.json

# Or use an online JSON validator
```

### Slow Performance
- Check your internet connection
- Consider using a faster Claude model in config
- Run analyze on smaller data files

## Tips & Tricks

### Save Reports to File
```bash
trend-agent report > report.txt
trend-agent report twitter > twitter-trends.txt
```

### Combine with Other Tools
```bash
# Get JSON output and pipe to jq
trend-agent analyze sample.json | grep -i "recommendation"

# Schedule automated reports
# Linux/Mac (crontab)
0 9 * * * trend-agent report > ~/daily-trends.txt

# Windows (Task Scheduler)
# Create task running: trend-agent report > %USERPROFILE%\daily-trends.txt
```

### Analyze Multiple Files
```bash
for file in trends-*.json; do
  trend-agent analyze "$file"
done
```

## Data Privacy

- All analysis happens locally on your machine
- Claude API is called but results are not stored by Anthropic
- Config and data are stored only in `~/.trend-agent/`
- No data is collected or shared

## Performance Tips

- Use `report` for quick trend checks (1-2 seconds)
- Use `predict` for in-depth analysis (2-3 seconds)
- Use `monitor` for continuous tracking with updates
- Reduce update frequency in config for large-scale monitoring

## Support

For issues or questions:
1. Check the help: `trend-agent help`
2. Verify your API key is set
3. Check your internet connection
4. Review error messages for details

## License

MIT
