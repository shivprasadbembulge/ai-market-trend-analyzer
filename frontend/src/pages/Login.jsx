import { useState } from "react";
import API from "../services/api";
import bg from "../assets/bg.jpg";

export default function Login() {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const login = async () => {
    try {
      if (!form.username || !form.password) {
        alert("Enter username & password");
        return;
      }

      setLoading(true);

      const res = await API.post("login/", {
        username: form.username,
        password: form.password,
      });

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      alert("Login successful ✅");

      window.location.href = "/";

    } catch (err) {
      console.log("ERROR:", err);

      if (err.response) {
        alert("❌ " + JSON.stringify(err.response.data));
      } else if (err.request) {
        alert("❌ Backend not reachable");
      } else {
        alert("❌ " + err.message);
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(10px)",
          padding: "40px",
          borderRadius: "12px",
          color: "white",
          width: "320px",
        }}
      >
        <h2>🚀 AI Market Analyzer</h2>
        <p>Predict. Analyze. Grow</p>

        <input
          value={form.username}
          placeholder="Username"
          style={inputStyle}
          onChange={(e) =>
            setForm({ ...form, username: e.target.value })
          }
        />

        <input
          value={form.password}
          type="password"
          placeholder="Password"
          style={inputStyle}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button onClick={login} style={btnStyle} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginTop: "10px",
  borderRadius: "6px",
  border: "none",
  outline: "none",
};

const btnStyle = {
  width: "100%",
  padding: "10px",
  marginTop: "15px",
  background: "#4f46e5",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};