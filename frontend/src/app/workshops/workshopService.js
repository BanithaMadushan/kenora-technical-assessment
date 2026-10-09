
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const apiRequest = async (path, options = {}) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

export const getWorkshops = async (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.status) params.set("status", filters.status);
  if (filters.from) params.set("from", filters.from);
  if (filters.to) params.set("to", filters.to);
  if (filters.available) params.set("available", "true");

  return apiRequest(`/workshops?${params.toString()}`);
};

export const createWorkshop = async (data) => {
  return apiRequest("/workshops", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateWorkshop = async (id, data) => {
  return apiRequest(`/workshops/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const getRegistrations = async (workshopId) => {
  return apiRequest(`/workshops/${workshopId}/registrations`);
};

export const registerAttendee = async (workshopId, data) => {
  return apiRequest(`/workshops/${workshopId}/register`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const cancelRegistration = async (registrationId) => {
  return apiRequest(`/registrations/${registrationId}/cancel`, {
    method: "PATCH",
  });
};
