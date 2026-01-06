const alertBox = document.getElementById("alert");
const list = document.getElementById("list");

function show(msg) {
  alertBox.textContent = msg;
  alertBox.classList.add("show");
}

function clearAlert() {
  alertBox.classList.remove("show");
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

async function api(path, options) {
  const r = await fetch(path, { credentials: "include", ...options });
  if (r.status === 401) location.href = "/login.html";
  return r;
}

async function load() {
  clearAlert();
  const r = await api("/api/articles");
  const data = await r.json().catch(() => ({}));
  if (!r.ok) return show("Не удалось загрузить статьи");
  list.innerHTML = "";
  if (!data.items || data.items.length === 0) {
    list.innerHTML = '<div class="small">Пока нет статей</div>';
    return;
  }
  for (const it of data.items) {
    const el = document.createElement("div");
    el.className = "item";
    el.innerHTML = `
      <h3>${esc(it.title)}</h3>
      <div class="meta">${esc(it.author_email)} · ${esc(new Date(it.created_at).toLocaleString())}</div>
      <div class="body">${esc(it.body)}</div>
      <div class="row" style="margin-top:10px;">
        <button data-del="${esc(it.id)}">Удалить</button>
      </div>
    `;
    el.querySelector("button[data-del]").addEventListener("click", async () => {
      const rr = await api("/api/articles/" + encodeURIComponent(it.id), { method: "DELETE" });
      if (!rr.ok) return show("Не удалось удалить");
      load();
    });
    list.appendChild(el);
  }
}

document.getElementById("refresh").addEventListener("click", load);

document.getElementById("createForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  clearAlert();
  const title = document.getElementById("title").value;
  const body = document.getElementById("body").value;

  const r = await api("/api/articles", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, body })
  });

  const data = await r.json().catch(() => ({}));
  if (!r.ok) {
    const m = data.error === "invalid_title" ? "Заголовок обязателен (до 120)" :
              data.error === "invalid_body" ? "Текст обязателен" :
              "Не удалось сохранить";
    return show(m);
  }

  document.getElementById("title").value = "";
  document.getElementById("body").value = "";
  load();
});

document.getElementById("logout").addEventListener("click", async () => {
  await fetch("/api/logout", { method: "POST", credentials: "include" });
  location.href = "/login.html";
});

load();
