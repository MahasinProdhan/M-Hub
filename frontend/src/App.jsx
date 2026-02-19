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

function App() {
  return (
    <FilterProvider>
      {/* Global UI */}
      <Navbar />
      <ScrollToTop />
      <Toaster position="top-right" />

      {/* Routes */}
      <Routes>
        {/* Public / Landing */}
        <Route path="/" element={<Home />} />

        {/* Auth (UI only for now) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Academic Resources */}
        <Route path="/pyqs" element={<PYQs />} />
        <Route path="/materials" element={<StudyMaterials />} />
        <Route path="/organizers" element={<Organizers />} />
        <Route path="/syllabus" element={<Syllabus />} />

        {/* User */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/saved" element={<SavedMaterials />} />

        {/* Informational Pages */}
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/help" element={<Help />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Footer />
    </FilterProvider>
  );
}

export default App;
