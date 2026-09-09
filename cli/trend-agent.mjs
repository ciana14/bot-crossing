#!/usr/bin/env node

import { SocialMediaTrendAgent } from '../server/agents/socialMediaTrendAgent.mjs';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const configDir = path.join(process.env.HOME || process.env.USERPROFILE, '.trend-agent');
const configFile = path.join(configDir, 'config.json');

// Ensure config directory exists
if (!fs.existsSync(configDir)) {
  fs.mkdirSync(configDir, { recursive: true });
}

// Default config
const defaultConfig = {
  model: 'claude-opus-5',
  platforms: ['twitter', 'tiktok', 'instagram', 'youtube'],
  updateInterval: 3600000,
};

// Load or create config
function loadConfig() {
  if (fs.existsSync(configFile)) {
    return JSON.parse(fs.readFileSync(configFile, 'utf-8'));
  }
  fs.writeFileSync(configFile, JSON.stringify(defaultConfig, null, 2));
  return defaultConfig;
}

// Save config
function saveConfig(config) {
  fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
}

// Pretty print functions
function printHeader(text) {
  console.log('\n' + chalk.bold.cyan('═'.repeat(60)));
  console.log(chalk.bold.cyan('  ' + text));
  console.log(chalk.bold.cyan('═'.repeat(60)) + '\n');
}

function printTrends(analysis) {
  if (analysis.topTrends) {
    console.log(chalk.bold.yellow('🔥 Top Trends:'));
    analysis.topTrends.forEach((trend, idx) => {
      console.log(
        chalk.green(`  ${idx + 1}.`) +
          ' ' +
          chalk.white(trend)
      );
    });
  }
}

function printSentiment(sentiment) {
  if (sentiment) {
    console.log(chalk.bold.yellow('\n😊 Sentiment Analysis:'));
    Object.entries(sentiment).forEach(([key, value]) => {
      const percent = (value * 100).toFixed(1);
      const emoji = key === 'positive' ? '😊' : key === 'neutral' ? '😐' : '😞';
      const bar = '█'.repeat(Math.round(value * 20)).padEnd(20, '░');
      console.log(
        `  ${emoji} ${key.padEnd(10)} ${bar} ${chalk.bold(percent + '%')}`
      );
    });
  }
}

function printMomentum(momentum) {
  if (momentum) {
    console.log(chalk.bold.yellow('\n📈 Growth Momentum:'));
    Object.entries(momentum).forEach(([key, value]) => {
      const status =
        value === 'accelerating'
          ? chalk.green('↗')
          : value === 'declining'
            ? chalk.red('↘')
            : chalk.yellow('→');
      console.log(`  ${status} ${key}: ${chalk.white(value)}`);
    });
  }
}

function printRecommendations(recommendations) {
  if (recommendations && Array.isArray(recommendations)) {
    console.log(chalk.bold.yellow('\n💡 Recommendations:'));
    recommendations.forEach((rec, idx) => {
      console.log(chalk.cyan(`  ${idx + 1}. ${rec.title}`));
      console.log(chalk.gray(`     ${rec.action}\n`));
    });
  }
}

function printPrediction(prediction) {
  if (prediction) {
    const confidenceBar = '█'.repeat(Math.round(prediction.confidence * 20)).padEnd(20, '░');
    console.log(chalk.bold.yellow('🎯 Trend Prediction:'));
    console.log(chalk.white(`  ${prediction.prediction}`));
    console.log(
      `  Confidence: ${confidenceBar} ${chalk.bold((prediction.confidence * 100).toFixed(0) + '%')}`
    );
    if (prediction.reasoning) {
      console.log(chalk.gray(`  ${prediction.reasoning}`));
    }
  }
}

// Commands
async function cmdReport(platforms) {
  printHeader('Social Media Trend Report');

  const config = loadConfig();
  const selectedPlatforms = platforms.length > 0 ? platforms : config.platforms;

  console.log(chalk.gray(`Analyzing platforms: ${selectedPlatforms.join(', ')}\n`));

  const agent = new SocialMediaTrendAgent({
    model: config.model,
    platforms: selectedPlatforms,
  });

  try {
    console.log(chalk.dim('Fetching and analyzing trends...'));
    const report = await agent.generateTrendReport(selectedPlatforms);

    console.log(
      chalk.gray(`\nReport generated at: ${new Date(report.timestamp).toLocaleString()}\n`)
    );

    printTrends(report.analysis);
    printSentiment(report.analysis.sentiment);
    printMomentum(report.analysis.momentum);
    printRecommendations(report.recommendations);

    console.log(chalk.dim('\n✓ Report complete'));
  } catch (error) {
    console.error(chalk.red(`\n✗ Error: ${error.message}`));
    process.exit(1);
  }
}

async function cmdPredict(trendName) {
  if (!trendName) {
    console.error(chalk.red('Error: Trend name required'));
    console.log('Usage: trend-agent predict <trend-name>');
    process.exit(1);
  }

  printHeader(`Predicting Trend: ${trendName}`);

  const config = loadConfig();
  const agent = new SocialMediaTrendAgent({
    model: config.model,
    platforms: config.platforms,
  });

  try {
    console.log(chalk.dim('Analyzing trend velocity and lifecycle...'));
    const prediction = await agent.predictTrendVelocity(trendName);
    console.log('');
    printPrediction(prediction);
  } catch (error) {
    console.error(chalk.red(`\n✗ Error: ${error.message}`));
    process.exit(1);
  }
}

