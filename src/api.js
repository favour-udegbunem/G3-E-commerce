const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

const token = () => localStorage.getItem("g3-user-token") || localStorage.getItem("g3-token") || "";

async function request(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (options.body && !(options.body instanceof FormData)) headers["Content-Type"] = "application/json";
  const t = token();
  if (t) headers.Authorization = `Bearer ${t}`;
  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Request failed.");
  return data;
}

export const createOrder = (payload) => request("/orders", { method: "POST", body: JSON.stringify(payload) });
export const initializePaystack = (orderId) => request("/payments/initialize", { method: "POST", body: JSON.stringify({ orderId, callbackUrl: `${window.location.origin}/order-success` }) });
export const verifyPaystack = (reference) => request(`/payments/verify/${encodeURIComponent(reference)}`);
export const getBankTransferInfo = () => request("/payments/bank-transfer-info");

export const register = (payload) => request("/auth/register", { method: "POST", body: JSON.stringify(payload) });
export const login = (email, password) => request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
export const getMe = () => request("/auth/me");

export const getMyNotifications = () => request("/notifications");
export const markNotificationRead = (id) => request(`/notifications/${id}/read`, { method: "PATCH" });
export const markAllNotificationsRead = () => request("/notifications/read-all", { method: "POST" });
export const deleteNotification = (id) => request(`/notifications/${id}`, { method: "DELETE" });
export const getMyOrders = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => { if (value) query.set(key, value); });
  return request(`/orders${query.toString() ? `?${query}` : ""}`);
};
