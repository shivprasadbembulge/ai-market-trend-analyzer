import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import bg from "../assets/bg.jpg";

export default function Login() {
  const navigate = useNavigate();

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

      const res = await API.post("/login/", {
        username: form.username,
        password: form.password,
      });

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("username", form.username);

      alert("Login successful ");

      navigate("/");

    } catch (err) {
      console.log("ERROR:", err);

      if (err.response) {
        alert(" Invalid credentials");
      } else if (err.request) {
        alert(" Backend not reachable");
      } else {
        alert(" " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={{ marginBottom: "5px" }}>🚀 AI Market Analyzer</h2>
        <p style={{ marginBottom: "20px", fontSize: "14px", opacity: 0.8 }}>
          Predict. Analyze. Grow
        </p>

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

        <p style={linkText}>
          Don't have an account?{" "}
          <span style={linkStyle} onClick={() => navigate("/signup")}>
            Signup
          </span>
        </p>
      </div>
    </div>
  );
}


const containerStyle = {
  height: "100vh",
  backgroundImage: `url(${bg})`,
  backgroundSize: "cover",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const cardStyle = {
  background: "rgba(0,0,0,0.7)",
  backdropFilter: "blur(12px)",
  padding: "40px",
  borderRadius: "16px",
  color: "white",
  width: "340px",
  boxShadow: "0 0 40px rgba(0,0,0,0.5)",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "12px",
  borderRadius: "8px",
  border: "none",
  outline: "none",
  fontSize: "14px",
};

const btnStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "18px",
  background: "linear-gradient(135deg, #6366f1, #4f46e5)",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
};

const linkText = {
  marginTop: "15px",
  fontSize: "14px",
  textAlign: "center",
};

const linkStyle = {
  color: "#818cf8",
  cursor: "pointer",
  fontWeight: "bold",
};