import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function Sidebar() {
  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/", icon: "📊" },
    { name: "Analysis", path: "/analysis", icon: "📈" },
    { name: "Reports", path: "/reports", icon: "📄" },
  ];

  return (
    <div className="sidebar">
        
      <h2 className="logo">🚀 AI Analyzer</h2>

      <div className="menu">
        {menu.map((item) => {
          const active = location.pathname === item.path;

          return (
            <motion.div
              key={item.path}
              whileHover={{ x: 6 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <Link
                to={item.path}
                className={`menu-item ${active ? "active" : ""}`}
              >
                <span className="icon">{item.icon}</span>
                {item.name}
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div className="sidebar-footer">
        <p>⚡ AI Powered</p>
      </div>
    </div>
  );
}