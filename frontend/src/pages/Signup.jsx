import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import bg from "../assets/bg.jpg";

export default function Signup() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    otp: ""
  });

  const [loading, setLoading] = useState(false);

  const signup = async () => {
    try {
      if (!form.username || !form.email || !form.password) {
        alert("Fill all fields");
        return;
      }

      setLoading(true);

      await API.post("signup/", {
        username: form.username,
        email: form.email,
        password: form.password
      });

      alert("OTP sent to your email");
      setStep(2);

    } catch (err) {
      console.error(err.response?.data);
      console.log("FULL ERROR:", err.response);
      alert(JSON.stringify(err.response?.data));
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    try {
      if (!form.otp) {
        alert("Enter OTP");
        return;
      }

      setLoading(true);

      const res = await API.post("verify-otp/", {
        username: form.username,
        otp: form.otp
      });

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("username", form.username);

      alert("Account verified successfully");

      navigate("/");

    } catch (err) {
      console.error(err.response?.data);
      alert(err.response?.data?.error || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>

        {step === 1 ? (
          <>
            <h2>Create Account</h2>

            <input
              placeholder="Username"
              style={inputStyle}
              value={form.username}
              onChange={(e) =>
                setForm({ ...form, username: e.target.value })
              }
            />

            <input
              placeholder="Email"
              style={inputStyle}
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <input
              type="password"
              placeholder="Password"
              style={inputStyle}
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />

            <button onClick={signup} style={btnStyle} disabled={loading}>
              {loading ? "Creating..." : "Signup & Send OTP"}
            </button>
          </>
        ) : (
          <>
            <h2>Enter OTP</h2>

            <input
              placeholder="Enter OTP"
              style={inputStyle}
              value={form.otp}
              onChange={(e) =>
                setForm({ ...form, otp: e.target.value })
              }
            />

            <button onClick={verifyOTP} style={btnStyle} disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}

        <p style={linkText}>
          Already have an account?{" "}
          <span style={linkStyle} onClick={() => navigate("/login")}>
            Login
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
  backgroundPosition: "center",
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
  boxShadow: "0 0 30px rgba(0,0,0,0.5)",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "12px",
  borderRadius: "8px",
  border: "none",
  outline: "none",
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
  textAlign: "center",
};

const linkStyle = {
  color: "#818cf8",
  cursor: "pointer",
  fontWeight: "bold",
};