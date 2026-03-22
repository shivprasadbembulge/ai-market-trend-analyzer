import { useState } from "react";
import { motion } from "framer-motion";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../services/api";
import AnalyticsPanel from "../components/AnalyticsPanel";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Reports() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const generateReport = async () => {
    if (!file) return alert("Upload dataset first");

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const res = await API.post("forecast/", formData);
      setData(res.data);

    } catch (e) {
      alert(" Forecast failed");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    if (!file) return alert("Upload dataset first");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await API.post("generate_report/", formData, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");

      link.href = url;
      link.download = "report.pdf";
      link.click();

    } catch (e) {
      alert(" PDF generation failed");
    }
  };

  return (
    <div className="layout">
      <Sidebar />

      <div className="main">
        <Navbar />

        <div className="page-header">
          <h2>Reports</h2>
          <p>Generate forecasts and export insights</p>
        </div>

        <div className="dashboard-grid">

          <motion.div
            className="card"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h3>Upload Dataset</h3>

            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
            />

            {file && (
              <p className="file-info">📁 {file.name}</p>
            )}
          </motion.div>

          <motion.div
            className="card"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h3>Actions</h3>

            <div className="button-group">
              <button onClick={generateReport} disabled={loading}>
                {loading ? "Processing..." : "Generate Forecast"}
              </button>

              <button onClick={downloadPDF}>
                Download PDF
              </button>
            </div>
          </motion.div>
        </div>

        {/* Chart */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3>Forecast Visualization</h3>

          {loading && <p>⏳ Processing forecast...</p>}

          {data.length > 0 && !loading ? (
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={data}>
                <XAxis dataKey="ds" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="yhat"
                  stroke="#6366f1"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            !loading && (
              <div className="empty-state">
                📈 Generate a forecast to view chart
              </div>
            )
          )}
        </motion.div>

        <motion.div
          className="card"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h3>AI Analysis</h3>

          {file ? (
            <AnalyticsPanel file={file} />
          ) : (
            <div className="empty-state">
              🤖 Upload dataset to unlock insights
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}