const API_BASE = "http://localhost:4000";

export function getToken() {
  return localStorage.getItem("token");
}
export function setToken(t) {
  if (!t) localStorage.removeItem("token");
  else localStorage.setItem("token", t);
}
export function getUser() {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
}
export function setUser(u) {
  if (!u) localStorage.removeItem("user");
  else localStorage.setItem("user", JSON.stringify(u));
}

async function request(path, { method="GET", body } = {}) {
  const token = getToken();
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(API_BASE + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.message || `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data;
}

export const api = {
  async register(email, password) {
    return request("/auth/register", { method: "POST", body: { email, password } });
  },
  async login(email, password) {
    return request("/auth/login", { method: "POST", body: { email, password } });
  },
  async me() {
    return request("/auth/me");
  },
  async listArticles() {
    return request("/articles");
  },
  async createArticle(title, body) {
    return request("/articles", { method: "POST", body: { title, body } });
  },
  async updateArticle(id, patch) {
    return request(`/articles/${id}`, { method: "PUT", body: patch });
  },
  async deleteArticle(id) {
    return request(`/articles/${id}`, { method: "DELETE" });
  },
  async adminListUsers() {
    return request("/admin/users");
  },
  async adminUpdateRole(id, role) {
    return request(`/admin/users/${id}/role`, { method: "PATCH", body: { role } });
  }
};
