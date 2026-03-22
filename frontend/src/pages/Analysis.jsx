import { useState } from "react";
import { motion } from "framer-motion";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Upload from "../components/Upload";
import AnalyticsPanel from "../components/AnalyticsPanel";

export default function Analysis() {
  const [file, setFile] = useState(null);

  return (
    <div className="layout">
      <Sidebar />

      <div className="main">
        <Navbar />

        <div className="page-header">
          <h2>Analysis</h2>
          <p>Deep insights powered by AI</p>
        </div>

        <div className="dashboard-grid">

          <motion.div
            className="card"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h3>Upload Dataset</h3>
            <p className="subtext">
              Upload your dataset to analyze trends
            </p>

            <Upload setFile={setFile} />

            {file && (
              <p className="file-info">📁 {file.name}</p>
            )}
          </motion.div>

          {/* Analytics Section */}
          <motion.div
            className="card"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h3>AI Insights</h3>
            <p className="subtext">
              Automated statistical & trend analysis
            </p>

            {file ? (
              <AnalyticsPanel file={file} />
            ) : (
              <div className="empty-state">
                📊 Upload a dataset to see analysis
              </div>
            )}
          </motion.div>

        </div>
      </div>
    </div>
  );
}