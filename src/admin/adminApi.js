const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

export const getAdminToken = () => localStorage.getItem("g3-admin-token");

const request = async (path, options = {}) => {
  const token = getAdminToken();
  const headers = { ...(options.headers || {}) };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.");
  }

  return data;
};

export const adminLogin = (email, password) =>
  request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const getAdminProducts = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") query.set(key, value);
  });

  return request(`/admin/products${query.toString() ? `?${query}` : ""}`);
};

export const getAdminCategories = () => request("/admin/categories");

export const createAdminProduct = (product) =>
  request("/admin/products", {
    method: "POST",
    body: JSON.stringify(product),
  });

export const updateAdminProduct = (id, product) =>
  request(`/admin/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(product),
  });

export const archiveAdminProduct = (id) =>
  request(`/admin/products/${id}`, { method: "DELETE" });

export const permanentlyDeleteAdminProduct = (id) =>
  request(`/admin/products/${id}/permanent`, {
    method: "DELETE",
  });

export const getAdminDashboard = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") query.set(key, value);
  });
  return request(`/admin/dashboard${query.toString() ? `?${query}` : ""}`);
};
export const getAdminOrders = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => { if (value !== undefined && value !== "") query.set(key, value); });
  return request(`/admin/orders${query.toString() ? `?${query}` : ""}`);
};
export const updateAdminOrder = (id, payload) => request(`/admin/orders/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
export const getAdminUsers = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => { if (value !== undefined && value !== "") query.set(key, value); });
  return request(`/admin/users${query.toString() ? `?${query}` : ""}`);
};
export const updateAdminUser = (id, payload) => request(`/admin/users/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
export const createAdminCategory = (category) => request("/admin/categories", { method: "POST", body: JSON.stringify(category) });
export const updateAdminCategory = (id, category) => request(`/admin/categories/${id}`, { method: "PUT", body: JSON.stringify(category) });

export const getAdminDashboardAnalytics = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") query.set(key, value);
  });
  return request(`/admin/dashboard/analytics${query.toString() ? `?${query}` : ""}`);
};