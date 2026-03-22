import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Analysis from "./pages/Analysis";
import Reports from "./pages/Reports";
import Login from "./pages/Login";

function App() {
  const token = localStorage.getItem("access");

  const isAuth = token && token !== "undefined" && token !== "null";

  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/login"
          element={isAuth ? <Navigate to="/" /> : <Login />}
        />

        <Route
          path="/"
          element={isAuth ? <Dashboard /> : <Navigate to="/login" />}
        />

        <Route
          path="/analysis"
          element={isAuth ? <Analysis /> : <Navigate to="/login" />}
        />

        <Route
          path="/reports"
          element={isAuth ? <Reports /> : <Navigate to="/login" />}
        />

        <Route
          path="*"
          element={<Navigate to={isAuth ? "/" : "/login"} />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;