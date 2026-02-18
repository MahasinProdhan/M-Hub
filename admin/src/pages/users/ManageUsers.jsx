import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AdminLayout from "../../components/AdminLayout.jsx";
import ConfirmModal from "../../components/ConfirmModal.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { apiRequest } from "../../services/api.js";

const ManageUsers = () => {
  const { user: loggedInAdmin } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingUserId, setUpdatingUserId] = useState("");
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [nextRole, setNextRole] = useState("");

  const isSuperAdmin = loggedInAdmin?.role === "superadmin";

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

  const closeConfirm = () => {
    if (updatingUserId) return;
    setConfirmTarget(null);
    setNextRole("");
  };

  const openRoleConfirm = (targetUser, roleToSet) => {
    setConfirmTarget(targetUser);
    setNextRole(roleToSet);
  };

  const confirmRoleUpdate = async () => {
    if (!confirmTarget?._id || !nextRole) return;

    const targetUserId = confirmTarget._id;

    try {
      setUpdatingUserId(targetUserId);

      await apiRequest(`/admin/users/${targetUserId}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role: nextRole }),
      });

      setUsers((prev) =>
        prev.map((u) =>
          u._id === targetUserId
            ? {
                ...u,
                role: nextRole,
              }
            : u,
        ),
      );

      toast.success(
        nextRole === "admin"
          ? "User promoted to admin"
          : "Admin privileges removed",
      );

      setConfirmTarget(null);
      setNextRole("");
    } catch (err) {
      toast.error(err.message || "Failed to update role");
    } finally {
      setUpdatingUserId("");
    }
  };

  const getConfirmMessage = () => {
    if (!confirmTarget || !nextRole) return "";

    return nextRole === "admin"
      ? `Are you sure you want to make ${confirmTarget.name} an admin?`
      : `Are you sure you want to remove admin access for ${confirmTarget.name}?`;
  };

  return (
    <AdminLayout>
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
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => {
                const isTargetSuperAdmin = u.role === "superadmin";
                const isTargetAdmin = u.role === "admin";
                const isUpdating = updatingUserId === u._id;
                const isSelf = String(u._id) === String(loggedInAdmin?._id || loggedInAdmin?.id || "");

                return (
                  <tr key={u._id} className="border-b last:border-none">
                    <td className="py-2 font-medium text-textPrimary">{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.college || "—"}</td>
                    <td className="uppercase">{u.course || "—"}</td>
                    <td>{u.branch || "—"}</td>
                    <td>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          u.role === "superadmin"
                            ? "bg-purple-50 text-purple-700"
                            : u.role === "admin"
                              ? "bg-blue-50 text-primary"
                              : "bg-gray-100 text-textSecondary"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td>
                      {!isSuperAdmin ? (
                        <span className="text-xs text-textSecondary">No access</span>
                      ) : isTargetSuperAdmin ? (
                        <span className="text-xs font-medium text-purple-700">Super Admin</span>
                      ) : isTargetAdmin ? (
                        <button
                          type="button"
                          disabled={isUpdating || isSelf}
                          onClick={() => openRoleConfirm(u, "user")}
                          className="px-3 py-1 text-xs font-medium text-white rounded-md bg-danger disabled:opacity-60"
                        >
                          {isUpdating ? "Updating..." : "Remove Admin"}
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={isUpdating || isSelf}
                          onClick={() => openRoleConfirm(u, "admin")}
                          className="px-3 py-1 text-xs font-medium text-white rounded-md bg-primary disabled:opacity-60"
                        >
                          {isUpdating ? "Updating..." : "Make Admin"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        open={!!confirmTarget}
        title={nextRole === "admin" ? "Promote User" : "Remove Admin"}
        message={getConfirmMessage()}
        confirmText={nextRole === "admin" ? "Make Admin" : "Remove Admin"}
        loading={!!updatingUserId}
        onCancel={closeConfirm}
        onConfirm={confirmRoleUpdate}
      />
    </AdminLayout>
  );
};

export default ManageUsers;
