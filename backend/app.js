require("dotenv").config();
const express = require("express");
const sequelize = require("./db");

const articlesRouter = require("./routes/articles");
const usersRouter = require("./routes/users");

const app = express();
app.use(express.json());

app.use("/api/articles", articlesRouter);
app.use("/api/users", usersRouter);

sequelize.sync()
  .then(() => {
    console.log("PostgreSQL connected");
    app.listen(3001, () => console.log("Backend running on 3001"));
  })
  .catch(console.error);