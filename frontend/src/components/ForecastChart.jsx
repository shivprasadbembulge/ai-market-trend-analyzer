import { useEffect, useState } from "react";
import API from "../services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ForecastChart({ file }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!file) return;

    const fetchForecast = async () => {
      try {
        setLoading(true);

        const formData = new FormData();
        formData.append("file", file);

        const res = await API.post("forecast/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        console.log("FORECAST DATA:", res.data);

        setData(res.data);

      } catch (err) {
        console.log("FORECAST ERROR:", err);

        if (err.response) {
          alert("❌ " + JSON.stringify(err.response.data));
        } else {
          alert("Forecast failed");
        }

      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
  }, [file]);

  return (
    <div className="card">
      <h3>📈 Forecast Chart</h3>

      {loading && <p>Processing forecast...</p>}

      {data.length > 0 && (
        <ResponsiveContainer width="100%" height={300}>
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
      )}

      {!loading && data.length === 0 && (
        <p>No forecast yet</p>
      )}
    </div>
  );
}