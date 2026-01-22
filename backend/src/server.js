import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import { authRouter } from "./routes/auth.js";
import { articlesRouter } from "./routes/articles.js";
import { adminRouter } from "./routes/admin.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/articles", articlesRouter);
app.use("/admin", adminRouter);

const port = Number(process.env.PORT || 4000);
app.listen(port, () => console.log("API listening on http://localhost:" + port));
