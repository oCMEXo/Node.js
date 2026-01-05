const out = document.getElementById("out");
const alertBox = document.getElementById("alert");

function show(msg) {
  alertBox.textContent = msg;
  alertBox.classList.add("show");
}

async function load() {
  alertBox.classList.remove("show");
  const r = await fetch("/api/logic", { credentials: "include" });
  if (r.status === 401) return (location.href = "/login.html");
  const data = await r.json().catch(() => ({}));
  if (!r.ok) return show("Доступ запрещён");
  out.textContent = JSON.stringify(data, null, 2);
}

document.getElementById("refresh").addEventListener("click", load);

document.getElementById("logout").addEventListener("click", async () => {
  await fetch("/api/logout", { method: "POST", credentials: "include" });
  location.href = "/login.html";
});

load();
