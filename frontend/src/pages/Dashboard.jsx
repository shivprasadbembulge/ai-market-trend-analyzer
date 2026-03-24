import { useState } from "react";
import { motion } from "framer-motion";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Upload from "../components/Upload";
import ForecastChart from "../components/ForecastChart";

export default function Dashboard() {
  const [file, setFile] = useState(null);

  return (
    <div className="layout">
      <Sidebar />

      <div className="main">
        <Navbar />

        <div className="page-header premium-header">
          <h1 className="gradient-title">🚀 AI Market Analyzer</h1>
          <p className="subtitle">
            Upload data → Analyze trends → Predict future insights
          </p>
        </div>

        <div className="dashboard-grid">

          <motion.div
            className="card"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h3>📤 Upload Dataset</h3>
            <p className="subtext">
              Upload CSV/Excel file to generate AI-based forecasting
            </p>

            <Upload setFile={setFile} />

            {file && (
              <p className="file-info">📁 {file.name}</p>
            )}
          </motion.div>

          <motion.div
            className="card"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h3>📊 Forecast Analytics</h3>
            <p className="subtext">
              Historical trends and future predictions powered by AI
            </p>

            {file ? (
              <ForecastChart file={file} />
            ) : (
              <div className="empty-state">
                📊 Upload dataset to view forecast analysis
              </div>
            )}
          </motion.div>

        </div>

        <motion.div
          className="card"
          style={{ marginTop: "20px" }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3>🧠 AI Forecast Summary</h3>

          {file ? (
            <p className="summary-text">
              The model analyzes historical patterns and generates future predictions
              using time-series forecasting. This helps identify demand trends,
              seasonal behavior, and expected future performance.
            </p>
          ) : (
            <p className="empty-state">
              Upload dataset to generate AI summary
            </p>
          )}
        </motion.div>

      </div>
    </div>
  );
}