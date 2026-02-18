import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { apiRequest } from "../services/api.js";

const COURSES = [
  { id: "btech", name: "BTech", hasBranch: true },
  { id: "bca", name: "BCA" },
  { id: "bsc", name: "BSc" },
  { id: "ba", name: "BA" },
];

const EditProfileModal = ({ onClose }) => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: user?.name || "",
    college: user?.college || "",
    course: user?.course || "",
    branch: user?.branch || "",
    avatar: null,
  });

  const selectedCourse = COURSES.find((c) => c.id === form.course);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "course" && value !== "btech" ? { branch: "" } : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("name", form.name ?? "");
      formData.append("college", form.college ?? "");
      formData.append("course", form.course ?? "");
      formData.append("branch", form.course === "btech" ? (form.branch ?? "") : "");

      if (form.avatar) {
        formData.append("avatar", form.avatar);
      }

      const res = await apiRequest("/users/me", {
        method: "PATCH",
        body: formData,
      });

      updateUser(res.user);
      onClose();
    } catch (err) {
      setError(err.message || "Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg p-6 bg-white shadow-lg rounded-xl"
      >
        <h2 className="mb-4 text-lg font-semibold">Edit Profile</h2>

        {error && <p className="mb-3 text-sm text-red-500">{error}</p>}

        <input
          className="w-full px-3 mb-3 border rounded-md h-11"
          placeholder="Name"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />

        <input
          className="w-full px-3 mb-3 border rounded-md h-11"
          placeholder="College"
          value={form.college}
          onChange={(e) => handleChange("college", e.target.value)}
        />

        <select
          className="w-full px-3 mb-3 border rounded-md h-11"
          value={form.course}
          onChange={(e) => handleChange("course", e.target.value)}
        >
          <option value="">Select course</option>
          {COURSES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {selectedCourse?.hasBranch && (
          <input
            className="w-full px-3 mb-3 border rounded-md h-11"
            placeholder="Branch"
            value={form.branch}
            onChange={(e) => handleChange("branch", e.target.value)}
          />
        )}

        <input
          type="file"
          accept="image/*"
          className="mb-4"
          onChange={(e) => handleChange("avatar", e.target.files?.[0] || null)}
        />

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm border rounded-md"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm text-white rounded-md bg-primary"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfileModal;
