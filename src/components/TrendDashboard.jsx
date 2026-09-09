import React, { useState, useEffect } from 'react';
import styles from './TrendDashboard.module.css';

export function TrendDashboard() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('trends');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTrends();
  }, []);

  const fetchTrends = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/trends/report');
      const data = await response.json();
      setReport(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch trends: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/trends/recommendations');
      const data = await response.json();
      setReport(prev => ({
        ...prev,
        recommendations: data.recommendations
      }));
      setActiveTab('recommendations');
      setError(null);
    } catch (err) {
      setError('Failed to fetch recommendations: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/trends/history?days=7');
      const data = await response.json();
      console.log('History:', data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch history: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!report) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingSpinner}>
          <p>Loading trends...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>📱 Social Media Trend Agent</h1>
        <div className={styles.controls}>
          <button
            onClick={fetchTrends}
            disabled={loading}
            className={styles.button}
          >
            {loading ? 'Refreshing...' : 'Refresh Trends'}
          </button>
          <button
            onClick={fetchRecommendations}
            disabled={loading}
            className={styles.button}
          >
            Get Recommendations
          </button>
          <button
            onClick={fetchHistory}
            disabled={loading}
            className={styles.button}
          >
            View History
          </button>
        </div>
      </header>

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'trends' ? styles.active : ''}`}
          onClick={() => setActiveTab('trends')}
        >
          Trends
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'sentiment' ? styles.active : ''}`}
          onClick={() => setActiveTab('sentiment')}
        >
          Sentiment
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'recommendations' ? styles.active : ''}`}
          onClick={() => setActiveTab('recommendations')}
        >
          Recommendations
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'raw' ? styles.active : ''}`}
          onClick={() => setActiveTab('raw')}
        >
          Raw Data
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === 'trends' && report.analysis && (
          <div className={styles.section}>
            <h2>🔥 Trending Now</h2>
            {report.analysis.topTrends ? (
              <ul className={styles.trendList}>
                {report.analysis.topTrends.map((trend, idx) => (
                  <li key={idx} className={styles.trendItem}>
                    <span className={styles.rank}>#{idx + 1}</span>
                    <span className={styles.name}>{trend}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Analyzing trends...</p>
            )}
          </div>
        )}

        {activeTab === 'sentiment' && report.analysis && (
          <div className={styles.section}>
            <h2>😊 Sentiment Analysis</h2>
            {report.analysis.sentiment ? (
              <div className={styles.sentimentGrid}>
                {Object.entries(report.analysis.sentiment).map(([key, value]) => (
                  <div key={key} className={styles.sentimentCard}>
                    <div className={styles.sentimentLabel}>
                      {key === 'positive' && '😊'}
                      {key === 'neutral' && '😐'}
                      {key === 'negative' && '😞'}
                      {' '}{key.charAt(0).toUpperCase() + key.slice(1)}
                    </div>
                    <div className={styles.sentimentBar}>
                      <div
                        className={`${styles.bar} ${styles[key]}`}
                        style={{ width: `${(value * 100).toFixed(1)}%` }}
                      ></div>
                    </div>
                    <div className={styles.sentimentValue}>
                      {(value * 100).toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>Analyzing sentiment...</p>
            )}
          </div>
        )}

        {activeTab === 'recommendations' && report.recommendations && (
          <div className={styles.section}>
            <h2>💡 Recommended Actions</h2>
            <div className={styles.recommendationsList}>
              {report.recommendations.map((rec, idx) => (
                <div key={idx} className={styles.recommendationCard}>
                  <h3>{rec.title}</h3>
                  <p>{rec.action}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'raw' && (
          <div className={styles.section}>
            <h2>📊 Raw Data</h2>
            <pre className={styles.rawData}>
              {JSON.stringify(report, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <footer className={styles.footer}>
        <p>Last updated: {new Date(report.timestamp).toLocaleString()}</p>
        <p>Platforms: {report.platforms.join(', ')}</p>
      </footer>
    </div>
  );
}

export default TrendDashboard;
