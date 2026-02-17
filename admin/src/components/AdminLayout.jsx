import Sidebar from "./Sidebar";

const AdminLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-appBg">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
};

export default AdminLayout;
