const { sequelize, Workspace, User } = require("./models");

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to PostgreSQL");

    await sequelize.sync({ alter: true });
    console.log("Schema synced from models");

    const count = await Workspace.count();
    if (count === 0) {
      await Workspace.bulkCreate([
        { name: "Default workspace" },
        { name: "Demo workspace" }
      ]);
      console.log("Seeded default workspaces");
    }

    if (User) {
      await User.update({ role: "user" }, { where: { role: null } });
    }

    process.exit(0);
  } catch (err) {
    console.error("Error syncing DB:", err);
    process.exit(1);
  }
})();