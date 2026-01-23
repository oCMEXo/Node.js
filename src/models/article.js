const { DataTypes } = require("sequelize");

module.exports = sequelize => {
  const Article = sequelize.define("Article", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    creatorId: {
      type: DataTypes.INTEGER,
      field: "creator_id",
      allowNull: true
    }
  }, {
    tableName: "articles",
    timestamps: false  
  });

  return Article;
};
