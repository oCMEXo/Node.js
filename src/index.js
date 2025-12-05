import db from "./models/index.js";

async function main() {
  try {
    console.log("Connecting to database...");
    await db.sequelize.authenticate();
    console.log("Connected!");

    const count = await db.Article.count();
    console.log("Articles count:", count);

    if (count === 0) {
      await db.Article.create({
        title: "First Article",
        content: "Database initialized successfully!"
      });
      console.log("Sample article created.");
    }
  } catch (err) {
    console.error("DB error:", err);
  }
}

main();
