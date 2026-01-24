const path = require("path");
const fs = require("fs");
const { Workspace, Article, ArticleVersion, Comment } = require("../models");
const { Op } = require("sequelize");

const uploadsDir = path.join(__dirname, "..", "..", "uploads");

function pickLatestVersion(versions) {
  if (!Array.isArray(versions) || versions.length === 0) {
    return null;
  }
  let latest = versions[0];
  for (const v of versions) {
    if (v.versionNumber > latest.versionNumber) {
      latest = v;
    }
  }
  return latest;
}

exports.listByWorkspace = async (req, res, next) => {
  try {
    const workspaceId = req.params.workspaceId;
    const workspace = await Workspace.findByPk(workspaceId);
    if (!workspace) {
      return res.status(404).send("Workspace not found");
    }

    const workspaces = await Workspace.findAll({ order: [["name", "ASC"]] });

    const searchText = (req.query.query || "").trim();

const versionWhere = searchText ? {
  [Op.or]: [
    { title: { [Op.iLike]: `%${searchText}%` } },
    { body: { [Op.iLike]: `%${searchText}%` } }
  ]
} : undefined;

const articles = await Article.findAll({
  where: { workspaceId },
  include: [
    {
      model: ArticleVersion,
      as: "versions",
      where: versionWhere,
      required: !!versionWhere
    },
    { model: Comment, as: "comments", attributes: ["id"] }
  ],
  order: [["created_at", "DESC"]]
});

    const items = articles.map(a => {
      const latest = pickLatestVersion(a.versions || []);
      return {
        id: a.id,
        title: latest ? latest.title : "(no title)",
        created_at: a.created_at,
        comment_count: (a.comments || []).length,
        latest_version: latest ? latest.versionNumber : 0
      };
    });

    res.render("articles", { workspace, workspaces, articles: items });
  } catch (err) {
    next(err);
  }
};

exports.newForm = async (req, res, next) => {
  try {
    const workspace = await Workspace.findByPk(req.params.workspaceId);
    if (!workspace) {
      return res.status(404).send("Workspace not found");
    }
    res.render("article_form", { workspace, article: null, version: null });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const workspaceId = req.params.workspaceId;
    const workspace = await Workspace.findByPk(workspaceId);
    if (!workspace) {
      return res.status(404).send("Workspace not found");
    }

    const title = (req.body.title || "").trim();
    const body = (req.body.body || "").trim();
    if (!title || !body) {
      return res.status(400).send("Title and body are required.");
    }

    let attachmentFilename = null;
    if (req.file) {
      attachmentFilename = req.file.filename;
    }

    const article = await Article.create({ workspaceId, creatorId: req.user.id });
    await ArticleVersion.create({
      articleId: article.id,
      versionNumber: 1,
      title,
      body,
      attachmentFilename
    });

    res.redirect(`/workspaces/${workspaceId}/articles`);
  } catch (err) {
    next(err);
  }
};

exports.detail = async (req, res, next) => {
  try {
    const articleId = req.params.id;
    const versionNumber = req.query.version ? parseInt(req.query.version, 10) : null;

    const article = await Article.findByPk(articleId, {
      include: [
        { model: Workspace, as: "workspace" },
        { model: ArticleVersion, as: "versions" },
        { model: Comment, as: "comments" }
      ],
      order: [[{ model: ArticleVersion, as: "versions" }, "version_number", "ASC"]]
    });

    if (!article) {
      return res.status(404).send("Article not found");
    }

    const canEdit = req.user.role === 'admin' || req.user.id === article.creatorId;
    if (!canEdit) {
      return res.status(403).send('Forbidden');
    }

    const allVersions = article.versions || [];
    const latest = pickLatestVersion(allVersions);
    if (!latest) {
      return res.status(500).send("Article has no versions");
    }

    let current = latest;
    if (versionNumber) {
      const found = allVersions.find(v => v.versionNumber === versionNumber);
      if (found) {
        current = found;
      }
    }

    const isLatest = current.id === latest.id;

    const workspaces = await Workspace.findAll({ order: [["name", "ASC"]] });

    res.render("article_detail", {
      article,
      workspace: article.workspace,
      workspaces,
      comments: article.comments || [],
      versions: allVersions,
      currentVersion: current,
      latestVersionNumber: latest.versionNumber,
      isLatest
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
    if (!article) {
      return res.status(404).send("Article not found");
    }

    const canEdit = req.user.role === 'admin' || req.user.id === article.creatorId;
    if (!canEdit) {
      return res.status(403).send('Forbidden');
    }
    const latest = pickLatestVersion(article.versions || []);
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
    if (!article) {
      return res.status(404).send("Article not found");
    }

    const canEdit = req.user.role === 'admin' || req.user.id === article.creatorId;
    if (!canEdit) {
      return res.status(403).send('Forbidden');
    }

    const title = (req.body.title || "").trim();
    const body = (req.body.body || "").trim();
    if (!title || !body) {
      return res.status(400).send("Title and body are required.");
    }

    const versions = article.versions || [];
    const latest = pickLatestVersion(versions);
    const nextNumber = latest ? latest.versionNumber + 1 : 1;

    let attachmentFilename = latest ? latest.attachmentFilename : null;
    if (req.file) {
      attachmentFilename = req.file.filename;
    }

    await ArticleVersion.create({
      articleId: article.id,
      versionNumber: nextNumber,
      title,
      body,
      attachmentFilename
    });

    await article.update({ updated_at: new Date() });

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
    if (!article) {
      return res.status(404).send("Article not found");
    }

    const canEdit = req.user.role === 'admin' || req.user.id === article.creatorId;
    if (!canEdit) {
      return res.status(403).send('Forbidden');
    }

    if (article.versions && article.versions.length > 0) {
      for (const v of article.versions) {
        if (v.attachmentFilename) {
          const filePath = path.join(uploadsDir, v.attachmentFilename);
          if (fs.existsSync(filePath)) {
            try {
              fs.unlinkSync(filePath);
            } catch (e) {}
          }
        }
      }
    }

    const workspaceId = article.workspaceId;
    await article.destroy();
    res.redirect(`/workspaces/${workspaceId}/articles`);
  } catch (err) {
    next(err);
  }
};
