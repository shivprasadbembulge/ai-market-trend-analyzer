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
  CartesianGrid,
} from "recharts";

export default function Reports() {
  const [file, setFile] = useState(null);
  const [pastData, setPastData] = useState([]);
  const [futureData, setFutureData] = useState([]);
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);

  const generateReport = async () => {
    if (!file) return alert("Upload dataset first");

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const res = await API.post("forecast/", formData);

      setPastData(res.data.past);
      setFutureData(res.data.future);
      setAnalysis(res.data.analysis);

    } catch (e) {
      alert("Forecast failed");
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
      alert("PDF generation failed");
    }
  };

  return (
    <div className="layout">
      <Sidebar />

      <div className="main">
        <Navbar />

        <div className="page-header">
          <h2>📊 Reports & Insights</h2>
          <p>Forecast visualization + AI analysis</p>
        </div>

        <div className="dashboard-grid">

          <motion.div className="card">
            <h3>Upload Dataset</h3>

            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
            />

            {file && <p>📁 {file.name}</p>}
          </motion.div>

          <motion.div className="card">
            <h3>Actions</h3>

            <button onClick={generateReport} disabled={loading}>
              {loading ? "Processing..." : "Generate Report"}
            </button>

            <button onClick={downloadPDF}>
              Download PDF
            </button>
          </motion.div>

        </div>

        <div className="card">
          <h3>📊 Past Analysis</h3>

          {pastData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={pastData}>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="ds" hide />
                <YAxis />
                <Tooltip />

                <Line
                  dataKey="yhat"
                  stroke="#22c55e"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state">
              Generate report to see past analysis
            </div>
          )}
        </div>

        <div className="card">
          <h3>🔮 Future Forecast</h3>

          {futureData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={futureData}>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="ds" hide />
                <YAxis />
                <Tooltip />

                <Line
                  dataKey="yhat"
                  stroke="#6366f1"
                  strokeWidth={3}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state">
              Generate report to see forecast
            </div>
          )}
        </div>

        <div className="card">
          <h3>🧠 AI Post Analysis</h3>

          {analysis ? (
            <p className="analysis-text">{analysis}</p>
          ) : (
            <div className="empty-state">
              Generate report to view insights
            </div>
          )}
        </div>

        <div className="card">
          <h3> Dataset Analysis</h3>

          {file ? (
            <AnalyticsPanel file={file} />
          ) : (
            <div className="empty-state">
              Upload dataset to unlock insights
            </div>
          )}
        </div>

      </div>
    </div>
  );
}