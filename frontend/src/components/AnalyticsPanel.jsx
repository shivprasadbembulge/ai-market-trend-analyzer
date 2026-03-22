import { useState } from "react";
import API from "../services/api";
import Heatmap from "./Heatmap";

export default function AnalyticsPanel({ file }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    try {
      if (!file) {
        alert("Upload dataset first");
        return;
      }

      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const res = await API.post("analyze/", formData);

      setData(res.data);

    } catch (e) {
      console.error("ANALYSIS ERROR:", e);

      if (e.response) {
        alert("❌ " + JSON.stringify(e.response.data));
      } else {
        alert("❌ Server error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3>📊 Data Analysis</h3>

      <button onClick={analyze} disabled={loading}>
        {loading ? "Analyzing..." : "Run Analysis"}
      </button>

      {loading && <p>⏳ Analyzing dataset...</p>}

      {data && !loading && (
        <div style={{ marginTop: "20px" }}>
          
          <h4>🤖 AI Insights</h4>
          {data.ai_insights.map((insight, i) => (
            <p key={i}>• {insight}</p>
          ))}

          <h4>📈 Statistics</h4>
          {Object.entries(data.stats).map(([col, stats]) => (
            <div key={col}>
              <b>{col}</b>
              <p>Mean: {stats.mean.toFixed(2)}</p>
              <p>Median: {stats.median.toFixed(2)}</p>
              <p>Variance: {stats.variance.toFixed(2)}</p>
              <p>Missing: {stats.missing_values}</p>
            </div>
          ))}

          <Heatmap data={data.correlation} />

        </div>
      )}
    </div>
  );
}