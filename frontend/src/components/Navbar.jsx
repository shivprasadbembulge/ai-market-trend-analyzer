import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    window.location.href = "/login";
  };

  return (
    <div className="navbar">
      <h2 className="nav-title">🚀 AI Market Analyzer</h2>

      <button className="logout-btn" onClick={logout}>
        Logout
      </button>
    </div>
  );
}