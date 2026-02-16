import { Routes, Route, Navigate } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Organizers from "./pages/Organizers";
import PYQs from "./pages/PYQs";
import StudyMaterials from "./pages/StudyMaterials";
import Profile from "./pages/Profile";
import Syllabus from "./pages/Syllabus";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Context
import { FilterProvider } from "./context/FilterContext";

function App() {
  return (
    <FilterProvider>
      <Navbar />

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* UI-ONLY ROUTES */}
        <Route path="/organizers" element={<Organizers />} />
        <Route path="/pyqs" element={<PYQs />} />
        <Route path="/materials" element={<StudyMaterials />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/syllabus" element={<Syllabus />} />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Footer />
    </FilterProvider>
  );
}

export default App;
