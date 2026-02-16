import { Routes, Route, Navigate } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Colleges from "./pages/Colleges";
import PYQs from "./pages/PYQs";
import StudyMaterials from "./pages/StudyMaterials";
import Profile from "./pages/Profile";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* UI-ONLY ROUTES (temporarily public) */}
        <Route path="/colleges" element={<Colleges />} />
        <Route path="/pyqs" element={<PYQs />} />
        <Route path="/materials" element={<StudyMaterials />} />
        <Route path="/profile" element={<Profile />} />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
