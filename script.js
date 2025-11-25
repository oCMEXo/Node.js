// Change this if your backend runs somewhere else
const API_BASE_URL = "http://localhost:3000";

const notificationsContainer = document.getElementById("notifications");
const articlesList = document.getElementById("articles-list");

// WebSocket (Socket.IO) setup
const socket = io(API_BASE_URL);
socket.on("connect", () => {
    showToast("Connected to notifications", 1500);
});

socket.on("notification", (data) => {
    showToast(data.message || "New notification");
});

// Toast notification
function showToast(message, duration = 3000) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    notificationsContainer.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => {
            notificationsContainer.removeChild(toast);
        }, 200);
    }, duration);
}

// Fetch and render articles
async function fetchArticles() {
    try {
        const res = await fetch(`${API_BASE_URL}/api/articles`);
        if (!res.ok) {
            throw new Error("Failed to load articles");
        }
        const data = await res.json();
        renderArticles(data);
    } catch (err) {
        console.error(err);
        showToast("Error loading articles", 3000);
    }
}

function renderArticles(articles) {
    articlesList.innerHTML = "";

    if (!articles.length) {
        articlesList.innerHTML = "<p>No articles yet.</p>";
        return;
    }

    articles.forEach((article) => {
        const card = document.createElement("div");
        card.className = "article-card";

        // Header
        const header = document.createElement("div");
        header.className = "article-header";

        const titleElem = document.createElement("h3");
        titleElem.className = "article-title";
        titleElem.textContent = `#${article.id} • ${article.title}`;

        header.appendChild(titleElem);

        card.appendChild(header);

        // Content
        const contentElem = document.createElement("div");
        contentElem.className = "article-content";
        contentElem.textContent = article.content;
        card.appendChild(contentElem);

        // Attachments
        if (article.attachments && article.attachments.length > 0) {
            const attachmentsBlock = document.createElement("div");
            attachmentsBlock.className = "attachments";

            const attachmentsTitle = document.createElement("h4");
            attachmentsTitle.textContent = "Attachments:";
            attachmentsBlock.appendChild(attachmentsTitle);

            const list = document.createElement("div");
            list.className = "attachments-list";

            article.attachments.forEach((att) => {
                const item = document.createElement("div");
                item.className = "attachment-item";

                item.addEventListener("click", () => {
                    window.open(`${API_BASE_URL}${att.url}`, "_blank");
                });

                if (att.mimeType.startsWith("image/")) {
                    const img = document.createElement("img");
                    img.src = `${API_BASE_URL}${att.url}`;
                    img.alt = att.originalName;
                    item.appendChild(img);
                } else if (att.mimeType === "application/pdf") {
                    const label = document.createElement("div");
                    label.textContent = `PDF: ${att.originalName}`;
                    item.appendChild(label);
                } else {
                    const label = document.createElement("div");
                    label.textContent = att.originalName;
                    item.appendChild(label);
                }

                list.appendChild(item);
            });

            attachmentsBlock.appendChild(list);
            card.appendChild(attachmentsBlock);
        }

        // Actions: update, delete, attach file
        const actions = document.createElement("div");
        actions.className = "article-actions";

        // Simple update (prompt)
        const updateBtn = document.createElement("button");
        updateBtn.className = "secondary";
        updateBtn.textContent = "Edit";
        updateBtn.addEventListener("click", async () => {
            const newTitle = prompt("New title (leave empty to keep current):", article.title);
            const newContent = prompt(
                "New content (leave empty to keep current):",
                article.content
            );

            const body = {};
            if (newTitle && newTitle !== article.title) body.title = newTitle;
            if (newContent && newContent !== article.content) body.content = newContent;

            if (Object.keys(body).length === 0) {
                return;
            }

            try {
                const res = await fetch(`${API_BASE_URL}/api/articles/${article.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(body),
                });
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Failed to update article");
                }

                showToast(`Article #${article.id} updated`);
                fetchArticles();
            } catch (err) {
                console.error(err);
                showToast(err.message);
            }
        });
        actions.appendChild(updateBtn);

        // Delete
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "danger";
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", async () => {
            if (!confirm(`Delete article #${article.id}?`)) return;

            try {
                const res = await fetch(`${API_BASE_URL}/api/articles/${article.id}`, {
                    method: "DELETE",
                });
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.error || "Failed to delete article");
                }
                showToast(`Article #${article.id} deleted`);
                fetchArticles();
            } catch (err) {
                console.error(err);
                showToast(err.message);
            }
        });
        actions.appendChild(deleteBtn);

        // File upload form
        const uploadForm = document.createElement("form");
        uploadForm.enctype = "multipart/form-data";

        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.name = "file";
        fileInput.accept = ".jpg,.jpeg,.png,.pdf";

        const uploadBtn = document.createElement("button");
        uploadBtn.type = "submit";
        uploadBtn.textContent = "Attach file";

        uploadForm.appendChild(fileInput);
        uploadForm.appendChild(uploadBtn);

        uploadForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            if (!fileInput.files.length) {
                showToast("Please choose a file");
                return;
            }

            const formData = new FormData();
            formData.append("file", fileInput.files[0]);

            try {
                const res = await fetch(
                    `${API_BASE_URL}/api/articles/${article.id}/attachments`,
                    {
                        method: "POST",
                        body: formData,
                    }
                );
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.error || "Failed to upload file");
                }

                showToast("File attached successfully");
                fileInput.value = "";
                fetchArticles();
            } catch (err) {
                console.error(err);
                showToast(err.message);
            }
        });

        actions.appendChild(uploadForm);
        card.appendChild(actions);

        articlesList.appendChild(card);
    });
}

// Create article form
const createForm = document.getElementById("create-article-form");
createForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const titleInput = document.getElementById("new-title");
    const contentInput = document.getElementById("new-content");

    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    if (!title || !content) {
        showToast("Title and content are required");
        return;
    }

    try {
        const res = await fetch(`${API_BASE_URL}/api/articles`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title, content }),
        });
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.error || "Failed to create article");
        }

        showToast("Article created");
        titleInput.value = "";
        contentInput.value = "";
        fetchArticles();
    } catch (err) {
        console.error(err);
        showToast(err.message);
    }
});

// Initial load
fetchArticles();
