const API_BASE_URL = "";

const listEl = document.getElementById("articles-list");
const viewEmptyEl = document.getElementById("view-empty");
const viewTitleEl = document.getElementById("view-title");
const viewContentEl = document.getElementById("view-content");
const titleInput = document.getElementById("title-input");
const editorEl = document.getElementById("editor");
const saveBtn = document.getElementById("save-btn");
const errorBox = document.getElementById("error-box");
const toolbarButtons = document.querySelectorAll(".editor-toolbar button");

function showErrors(errors) {
  if (!errorBox) {
    return;
  }
  if (!errors || errors.length === 0) {
    errorBox.style.display = "none";
    errorBox.innerHTML = "";
    return;
  }
  const list = errors.map(e => "<li>" + e + "</li>").join("");
  errorBox.innerHTML = "<ul>" + list + "</ul>";
  errorBox.style.display = "block";
}

async function loadArticles() {
  try {
    const res = await fetch(API_BASE_URL + "/api/articles");
    if (!res.ok) {
      showErrors(["Failed to load articles"]);
      return;
    }
    const data = await res.json();
    renderArticles(data);
    showErrors([]);
  } catch (e) {
    showErrors(["Network error while loading articles"]);
  }
}

function renderArticles(items) {
  if (!listEl) {
    return;
  }
  listEl.innerHTML = "";
  if (!Array.isArray(items) || items.length === 0) {
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.textContent = "No articles yet.";
    li.appendChild(span);
    listEl.appendChild(li);
    return;
  }
  items.forEach(item => {
    const li = document.createElement("li");
    const titleSpan = document.createElement("span");
    titleSpan.textContent = item.title;
    const idSmall = document.createElement("small");
    idSmall.textContent = item.id;
    li.appendChild(titleSpan);
    li.appendChild(idSmall);
    li.addEventListener("click", () => loadArticle(item.id));
    listEl.appendChild(li);
  });
}

async function loadArticle(id) {
  try {
    const res = await fetch(API_BASE_URL + "/api/articles/" + encodeURIComponent(id));
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      const messages = [];
      if (data && data.error) {
        messages.push(data.error);
      } else {
        messages.push("Failed to load article");
      }
      showErrors(messages);
      return;
    }
    if (!data || typeof data.title !== "string") {
      showErrors(["Malformed article data"]);
      return;
    }
    viewEmptyEl.style.display = "none";
    viewTitleEl.style.display = "block";
    viewContentEl.style.display = "block";
    viewTitleEl.textContent = data.title;
    viewContentEl.innerHTML = data.content;
    showErrors([]);
  } catch (e) {
    showErrors(["Network error while loading article"]);
  }
}

async function handleSave() {
  const title = titleInput.value.trim();
  const content = editorEl.innerHTML.trim();
  const errors = [];
  if (!title) {
    errors.push("Title is required");
  }
  if (!content) {
    errors.push("Content is required");
  }
  if (errors.length > 0) {
    showErrors(errors);
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
      const messages = [];
      if (data && data.errors) {
        if (data.errors.title) {
          messages.push(data.errors.title);
        }
        if (data.errors.content) {
          messages.push(data.errors.content);
        }
      } else if (data && data.error) {
        messages.push(data.error);
      } else {
        messages.push("Failed to create article");
      }
      showErrors(messages);
      return;
    }
    titleInput.value = "";
    editorEl.innerHTML = "";
    showErrors([]);
    loadArticles();
  } catch (e) {
    showErrors(["Network error while creating article"]);
  }
}

function handleToolbarClick(event) {
  const cmd = event.currentTarget.getAttribute("data-cmd");
  if (!cmd) {
    return;
  }
  document.execCommand(cmd, false, null);
  editorEl.focus();
}

if (saveBtn) {
  saveBtn.addEventListener("click", handleSave);
}

toolbarButtons.forEach(btn => {
  btn.addEventListener("click", handleToolbarClick);
});

loadArticles();
