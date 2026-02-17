import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import ProtectedAdmin from "./components/ProtectedAdmin";
import AddPYQ from "./pages/pyqs/AddPYQ";
import AddMaterial from "./pages/materials/AddMaterial";
import AddOrganizer from "./pages/organizers/AddOrganizer";
import AddSyllabus from "./pages/syllabus/AddSyllabus";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedAdmin>
            <Dashboard />
          </ProtectedAdmin>
        }
      />

      {/* Placeholder routes (next steps) */}
      <Route
        path="/pyqs/add"
        element={
          <ProtectedAdmin>
            <AddPYQ />
          </ProtectedAdmin>
        }
      />

      <Route
        path="/materials/add"
        element={
          <ProtectedAdmin>
            <AddMaterial />
          </ProtectedAdmin>
        }
      />

      <Route
        path="/organizers/add"
        element={
          <ProtectedAdmin>
            <AddOrganizer />
          </ProtectedAdmin>
        }
      />

      <Route
        path="/syllabus/add"
        element={
          <ProtectedAdmin>
            <AddSyllabus />
          </ProtectedAdmin>
        }
      />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default App;
