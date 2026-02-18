import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { User } from "lucide-react";
import EditProfileModal from "../components/EditProfileModal.jsx";

const Profile = () => {
  const { user, isLoggedIn, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [openEdit, setOpenEdit] = useState(false);

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-textSecondary">Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  // ✅ CACHE FIX — forces browser to reload updated avatar
  const avatarUrl = user.avatar
    ? `http://localhost:5000${user.avatar}?t=${Date.now()}`
    : null;

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-appBg">
      <div className="w-full max-w-4xl p-8 bg-white shadow-sm rounded-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-textPrimary">
              My Profile
            </h1>
            <p className="text-sm text-textSecondary">
              View and manage your account details
            </p>
          </div>

          <div className="flex items-center gap-4">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Profile"
                className="object-cover w-16 h-16 border rounded-full"
              />
            ) : (
              <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full">
                <User className="w-8 h-8 text-gray-400" />
              </div>
            )}

            <p className="text-lg font-medium text-textPrimary">{user.name}</p>
          </div>
        </div>

        {/* Info Sections */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Contact */}
          <div className="p-6 border rounded-lg border-borderLight">
            <h3 className="mb-4 text-sm font-semibold text-textSecondary">
              CONTACT INFORMATION
            </h3>

            <p className="text-sm">
              <span className="text-textSecondary">Email:</span>{" "}
              <span className="font-medium">{user.email}</span>
            </p>

            <p className="mt-2 text-sm">
              <span className="text-textSecondary">Role:</span>{" "}
              <span className="font-medium capitalize">{user.role}</span>
            </p>
          </div>

          {/* Academic */}
          <div className="p-6 border rounded-lg border-borderLight">
            <h3 className="mb-4 text-sm font-semibold text-textSecondary">
              ACADEMIC INFORMATION
            </h3>

            <p className="text-sm">
              <span className="text-textSecondary">College:</span>{" "}
              <span className="font-medium">{user.college || "—"}</span>
            </p>

            <p className="mt-2 text-sm">
              <span className="text-textSecondary">Course:</span>{" "}
              <span className="font-medium uppercase">
                {user.course || "—"}
              </span>
            </p>

            {user.course === "btech" && (
              <p className="mt-2 text-sm">
                <span className="text-textSecondary">Branch:</span>{" "}
                <span className="font-medium">{user.branch || "—"}</span>
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={() => setOpenEdit(true)}
            className="px-6 py-2 text-sm font-medium border rounded-md border-borderLight hover:bg-gray-50"
          >
            Edit Profile
          </button>

          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="px-6 py-2 text-sm font-medium text-white rounded-md bg-danger"
          >
            Logout
          </button>
        </div>
      </div>

      {openEdit && <EditProfileModal onClose={() => setOpenEdit(false)} />}
    </div>
  );
};

export default Profile;
