const form = document.getElementById("form");
const alertBox = document.getElementById("alert");

function show(msg) {
  alertBox.textContent = msg;
  alertBox.classList.add("show");
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  alertBox.classList.remove("show");
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const r = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password })
  });

  const data = await r.json().catch(() => ({}));
  if (!r.ok) return show("Неверный email или пароль");

  location.href = "/logic.html";
});
