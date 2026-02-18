import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { User } from "lucide-react";

const Profile = () => {
  const { user, isLoggedIn, logout, loading } = useAuth();
  const navigate = useNavigate();

  // Soft route protection
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
              View your account and academic details
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full">
              <User className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-lg font-medium text-textPrimary">{user.name}</p>
          </div>
        </div>

        {/* Info Sections */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Contact Info */}
          <div className="p-6 border rounded-lg border-borderLight">
            <h3 className="mb-4 text-sm font-semibold tracking-wide text-textSecondary">
              CONTACT INFORMATION
            </h3>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-textSecondary">EMAIL</p>
                <p className="text-sm font-medium text-textPrimary">
                  {user.email}
                </p>
              </div>

              <div>
                <p className="text-xs text-textSecondary">ROLE</p>
                <p className="text-sm font-medium capitalize text-textPrimary">
                  {user.role}
                </p>
              </div>
            </div>
          </div>

          {/* Academic Info */}
          <div className="p-6 border rounded-lg border-borderLight">
            <h3 className="mb-4 text-sm font-semibold tracking-wide text-textSecondary">
              ACADEMIC INFORMATION
            </h3>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-textSecondary">COLLEGE</p>
                <p className="text-sm font-medium text-textPrimary">
                  {user.college || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs text-textSecondary">COURSE</p>
                <p className="text-sm font-medium uppercase text-textPrimary">
                  {user.course || "—"}
                </p>
              </div>

              {user.course === "btech" && (
                <div>
                  <p className="text-xs text-textSecondary">BRANCH</p>
                  <p className="text-sm font-medium text-textPrimary">
                    {user.branch}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-8">
          <button
            disabled
            className="px-6 py-2 text-sm font-medium border rounded-md cursor-not-allowed border-borderLight text-textMuted"
          >
            Edit Profile (Coming Soon)
          </button>

          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="px-6 py-2 text-sm font-medium text-white rounded-md bg-danger hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
