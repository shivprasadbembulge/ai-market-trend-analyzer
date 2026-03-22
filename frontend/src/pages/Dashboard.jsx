import { useState } from "react";
import { motion } from "framer-motion";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import KPIBox from "../components/KPIBox";
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
            <h1 className="gradient-title">
                AI Market Analyzer
                </h1>
                <p className="subtitle">
                    Predict trends. Analyze data. Make smarter decisions.
                    </p>
                    </div>

        <motion.div
          className="stats-grid"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
        >
          {[
            { title: "Revenue", value: "₹3.2M" },
            { title: "Growth", value: "+21%" },
            { title: "Forecast Accuracy", value: "92%" },
          ].map((item, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <KPIBox title={item.title} value={item.value} />
            </motion.div>
          ))}
        </motion.div>

        <div className="dashboard-grid">
          
          <motion.div
            className="card"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h3>Upload Dataset</h3>
            <p className="subtext">
              Upload CSV/Excel to generate AI forecasts
            </p>

            <Upload setFile={setFile} />
          </motion.div>

          <motion.div
            className="card"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h3>Forecast Analytics</h3>
            <p className="subtext">
              Visual prediction based on uploaded data
            </p>

            {file ? (
              <ForecastChart file={file} />
            ) : (
              <div className="empty-state">
                📊 Upload a dataset to see forecast
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}