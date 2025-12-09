const express = require("express");
const router = express.Router();
const workspaceController = require("../controllers/workspaceController");

router.get("/", workspaceController.list);
router.get("/new", workspaceController.newForm);
router.post("/", workspaceController.create);
router.get("/:id/edit", workspaceController.editForm);
router.post("/:id", (req, res, next) => {
  if ((req.body._method || "").toUpperCase() === "PUT") {
    return workspaceController.update(req, res, next);
  }
  if ((req.body._method || "").toUpperCase() === "DELETE") {
    return workspaceController.destroy(req, res, next);
  }
  res.status(400).send("Unsupported method");
});

module.exports = router;
