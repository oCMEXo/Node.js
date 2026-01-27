const { Workspace, Article } = require("../models");

exports.list = async (req, res, next) => {
  try {
    const workspaces = await Workspace.findAll({ order: [["name", "ASC"]] });
    res.render("workspaces", { workspaces });
  } catch (err) {
    next(err);
  }
};

exports.newForm = (req, res) => {
  res.render("workspace_form", { workspace: null });
};

exports.create = async (req, res, next) => {
  const name = (req.body.name || "").trim();
  if (!name) {
    return res.status(400).send("Workspace name is required.");
  }
  try {
    const workspace = await Workspace.create({ name });
    if (req.accepts('json')) {
      res.status(201).location(`/workspaces/${workspace.id}`).json(workspace);
    } else {
      res.redirect(`/workspaces/${workspace.id}`);
    }
  } catch (err) {
    next(err);
  }
};

exports.editForm = async (req, res, next) => {
  try {
    const workspace = await Workspace.findByPk(req.params.id);
    if (!workspace) {
      return res.status(404).send("Workspace not found");
    }
    res.render("workspace_form", { workspace });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  const name = (req.body.name || "").trim();
  if (!name) {
    return res.status(400).send("Workspace name is required.");
  }
  try {
    const workspace = await Workspace.findByPk(req.params.id);
    if (!workspace) {
      return res.status(404).send("Workspace not found");
    }
    workspace.name = name;
    await workspace.save();
    res.redirect("/workspaces");
  } catch (err) {
    next(err);
  }
};

exports.destroy = async (req, res, next) => {
  try {
    const workspace = await Workspace.findByPk(req.params.id, {
      include: [{ model: Article, as: "articles" }]
    });
    if (!workspace) {
      return res.status(404).send("Workspace not found");
    }
    await workspace.destroy();
    res.redirect("/workspaces");
  } catch (err) {
    next(err);
  }
};
