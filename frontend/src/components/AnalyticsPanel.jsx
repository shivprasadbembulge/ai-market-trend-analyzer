import { useEffect, useState } from "react";
import API from "../services/api";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AnalyticsPanel({ file }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!file) return;

    const fetchData = async () => {
      const formData = new FormData();
      formData.append("file", file);

      const res = await API.post("analyze/", formData);
      setData(res.data);
    };

    fetchData();
  }, [file]);

  if (!data) return <p>⏳ Analyzing dataset...</p>;

  return (
    <div>

      <div className="kpi-grid">

        <motion.div className="kpi-card" whileHover={{ scale: 1.05 }}>
          <h4>Mean</h4>
          <p>{data.mean}</p>
        </motion.div>

        <motion.div className="kpi-card" whileHover={{ scale: 1.05 }}>
          <h4>Median</h4>
          <p>{data.median}</p>
        </motion.div>

        <motion.div className="kpi-card" whileHover={{ scale: 1.05 }}>
          <h4>Std Dev</h4>
          <p>{data.std}</p>
        </motion.div>

        <motion.div className="kpi-card" whileHover={{ scale: 1.05 }}>
          <h4>Outliers</h4>
          <p>{data.outliers}</p>
        </motion.div>

      </div>

      <motion.div
        className="insight-box"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h4>🤖 AI Insight</h4>
        <p>{data.insight}</p>
      </motion.div>

      <motion.div
        className="chart-box"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h4>📈 Trend Analysis</h4>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data.series}>
            <XAxis dataKey="ds" />
            <YAxis />
            <Tooltip />
            <Line
              dataKey="y"
              stroke="#6366f1"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

    </div>
  );
}