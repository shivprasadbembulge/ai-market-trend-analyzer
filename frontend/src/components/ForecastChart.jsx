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
  CartesianGrid,
} from "recharts";

export default function ForecastChart({ file }) {
  const [pastData, setPastData] = useState([]);
  const [futureData, setFutureData] = useState([]);
  const [analysis, setAnalysis] = useState("");

  useEffect(() => {
    if (!file) return;

    const fetchForecast = async () => {
      const formData = new FormData();
      formData.append("file", file);

      const res = await API.post("forecast/", formData);

      setPastData(res.data.past);
      setFutureData(res.data.future);
      setAnalysis(res.data.analysis);
    };

    fetchForecast();
  }, [file]);

  if (!pastData.length) return <p>⏳ Generating forecast...</p>;

  return (
    <div>

      <div className="chart-box">
        <h4>📊 Past Analysis</h4>
        <p className="chart-desc">
          Historical data showing previous trends and patterns.
        </p>

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
      </div>

      <div className="chart-box" style={{ marginTop: "20px" }}>
        <h4>🔮 Future Forecast</h4>
        <p className="chart-desc">
          AI-predicted values based on historical trends.
        </p>

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
      </div>

      <motion.div
        className="analysis-box"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h4>🧠 AI Post Analysis</h4>
        <p>{analysis}</p>
      </motion.div>

    </div>
  );
}