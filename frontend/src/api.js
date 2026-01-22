const API = "http://localhost:4000";

export function getToken() {
  return localStorage.getItem("token");
}

export const api = {
  async me() {
    const token = getToken();
    const res = await fetch(API + "/auth/me", {
      headers: { Authorization: "Bearer " + token }
    });
    if (!res.ok) throw new Error("Not logged in");
    return res.json();
  },

  async listArticles(q="") {
    const url = q ? `/articles?q=${encodeURIComponent(q)}` : "/articles";
    const res = await fetch(API + url);
    return res.json();
  },

  async adminUsers() {
    const res = await fetch(API + "/admin/users", {
      headers: { Authorization: "Bearer " + getToken() }
    });
    return res.json();
  },

  async updateRole(id, role) {
    const res = await fetch(API + `/admin/users/${id}/role`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getToken()
      },
      body: JSON.stringify({ role })
    });
    return res.json();
  }
};
