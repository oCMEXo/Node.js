const API_BASE_URL = "";

const notificationsEl = document.getElementById("notifications");
const articlesListEl = document.getElementById("articles-list");
const createFormEl = document.getElementById("create-article-form");
const newTitleEl = document.getElementById("new-title");
const newContentEl = document.getElementById("new-content");

function showToast(message) {
  if (!notificationsEl) {
    return;
  }
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  notificationsEl.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => {
      toast.remove();
    }, 200);
  }, 3000);
}

async function fetchArticles() {
  const res = await fetch(`${API_BASE_URL}/api/articles`);
  if (!res.ok) {
    showToast("Failed to load articles");
    return;
  }
  const data = await res.json();
  renderArticles(data);
}

function renderArticles(articles) {
  if (!articlesListEl) {
    return;
  }
  articlesListEl.innerHTML = "";
  if (!Array.isArray(articles) || articles.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "No articles yet. Create the first one above.";
    articlesListEl.appendChild(empty);
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

    const idSpan = document.createElement("span");
    idSpan.className = "article-id";
    idSpan.textContent = `#${article.id}`;

    header.appendChild(title);
    header.appendChild(idSpan);
    card.appendChild(header);

    const content = document.createElement("div");
    content.className = "article-content";
    content.textContent = article.content;
    card.appendChild(content);

    const attachments = Array.isArray(article.attachments) ? article.attachments : [];
    if (attachments.length > 0) {
      const attBlock = document.createElement("div");
      attBlock.className = "attachments";

      const attTitle = document.createElement("div");
      attTitle.className = "attachments-title";
      attTitle.textContent = "Attachments";
      attBlock.appendChild(attTitle);

      const attList = document.createElement("div");
      attList.className = "attachments-list";

      attachments.forEach(att => {
        const attItem = document.createElement("div");
        attItem.className = "attachment-item";

        const link = document.createElement("a");
        link.href = att.url;
        link.target = "_blank";

        if (att.mimeType && att.mimeType.startsWith("image/")) {
          const img = document.createElement("img");
          img.src = att.url;
          img.alt = att.originalName || "Image";
          link.appendChild(img);
          const name = document.createElement("div");
          name.textContent = att.originalName || "Image";
          link.appendChild(name);
        } else {
          link.textContent = att.originalName || "Attachment";
        }

        attItem.appendChild(link);
        attList.appendChild(attItem);
      });

      attBlock.appendChild(attList);
      card.appendChild(attBlock);
    }

    const actions = document.createElement("div");
    actions.className = "article-actions";

    const editBtn = document.createElement("button");
    editBtn.className = "secondary";
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => handleEditArticle(article));

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "danger";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => handleDeleteArticle(article));

    const uploadWrapper = document.createElement("div");
    uploadWrapper.className = "attachment-upload";

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".jpg,.jpeg,.png,.pdf";

    const uploadBtn = document.createElement("button");
    uploadBtn.className = "secondary";
    uploadBtn.textContent = "Attach";

    uploadBtn.addEventListener("click", () => {
      if (!fileInput.files || fileInput.files.length === 0) {
        showToast("Choose a file to attach");
        return;
      }
      handleAttachFile(article, fileInput.files[0]);
      fileInput.value = "";
    });

    uploadWrapper.appendChild(fileInput);
    uploadWrapper.appendChild(uploadBtn);

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);
    actions.appendChild(uploadWrapper);

    card.appendChild(actions);

    articlesListEl.appendChild(card);
  });
}

async function handleCreateArticle(event) {
  event.preventDefault();
  const title = newTitleEl.value.trim();
  const content = newContentEl.value.trim();
  if (!title || !content) {
    showToast("Title and content are required");
    return;
  }
  try {
    const res = await fetch(`${API_BASE_URL}/api/articles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content })
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      showToast(data && data.error ? data.error : "Failed to create article");
      return;
    }
    newTitleEl.value = "";
    newContentEl.value = "";
    await fetchArticles();
  } catch (e) {
    showToast("Network error while creating article");
  }
}

async function handleEditArticle(article) {
  const newTitle = window.prompt("Edit title:", article.title);
  if (newTitle === null) {
    return;
  }
  const newContent = window.prompt("Edit content:", article.content);
  if (newContent === null) {
    return;
  }
  const title = newTitle.trim();
  const content = newContent.trim();
  if (!title && !content) {
    showToast("Nothing to update");
    return;
  }
  try {
    const res = await fetch(`${API_BASE_URL}/api/articles/${article.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content })
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      showToast(data && data.error ? data.error : "Failed to update article");
      return;
    }
    await fetchArticles();
  } catch (e) {
    showToast("Network error while updating article");
  }
}

async function handleDeleteArticle(article) {
  if (!window.confirm(`Delete article "${article.title}"?`)) {
    return;
  }
  try {
    const res = await fetch(`${API_BASE_URL}/api/articles/${article.id}`, {
      method: "DELETE"
    });
    if (!res.ok && res.status !== 204) {
      const data = await res.json().catch(() => null);
      showToast(data && data.error ? data.error : "Failed to delete article");
      return;
    }
    await fetchArticles();
  } catch (e) {
    showToast("Network error while deleting article");
  }
}

async function handleAttachFile(article, file) {
  const formData = new FormData();
  formData.append("attachment", file);
  try {
    const res = await fetch(`${API_BASE_URL}/api/articles/${article.id}/attachments`, {
      method: "POST",
      body: formData
    });
    const contentType = res.headers.get("content-type") || "";
    let data = null;
    if (contentType.includes("application/json")) {
      data = await res.json().catch(() => null);
    } else {
      const text = await res.text();
      data = { error: text };
    }
    if (!res.ok) {
      showToast(data && data.error ? data.error : "Failed to upload attachment");
      return;
    }
    await fetchArticles();
  } catch (e) {
    showToast("Network error while uploading attachment");
  }
}

if (createFormEl) {
  createFormEl.addEventListener("submit", handleCreateArticle);
}

const socket = typeof io !== "undefined" ? io() : null;

if (socket) {
  socket.on("connect", () => {
    showToast("Connected to notifications");
  });
  socket.on("notification", payload => {
    if (payload && payload.message) {
      showToast(payload.message);
    }
    if (payload && payload.type) {
      if (
        payload.type === "article_created" ||
        payload.type === "article_updated" ||
        payload.type === "article_deleted" ||
        payload.type === "attachment_added"
      ) {
        fetchArticles();
      }
    }
  });
  socket.on("disconnect", () => {
    showToast("Disconnected from notifications");
  });
}

fetchArticles();
