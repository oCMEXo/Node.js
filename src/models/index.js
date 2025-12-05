import SequelizePkg from "sequelize";
import sequelize from "../config/database.js";
import ArticleModel from "./article.js";

const { DataTypes } = SequelizePkg;

const Article = ArticleModel(sequelize, DataTypes);

export default { sequelize, SequelizePkg, Article };