async function cmdAnalyze(dataFile) {
  if (!dataFile || !fs.existsSync(dataFile)) {
    console.error(chalk.red('Error: Valid JSON file required'));
    console.log('Usage: trend-agent analyze <path-to-data.json>');
    process.exit(1);
  }

  printHeader('Analyzing Custom Trend Data');

  try {
    const trendData = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
    const config = loadConfig();
    const agent = new SocialMediaTrendAgent({ model: config.model });

    console.log(chalk.dim('Analyzing custom trend data...\n'));
    const analysis = await agent.analyzeTrends(trendData);

    printTrends(analysis);
    printSentiment(analysis.sentiment);
    printMomentum(analysis.momentum);
    printRecommendations(analysis);

    console.log(chalk.dim('\n✓ Analysis complete'));
  } catch (error) {
    console.error(chalk.red(`\n✗ Error: ${error.message}`));
    process.exit(1);
  }
}

async function cmdMonitor(duration = 3600000) {
  printHeader('Starting Trend Monitoring');

  const config = loadConfig();
  const agent = new SocialMediaTrendAgent({
    model: config.model,
    platforms: config.platforms,
    updateInterval: Math.min(duration / 5, 600000), // Update 5 times over duration
  });

  console.log(
    chalk.gray(
      `Monitoring for ${Math.round(duration / 60000)} minutes...\n`
    )
  );
  console.log(chalk.dim('(Press Ctrl+C to stop)\n'));

  let updateCount = 0;
  const startTime = Date.now();

  try {
    await new Promise((resolve, reject) => {
      const intervalId = agent.monitorTrends((error, report) => {
        updateCount++;
        console.clear();
        console.log(chalk.bold.cyan(`Trend Monitor - Update #${updateCount}`));
        console.log(chalk.gray(new Date().toLocaleTimeString()) + '\n');

        if (error) {
          console.error(chalk.red(`✗ Error: ${error.message}`));
        } else {
          printTrends(report.analysis);
          printSentiment(report.analysis.sentiment);
          printRecommendations(report.recommendations);
        }

        const elapsed = Date.now() - startTime;
        if (elapsed >= duration) {
          clearInterval(intervalId);
          resolve();
        }
      });

      // Handle Ctrl+C
      process.on('SIGINT', () => {
        clearInterval(intervalId);
        console.log(chalk.yellow('\n\nMonitoring stopped.'));
        console.log(chalk.gray(`Total updates: ${updateCount}`));
        process.exit(0);
      });
    });
  } catch (error) {
    console.error(chalk.red(`\n✗ Error: ${error.message}`));
    process.exit(1);
  }
}

function cmdConfig() {
  printHeader('Configuration');

  const config = loadConfig();
  console.log(chalk.yellow('Current Configuration:'));
  console.log(chalk.gray(JSON.stringify(config, null, 2)));
  console.log(
    chalk.yellow('\nConfig file location:'),
    chalk.gray(configFile)
  );
}

function cmdHelp() {
  console.log(chalk.bold.cyan('\n📱 Social Media Trend Agent CLI\n'));

  console.log(chalk.yellow('Commands:\n'));

  console.log(chalk.green('  report [platforms]'));
  console.log('    Generate a trend report');
  console.log('    Platforms: twitter, tiktok, instagram, youtube (space-separated)\n');

  console.log(chalk.green('  predict <trend-name>'));
  console.log('    Predict the velocity and lifecycle of a trend\n');

  console.log(chalk.green('  analyze <data-file>'));
  console.log('    Analyze custom trend data from a JSON file\n');

  console.log(chalk.green('  monitor [duration-ms]'));
  console.log('    Start monitoring trends (default: 1 hour)\n');

  console.log(chalk.green('  config'));
  console.log('    Show current configuration\n');

  console.log(chalk.green('  help'));
  console.log('    Show this help message\n');

  console.log(chalk.yellow('Examples:\n'));

  console.log(chalk.gray('  # Get full trend report'));
  console.log(chalk.white('  trend-agent report\n'));

  console.log(chalk.gray('  # Get trends for specific platforms'));
  console.log(chalk.white('  trend-agent report twitter tiktok\n'));

  console.log(chalk.gray('  # Predict a trend'));
  console.log(chalk.white('  trend-agent predict "#AI"\n'));

  console.log(chalk.gray('  # Analyze custom data'));
  console.log(chalk.white('  trend-agent analyze ./trends.json\n'));

  console.log(chalk.gray('  # Monitor trends for 30 minutes'));
  console.log(chalk.white('  trend-agent monitor 1800000\n'));
}

// Main CLI handler
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'help';

  switch (command.toLowerCase()) {
    case 'report':
      await cmdReport(args.slice(1));
      break;
    case 'predict':
      await cmdPredict(args[1]);
      break;
    case 'analyze':
      await cmdAnalyze(args[1]);
      break;
    case 'monitor':
      await cmdMonitor(parseInt(args[1]) || 3600000);
      break;
    case 'config':
      cmdConfig();
      break;
    case 'help':
    case '-h':
    case '--help':
      cmdHelp();
      break;
    default:
      console.error(chalk.red(`\n✗ Unknown command: ${command}\n`));
      cmdHelp();
      process.exit(1);
  }
}

main().catch((error) => {
  console.error(chalk.red(`\nFatal error: ${error.message}`));
  process.exit(1);
});
