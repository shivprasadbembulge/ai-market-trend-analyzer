import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Analysis from "./pages/Analysis";
import Reports from "./pages/Reports";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("access");

  if (!token || token === "undefined" || token === "null") {
    return <Navigate to="/login" replace />;
  }

  return children;
}

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
          path="/signup"
          element={isAuth ? <Navigate to="/" /> : <Signup />}
        />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/analysis"
          element={
            <PrivateRoute>
              <Analysis />
            </PrivateRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <PrivateRoute>
              <Reports />
            </PrivateRoute>
          }
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