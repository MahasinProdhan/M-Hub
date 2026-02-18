import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout.jsx";
import { apiRequest } from "../../services/api.js";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await apiRequest("/admin/users");
        setUsers(res.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-textPrimary">
          Registered Users
        </h1>
        <p className="mt-1 text-sm text-textSecondary">
          View all users registered on M Hub
        </p>
      </div>

      {loading && <p className="text-sm">Loading users...</p>}

      {error && (
        <p className="p-3 text-sm rounded-md text-danger bg-red-50">{error}</p>
      )}

      {!loading && users.length === 0 && (
        <p className="text-sm text-textSecondary">No users found.</p>
      )}

      {!loading && users.length > 0 && (
        <div className="p-4 overflow-x-auto card shadow-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b text-textSecondary">
                <th className="py-2">Name</th>
                <th>Email</th>
                <th>College</th>
                <th>Course</th>
                <th>Branch</th>
                <th>Role</th>
                <th>Joined</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b last:border-none">
                  <td className="py-2 font-medium text-textPrimary">
                    {u.name}
                  </td>
                  <td>{u.email}</td>
                  <td>{u.college || "—"}</td>
                  <td className="uppercase">{u.course || "—"}</td>
                  <td>{u.branch || "—"}</td>
                  <td>
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-50 text-primary">
                      {u.role}
                    </span>
                  </td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
};

export default ManageUsers;
