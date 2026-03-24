import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const username = localStorage.getItem("username");

  const menu = [
    { name: "Dashboard", path: "/", icon: "📊" },
    { name: "Analysis", path: "/analysis", icon: "📈" },
    { name: "Reports", path: "/reports", icon: "📄" },
  ];

  const logout = () => {
    localStorage.clear();
    navigate("/login");
    window.location.reload();
  };

  return (
    <div className="sidebar">

      <div className="sidebar-top">
        <h2 className="logo">🚀 AI Analyzer</h2>

        <div className="menu">
          {menu.map((item) => {
            const active = location.pathname === item.path;

            return (
              <motion.div
                key={item.path}
                whileHover={{ x: 6 }}
              >
                <Link
                  to={item.path}
                  className={`menu-item ${active ? "active" : ""}`}
                >
                  <span>{item.icon}</span>
                  {item.name}
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="sidebar-bottom">
        <div className="user-box">
          <p className="user-name">👤 {username || "User"}</p>

        </div>

        <p className="powered">⚡ AI Powered</p>
      </div>

    </div>
  );
}