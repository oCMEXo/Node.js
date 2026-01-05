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

  const r = await fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password })
  });

  const data = await r.json().catch(() => ({}));
  if (!r.ok) {
    const m = data.error === "email_taken" ? "Email уже занят" :
              data.error === "weak_password" ? "Пароль слишком короткий (минимум 8)" :
              data.error === "invalid_email" ? "Некорректный email" :
              "Ошибка регистрации";
    return show(m);
  }

  location.href = "/login.html";
});
