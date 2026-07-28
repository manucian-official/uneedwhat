import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "/api/v1";

function createClient(tokenKey) {
  const instance = axios.create({
    baseURL: API_BASE,
    timeout: 30000,
    headers: { "Content-Type": "application/json" },
  });

  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem(tokenKey);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  instance.interceptors.response.use(
    (res) => res.data?.data ?? res.data,
    (err) => {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Request failed";
      return Promise.reject(new Error(Array.isArray(message) ? message[0] : message));
    },
  );

  return instance;
}

const userApi = createClient("uneedwhat.token");
const adminApi = createClient("uneedwhat.adminToken");

export const api = {
  health: () => userApi.get("/health"),

  auth: {
    login: (email, password) => userApi.post("/auth/login", { email, password }),
    register: (data) => userApi.post("/auth/register", data),
    logout: () => userApi.post("/auth/logout"),
    refresh: (refreshToken) => userApi.post("/auth/refresh", { refreshToken }),
  },

  adminAuth: {
    login: (email, password) => adminApi.post("/auth/admin/login", { email, password }),
    logout: () => adminApi.post("/auth/admin/logout"),
    refresh: (refreshToken) => adminApi.post("/auth/admin/refresh", { refreshToken }),
  },

  plans: {
    list: () => userApi.get("/subscriptions/plans"),
    get: (slug) => userApi.get(`/subscriptions/plans/${slug}`),
    subscribe: (planSlug, orgName) =>
      userApi.post("/subscriptions/subscribe", { planSlug, orgName }),
    my: () => userApi.get("/subscriptions/me"),
  },

  admin: {
    dashboard: () => adminApi.get("/admin/dashboard"),
    users: (page = 1) => adminApi.get("/admin/users", { params: { page } }),
    suspendUser: (id) => adminApi.patch(`/admin/users/${id}/suspend`),
    activateUser: (id) => adminApi.patch(`/admin/users/${id}/activate`),
    organizations: (page = 1) => adminApi.get("/admin/organizations", { params: { page } }),
    subscriptions: (page = 1) => adminApi.get("/admin/subscriptions", { params: { page } }),
    plans: () => adminApi.get("/admin/plans"),
    auditLogs: () => adminApi.get("/admin/audit-logs"),
  },
};

export function saveUserSession({ accessToken, refreshToken, user }) {
  localStorage.setItem("uneedwhat.token", accessToken);
  localStorage.setItem("uneedwhat.refreshToken", refreshToken);
  localStorage.setItem("uneedwhat.user", JSON.stringify(user));
}

export function clearUserSession() {
  localStorage.removeItem("uneedwhat.token");
  localStorage.removeItem("uneedwhat.refreshToken");
  localStorage.removeItem("uneedwhat.user");
}

export function saveAdminSession({ accessToken, refreshToken, user }) {
  localStorage.setItem("uneedwhat.adminToken", accessToken);
  localStorage.setItem("uneedwhat.adminRefreshToken", refreshToken);
  localStorage.setItem("uneedwhat.adminUser", JSON.stringify(user));
}

export function clearAdminSession() {
  localStorage.removeItem("uneedwhat.adminToken");
  localStorage.removeItem("uneedwhat.adminRefreshToken");
  localStorage.removeItem("uneedwhat.adminUser");
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem("uneedwhat.user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getStoredAdmin() {
  try {
    const raw = localStorage.getItem("uneedwhat.adminUser");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
