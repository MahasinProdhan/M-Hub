const BASE_URL = "http://localhost:5000/api";

export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem("adminToken");
  const isFormData = options.body instanceof FormData;

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      Authorization: token ? `Bearer ${token}` : "",
      ...(options.headers || {}),
    },
  });

  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await res.json()
    : { message: await res.text() };

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};
