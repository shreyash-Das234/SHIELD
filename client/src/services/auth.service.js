import api from "./api";

const persistAuth = (data) => {
  if (data?.token) {
    localStorage.setItem("shield_token", data.token);
  }

  if (data?.user) {
    localStorage.setItem("shield_user", JSON.stringify(data.user));
  }

  if (data?.user?.email) {
    localStorage.setItem("shield_login_email", data.user.email);
  }
};

// Register user
export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);
  persistAuth(response.data);
  return response.data;
};

// Login user
export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  persistAuth(response.data);
  return response.data;
};

// Logout
export const logoutUser = () => {
  localStorage.removeItem("shield_token");
  localStorage.removeItem("shield_user");
};

// Get current user
export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("shield_user"));
};
