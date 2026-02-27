import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Organizers from "./pages/Organizers";
import PYQs from "./pages/PYQs";
import StudyMaterials from "./pages/StudyMaterials";
import Profile from "./pages/Profile";
import Syllabus from "./pages/Syllabus";
import SavedMaterials from "./pages/SavedMaterials";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import Help from "./pages/Help";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

// Context
import { FilterProvider } from "./context/FilterContext";
import { useAuth } from "./context/AuthContext.jsx";

const RequireAuth = ({ isLoggedIn, children }) => {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const GuestOnly = ({ isLoggedIn, children }) => {
  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <p className="text-sm text-slate-600">Loading...</p>
      </div>
    );
  }

  return (
    <FilterProvider>
      {/* Global UI */}
      <Navbar />
      <ScrollToTop />
      <Toaster position="top-right" />

      {/* Routes */}
      <Routes>
        {/* Public Auth */}
        <Route
          path="/login"
          element={
            <GuestOnly isLoggedIn={isLoggedIn}>
              <Login />
            </GuestOnly>
          }
        />
        <Route
          path="/register"
          element={
            <GuestOnly isLoggedIn={isLoggedIn}>
              <Register />
            </GuestOnly>
          }
        />

        {/* Protected */}
        <Route
          path="/"
          element={
            <RequireAuth isLoggedIn={isLoggedIn}>
              <Home />
            </RequireAuth>
          }
        />
        <Route
          path="/pyqs"
          element={
            <RequireAuth isLoggedIn={isLoggedIn}>
              <PYQs />
            </RequireAuth>
          }
        />
        <Route
          path="/materials"
          element={
            <RequireAuth isLoggedIn={isLoggedIn}>
              <StudyMaterials />
            </RequireAuth>
          }
        />
        <Route
          path="/organizers"
          element={
            <RequireAuth isLoggedIn={isLoggedIn}>
              <Organizers />
            </RequireAuth>
          }
        />
        <Route
          path="/syllabus"
          element={
            <RequireAuth isLoggedIn={isLoggedIn}>
              <Syllabus />
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth isLoggedIn={isLoggedIn}>
              <Profile />
            </RequireAuth>
          }
        />
        <Route
          path="/saved"
          element={
            <RequireAuth isLoggedIn={isLoggedIn}>
              <SavedMaterials />
            </RequireAuth>
          }
        />
        <Route
          path="/about"
          element={
            <RequireAuth isLoggedIn={isLoggedIn}>
              <About />
            </RequireAuth>
          }
        />
        <Route
          path="/faq"
          element={
            <RequireAuth isLoggedIn={isLoggedIn}>
              <FAQ />
            </RequireAuth>
          }
        />
        <Route
          path="/help"
          element={
            <RequireAuth isLoggedIn={isLoggedIn}>
              <Help />
            </RequireAuth>
          }
        />

        {/* Fallback */}
        <Route
          path="*"
          element={<Navigate to={isLoggedIn ? "/" : "/login"} replace />}
        />
      </Routes>

      <Footer />
    </FilterProvider>
  );
}

export default App;
