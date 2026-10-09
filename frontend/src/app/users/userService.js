const API_URL = process.env.NEXT_PUBLIC_API_URL;

const request = async (path, options = {}) => {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};

export const getUsers = () => request("/users");

export const createUser = (userData) =>
  request("/users", {
    method: "POST",
    body: JSON.stringify(userData),
  });