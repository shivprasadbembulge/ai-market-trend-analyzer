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
          <h2>📊 AI Data Analysis</h2>
          <p>Real insights from your dataset</p>
        </div>

        <div className="dashboard-grid">

          <motion.div className="card">
            <h3>Upload Dataset</h3>
            <Upload setFile={setFile} />

            {file && <p>📁 {file.name}</p>}
          </motion.div>

          <motion.div className="card">
            <h3>AI Insights</h3>

            {file ? (
              <AnalyticsPanel file={file} />
            ) : (
              <p>Upload dataset to see analysis</p>
            )}
          </motion.div>

        </div>
      </div>
    </div>
  );
}