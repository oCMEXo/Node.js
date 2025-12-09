const API_BASE_URL = "";

const errorBox = document.getElementById("error");
const listEl = document.getElementById("articles-list");
const formEl = document.getElementById("create-article-form");
const titleInput = document.getElementById("new-title");
const contentInput = document.getElementById("new-content");

function showError(message) {
  if (!errorBox) {
    return;
  }
  if (!message) {
    errorBox.style.display = "none";
    errorBox.textContent = "";
    return;
  }
  errorBox.textContent = message;
  errorBox.style.display = "block";
}

async function fetchArticles() {
  try {
    const res = await fetch(API_BASE_URL + "/api/articles");
    if (!res.ok) {
      showError("Failed to load articles");
      return;
    }
    const data = await res.json();
    renderArticles(data);
    showError("");
  } catch (e) {
    showError("Network error while loading articles");
  }
}

function renderArticles(articles) {
  if (!listEl) {
    return;
  }
  listEl.innerHTML = "";
  if (!Array.isArray(articles) || articles.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "No articles yet.";
    listEl.appendChild(empty);
    return;
  }
  articles.forEach(article => {
    const card = document.createElement("div");
    card.className = "article-card";

    const header = document.createElement("div");
    header.className = "article-header";

    const title = document.createElement("h3");
    title.className = "article-title";
    title.textContent = article.title;

    const idEl = document.createElement("span");
    idEl.className = "article-id";
    idEl.textContent = "#" + article.id;

    header.appendChild(title);
    header.appendChild(idEl);
    card.appendChild(header);

    const body = document.createElement("div");
    body.className = "article-content";
    body.textContent = article.content;
    card.appendChild(body);

    const actions = document.createElement("div");
    actions.className = "article-actions";

    const editBtn = document.createElement("button");
    editBtn.className = "secondary";
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => handleEdit(article));

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "danger";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => handleDelete(article));

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);
    card.appendChild(actions);

    listEl.appendChild(card);
  });
}

async function handleCreate(event) {
  event.preventDefault();
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();
  if (!title || !content) {
    showError("Both title and content are required to create an article");
    return;
  }
  try {
    const res = await fetch(API_BASE_URL + "/api/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content })
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      const msg = data && data.error ? data.error : "Failed to create article";
      showError(msg);
      return;
    }
    titleInput.value = "";
    contentInput.value = "";
    showError("");
    fetchArticles();
  } catch (e) {
    showError("Network error while creating article");
  }
}

async function handleEdit(article) {
  const newTitle = window.prompt("New title (leave empty to keep current):", article.title);
  if (newTitle === null) {
    return;
  }
  const newContent = window.prompt("New content (leave empty to keep current):", article.content);
  if (newContent === null) {
    return;
  }
  const title = newTitle.trim();
  const content = newContent.trim();
  if (!title && !content) {
    showError("Provide at least one field (title or content) to update the article");
    return;
  }
  try {
    const res = await fetch(API_BASE_URL + "/api/articles/" + article.id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content })
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      const msg = data && data.error ? data.error : "Failed to update article";
      showError(msg);
      return;
    }
    showError("");
    fetchArticles();
  } catch (e) {
    showError("Network error while updating article");
  }
}

async function handleDelete(article) {
  if (!window.confirm('Delete article "' + article.title + '"?')) {
    return;
  }
  try {
    const res = await fetch(API_BASE_URL + "/api/articles/" + article.id, {
      method: "DELETE"
    });
    if (!res.ok && res.status !== 204) {
      const data = await res.json().catch(() => null);
      const msg = data && data.error ? data.error : "Failed to delete article";
      showError(msg);
      return;
    }
    showError("");
    fetchArticles();
  } catch (e) {
    showError("Network error while deleting article");
  }
}

if (formEl) {
  formEl.addEventListener("submit", handleCreate);
}

fetchArticles();
