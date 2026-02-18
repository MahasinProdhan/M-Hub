const BASE_URL = "http://localhost:5000/api";

export const AUTH_EXPIRED_EVENT = "auth:session-expired";
const SESSION_EXPIRED_MESSAGE = "Session expired. Please log in again.";

let sessionExpiryHandled = false;

const dispatchSessionExpired = () => {
  if (sessionExpiryHandled) return;
  sessionExpiryHandled = true;

  localStorage.removeItem("token");
  localStorage.removeItem("user");

  window.dispatchEvent(
    new CustomEvent(AUTH_EXPIRED_EVENT, {
      detail: { message: SESSION_EXPIRED_MESSAGE },
    }),
  );
};

const buildApiError = (message, extras = {}) => {
  const error = new Error(message || "Something went wrong");
  Object.assign(error, extras);
  return error;
};

export const resetSessionExpiryHandling = () => {
  sessionExpiryHandled = false;
};

export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");
  const isAuthEndpoint = endpoint.startsWith("/auth/");

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(options.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      Authorization: token ? `Bearer ${token}` : "",
      ...(options.headers || {}),
    },
  });

  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await res.json()
    : { message: await res.text() };

  if ((res.status === 401 || res.status === 403) && token && !isAuthEndpoint) {
    dispatchSessionExpired();
    throw buildApiError(SESSION_EXPIRED_MESSAGE, { isAuthExpired: true });
  }

  if (!res.ok) {
    throw buildApiError(data.message || "Something went wrong");
  }

  return data;
};
