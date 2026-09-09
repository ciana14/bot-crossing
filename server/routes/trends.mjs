import express from "express";
import { SocialMediaTrendAgent } from "../agents/socialMediaTrendAgent.mjs";

const router = express.Router();
const trendAgent = new SocialMediaTrendAgent({
  model: "claude-opus-5",
  platforms: ["twitter", "tiktok", "instagram", "youtube"],
  updateInterval: 3600000,
});

// GET /api/trends/report - Get latest trend report
router.get("/report", async (req, res) => {
  try {
    const report = await trendAgent.generateTrendReport();
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/trends/report/:platform - Get trends for specific platform
router.get("/report/:platform", async (req, res) => {
  try {
    const { platform } = req.params;
    const report = await trendAgent.generateTrendReport([platform]);
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/trends/analyze - Analyze custom trend data
router.post("/analyze", express.json(), async (req, res) => {
  try {
    const { trendData } = req.body;
    if (!trendData) {
      return res
        .status(400)
        .json({ error: "trendData is required in request body" });
    }
    const analysis = await trendAgent.analyzeTrends(trendData);
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/trends/predict/:trendName - Predict trend velocity
router.get("/predict/:trendName", async (req, res) => {
  try {
    const { trendName } = req.params;
    const prediction = await trendAgent.predictTrendVelocity(trendName);
    res.json(prediction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/trends/history - Get historical analysis
router.get("/history", async (req, res) => {
  try {
    const days = req.query.days || 7;
    const history = await trendAgent.getHistoricalAnalysis(parseInt(days));
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/trends/monitor - Start monitoring trends (webhook style)
router.post("/monitor", express.json(), async (req, res) => {
  try {
    const { webhookUrl } = req.body;
    if (!webhookUrl) {
      return res
        .status(400)
        .json({ error: "webhookUrl is required in request body" });
    }

    let monitoringId;
    const callback = (error, report) => {
      if (error) {
        console.error("Trend monitoring error:", error);
      } else {
        fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(report),
        }).catch((err) => console.error("Webhook delivery error:", err));
      }
    };

    monitoringId = await trendAgent.monitorTrends(callback);

    res.json({
      status: "monitoring",
      monitoringId,
      message: "Trend monitoring started. Updates will be sent to webhook.",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/trends/recommendations - Get actionable recommendations
router.get("/recommendations", async (req, res) => {
  try {
    const report = await trendAgent.generateTrendReport();
    res.json({
      timestamp: report.timestamp,
      analysis: report.analysis,
      recommendations: report.recommendations,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
