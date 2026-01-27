const path = require("path");
const fs = require("fs");
const { Workspace, Article, ArticleVersion, Comment, User } = require("../models");
const { Op } = require("sequelize");
const { generateArticlePDF } = require("../services/pdfService");

const uploadsDir = path.join(__dirname, "..", "..", "uploads");

function pickLatestVersion(versions) {
    if (!versions || versions.length === 0) return null;
    return versions.reduce((a, b) =>
        b.versionNumber > a.versionNumber ? b : a
    );
}

exports.listByWorkspace = async (req, res, next) => {
    try {
        const workspaceId = req.params.workspaceId;
        const searchText = (req.query.query || "").trim();

        console.log("Loading articles for workspace:", workspaceId);

        const workspace = await Workspace.findByPk(workspaceId);
        if (!workspace) {
            return res.status(404).send("Workspace not found");
        }

        const workspaces = await Workspace.findAll();

        const versionWhere = searchText
            ? {
                [Op.or]: [
                    { title: { [Op.iLike]: `%${searchText}%` } },
                    { body: { [Op.iLike]: `%${searchText}%` } }
                ]
            }
            : undefined;

        const articles = await Article.findAll({
            where: { workspaceId },
            include: [
                {
                    model: ArticleVersion,
                    as: "versions",
                    where: versionWhere,
                    required: !!versionWhere
                }
            ],
            order: [["id", "DESC"]]
        });

        console.log("Found articles:", articles.length);

        // Transform articles for display
        const displayArticles = articles.map(article => {
            const latestVersion = pickLatestVersion(article.versions);
            return {
                id: article.id,
                title: latestVersion ? latestVersion.title : "Untitled",
                latest_version: article.versions.length,
                comment_count: article.commentCount || 0
            };
        });

        res.render("articles", {
            articles: displayArticles,
            workspace,
            workspaces,
            workspaceId,
            query: searchText
        });
    } catch (err) {
        console.error("Error in listByWorkspace:", err);
        next(err);
    }
};

exports.newForm = async (req, res, next) => {
    try {
        const workspace = await Workspace.findByPk(req.params.workspaceId);
        if (!workspace) return res.status(404).send("Workspace not found");

        res.render("article_form", { workspace, article: null, version: null });
    } catch (err) {
        next(err);
    }
};

exports.create = async (req, res, next) => {
    try {
        const { title, body } = req.body;
        const workspaceId = req.params.workspaceId;

        if (!title || !body) {
            return res.status(400).send("Title and body are required");
        }

        const article = await Article.create({
            workspaceId,
            creatorId: req.user.id
        });

        await ArticleVersion.create({
            articleId: article.id,
            versionNumber: 1,
            title,
            body,
            attachmentFilename: req.file ? req.file.filename : null
        });

        res.redirect(`/workspaces/${workspaceId}/articles`);
    } catch (err) {
        next(err);
    }
};

exports.detail = async (req, res, next) => {
    try {
        const article = await Article.findByPk(req.params.id, {
            include: [
                { model: Workspace, as: "workspace" },
                { model: ArticleVersion, as: "versions" },
                { model: Comment, as: "comments" }
            ],
            order: [[{ model: ArticleVersion, as: "versions" }, "versionNumber", "ASC"]]
        });

        if (!article) return res.status(404).send("Article not found");

        const versions = article.versions || [];
        const latest = pickLatestVersion(versions);
        if (!latest) return res.status(500).send("No versions");

        const versionNumber = req.query.version
            ? Number(req.query.version)
            : latest.versionNumber;

        const currentVersion =
            versions.find(v => v.versionNumber === versionNumber) || latest;

        const canEdit =
            req.user.role === "admin" || req.user.id === article.creatorId;

        res.render("article_detail", {
            article,
            workspace: article.workspace,
            comments: article.comments || [],
            versions,
            currentVersion,
            latestVersionNumber: latest.versionNumber,
            isLatest: currentVersion.id === latest.id,
            canEdit
        });
    } catch (err) {
        next(err);
    }
};

exports.editForm = async (req, res, next) => {
    try {
        const article = await Article.findByPk(req.params.id, {
            include: [
                { model: Workspace, as: "workspace" },
                { model: ArticleVersion, as: "versions" }
            ]
        });

        if (!article) return res.status(404).send("Article not found");

        const canEdit =
            req.user.role === "admin" || req.user.id === article.creatorId;

        if (!canEdit) return res.status(403).send("Forbidden");

        const latest = pickLatestVersion(article.versions);

        res.render("article_form", {
            workspace: article.workspace,
            article,
            version: latest
        });
    } catch (err) {
        next(err);
    }
};

exports.update = async (req, res, next) => {
    try {
        const article = await Article.findByPk(req.params.id, {
            include: [{ model: ArticleVersion, as: "versions" }]
        });

        if (!article) return res.status(404).send("Article not found");

        const canEdit =
            req.user.role === "admin" || req.user.id === article.creatorId;

        if (!canEdit) return res.status(403).send("Forbidden");

        const latest = pickLatestVersion(article.versions);
        const nextVersion = latest ? latest.versionNumber + 1 : 1;

        await ArticleVersion.create({
            articleId: article.id,
            versionNumber: nextVersion,
            title: req.body.title,
            body: req.body.body,
            attachmentFilename: req.file
                ? req.file.filename
                : latest?.attachmentFilename || null
        });

        res.redirect(`/articles/${article.id}`);
    } catch (err) {
        next(err);
    }
};

exports.destroy = async (req, res, next) => {
    try {
        const article = await Article.findByPk(req.params.id, {
            include: [{ model: ArticleVersion, as: "versions" }]
        });

        if (!article) return res.status(404).send("Article not found");

        const canEdit =
            req.user.role === "admin" || req.user.id === article.creatorId;

        if (!canEdit) return res.status(403).send("Forbidden");

        for (const v of article.versions || []) {
            if (v.attachmentFilename) {
                const filePath = path.join(uploadsDir, v.attachmentFilename);
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            }
        }

        const workspaceId = article.workspaceId;
        await article.destroy();

        res.redirect(`/workspaces/${workspaceId}/articles`);
    } catch (err) {
        next(err);
    }
};

exports.exportPdf = async (req, res, next) => {
    try {
        const article = await Article.findByPk(req.params.id, {
            include: [
                { model: ArticleVersion, as: "versions" },
                { model: Workspace, as: "workspace" },
                { model: User, as: "creator", attributes: ["email"] }
            ]
        });

        if (!article || !article.versions.length) {
            return res.status(404).send("Article not found");
        }

        const latest = pickLatestVersion(article.versions);

        generateArticlePDF(res, {
            title: latest.title,
            body: latest.body,
            articleId: article.id,
            versionNumber: latest.versionNumber,
            author: article.creator ? article.creator.email : null,
            createdAt: latest.created_at,
            workspace: article.workspace ? article.workspace.name : null
        });
    } catch (err) {
        console.error("PDF Export Error:", err);
        next(err);
    }
};
