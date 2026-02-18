import { apiRequest } from "./api.js";

export const fetchSavedResources = async () => {
  const response = await apiRequest("/users/saved");
  return response.data || [];
};

export const saveResource = async ({ resourceType, resourceId }) => {
  const response = await apiRequest("/users/saved", {
    method: "POST",
    body: JSON.stringify({ resourceType, resourceId }),
  });

  return response.data || null;
};

export const unsaveResource = async ({ resourceType, resourceId }) => {
  await apiRequest("/users/saved", {
    method: "DELETE",
    body: JSON.stringify({ resourceType, resourceId }),
  });
};
