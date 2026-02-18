import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import ProtectedAdmin from "./components/ProtectedAdmin";
import AddPYQ from "./pages/pyqs/AddPYQ";
import AddMaterial from "./pages/materials/AddMaterial";
import AddOrganizer from "./pages/organizers/AddOrganizer";
import AddSyllabus from "./pages/syllabus/AddSyllabus";
import ManagePYQs from "./pages/pyqs/ManagePYQs";
import ManageMaterials from "./pages/materials/ManageMaterials";
import ManageOrganizers from "./pages/organizers/ManageOrganizers";
import ManageSyllabus from "./pages/syllabus/ManageSyllabus";

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
      <Route
        path="/pyqs/manage"
        element={
          <ProtectedAdmin>
            <ManagePYQs />
          </ProtectedAdmin>
        }
      />
      <Route
        path="/materials/manage"
        element={
          <ProtectedAdmin>
            <ManageMaterials />
          </ProtectedAdmin>
        }
      />
      <Route
        path="/organizers/manage"
        element={
          <ProtectedAdmin>
            <ManageOrganizers />
          </ProtectedAdmin>
        }
      />

      <Route
        path="/syllabus/manage"
        element={
          <ProtectedAdmin>
            <ManageSyllabus />
          </ProtectedAdmin>
        }
      />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default App;
