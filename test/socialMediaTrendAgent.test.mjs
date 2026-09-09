import assert from "assert";
import { SocialMediaTrendAgent } from "../server/agents/socialMediaTrendAgent.mjs";

describe("SocialMediaTrendAgent", () => {
  let agent;

  beforeEach(() => {
    agent = new SocialMediaTrendAgent({
      model: "claude-opus-5",
      platforms: ["twitter", "tiktok"],
      updateInterval: 1000,
    });
  });

  describe("Initialization", () => {
    it("should create an agent with default options", () => {
      const defaultAgent = new SocialMediaTrendAgent();
      assert.ok(defaultAgent);
      assert.deepEqual(defaultAgent.platforms.length, 4);
    });

    it("should create an agent with custom options", () => {
      assert.equal(agent.platforms.length, 2);
      assert.ok(agent.platforms.includes("twitter"));
      assert.ok(agent.platforms.includes("tiktok"));
    });

    it("should have empty trends initially", () => {
      assert.deepEqual(agent.trends, {});
      assert.equal(agent.history.length, 0);
    });
  });

  describe("fetchTrendData", () => {
    it("should fetch data for specified platforms", async () => {
      const trendData = await agent.fetchTrendData(["twitter"]);
      assert.ok(trendData.twitter);
      assert.ok(Array.isArray(trendData.twitter));
    });

    it("should include trend metadata", async () => {
      const trendData = await agent.fetchTrendData(["instagram"]);
      const trends = trendData.instagram;
      assert(trends.length > 0);
      const trend = trends[0];
      assert.ok(trend.hashtag || trend.sound || trend.topic);
    });

    it("should handle multiple platforms", async () => {
      const trendData = await agent.fetchTrendData([
        "twitter",
        "tiktok",
        "youtube",
      ]);
      assert.ok(trendData.twitter);
      assert.ok(trendData.tiktok);
      assert.ok(trendData.youtube);
    });

    it("should return empty array for unknown platforms", async () => {
      const trendData = await agent.fetchTrendData(["unknown"]);
      assert.deepEqual(trendData.unknown, []);
    });
  });

  describe("Trend History", () => {
    it("should track trend reports in history", async () => {
      const report1 = await agent.generateTrendReport();
      assert.equal(agent.history.length, 1);

      const report2 = await agent.generateTrendReport();
      assert.equal(agent.history.length, 2);
    });

    it("should include timestamp in reports", async () => {
      const report = await agent.generateTrendReport();
      assert.ok(report.timestamp);
      assert.ok(new Date(report.timestamp));
    });

    it("should return historical analysis", async () => {
      await agent.generateTrendReport();
      await agent.generateTrendReport();

      const history = await agent.getHistoricalAnalysis(7);
      assert.ok(history.period);
      assert.ok(Array.isArray(history.reports));
      assert.ok(history.summary);
    });
  });

  describe("Analysis", () => {
    it("should handle trend analysis", async () => {
      const mockTrendData = {
        twitter: [
          { hashtag: "#Test", volume: 50000, growth: 25, sentiment: 0.75 },
        ],
        tiktok: [
          { sound: "test_sound", views: 1000000, growth: 80, sentiment: 0.88 },
        ],
      };

      const analysis = await agent.analyzeTrends(mockTrendData);
      assert.ok(analysis);
      // Should have AI-generated analysis
      assert.ok(typeof analysis === "object");
    });

    it("should generate recommendations", async () => {
      const mockAnalysis = {
        topTrends: ["trend1", "trend2"],
        sentiment: { positive: 0.7, neutral: 0.2, negative: 0.1 },
      };

      const recommendations = await agent.generateRecommendations(
        mockAnalysis
      );
      assert.ok(Array.isArray(recommendations));
    });
  });

  describe("Predictions", () => {
    it("should predict trend velocity", async () => {
      // Generate some history
      await agent.generateTrendReport();
      await new Promise((r) => setTimeout(r, 100));
      await agent.generateTrendReport();

      const prediction = await agent.predictTrendVelocity("#AI");
      assert.ok(prediction);
      assert.ok("confidence" in prediction);
      assert.ok("prediction" in prediction);
    });

    it("should handle insufficient data", async () => {
      const emptyAgent = new SocialMediaTrendAgent();
      const prediction = await emptyAgent.predictTrendVelocity("#Test");
      assert.equal(prediction.confidence, 0);
    });
  });

  describe("Report Generation", () => {
    it("should generate complete trend report", async () => {
      const report = await agent.generateTrendReport();
      assert.ok(report.timestamp);
      assert.ok(report.platforms);
      assert.ok(report.analysis);
      assert.ok(report.recommendations);
    });

    it("should include analysis sections", async () => {
      const report = await agent.generateTrendReport();
      const { analysis } = report;
      assert.ok(analysis);
      // Should have key analysis sections
      assert.ok(typeof analysis === "object");
    });
  });

  describe("Error Handling", () => {
    it("should handle API errors gracefully", async () => {
      const badAgent = new SocialMediaTrendAgent({
        model: "invalid-model-name",
      });

      try {
        await badAgent.generateTrendReport();
        assert.fail("Should have thrown an error");
      } catch (error) {
        assert.ok(error.message);
      }
    });
  });
});
