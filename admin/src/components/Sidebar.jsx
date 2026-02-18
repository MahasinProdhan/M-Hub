import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded-md text-sm font-medium ${
      isActive
        ? "bg-blue-50 text-primary"
        : "text-textSecondary hover:bg-gray-50"
    }`;

  return (
    <aside className="w-64 min-h-screen p-6 bg-white border-r border-borderLight">
      <h2 className="mb-8 text-xl font-semibold text-textPrimary">
        M Hub Admin
      </h2>

      <nav className="space-y-2">
        <NavLink to="/dashboard" className={linkClass}>
          Dashboard
        </NavLink>

        <NavLink to="/pyqs/add" className={linkClass}>
          Add PYQs
        </NavLink>

        <NavLink to="/pyqs/manage" className={linkClass}>
          Manage PYQs
        </NavLink>

        <NavLink to="/materials/add" className={linkClass}>
          Add Materials
        </NavLink>

        <NavLink to="/materials/manage" className={linkClass}>
          Manage Materials
        </NavLink>

        <NavLink to="/organizers/add" className={linkClass}>
          Add Organizers
        </NavLink>
        <NavLink to="/organizers/manage" className={linkClass}>
          Manage Organizers
        </NavLink>

        <NavLink to="/syllabus/add" className={linkClass}>
          Add Syllabus
        </NavLink>
        <NavLink to="/syllabus/manage" className={linkClass}>
          Manage Syllabus
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
