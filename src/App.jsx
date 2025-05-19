import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/public/LandingPage";
import Login from "./components/public/Login";
import Register from "./components/public/Register";
import Home from "./components/private/Home";
import PrivateRoute from "./routes/PrivateRoute";
import Profile from "./components/private/Profile";
import CreatePost from "./components/private/CreatePost"; //
import "./App.css";
import { GrowthBook, GrowthBookProvider } from "@growthbook/growthbook-react";
import { AuthProvider } from "./context/AuthContext";

// Crea una instancia de GrowthBook
const growthbook = new GrowthBook({
  apiHost: "https://cdn.growthbook.io",
  clientKey: import.meta.env.VITE_GROWTHBOOK_CLIENT_KEY,
  enableDevMode: true, // Habilita el modo desarrollo para pruebas
  features: {
    showButton: {
      defaultValue: true, // cambiar a true para ver los botones
    },
  },
});

function App() {
  return (
    <AuthProvider>
      <GrowthBookProvider growthbook={growthbook}>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Private Routes */}
            <Route
              path="/home"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/create-post"
              element={
                <PrivateRoute>
                  <CreatePost />
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </GrowthBookProvider>
    </AuthProvider>
  );
}

export default App;
