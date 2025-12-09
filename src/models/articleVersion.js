const { DataTypes } = require("sequelize");

module.exports = sequelize => {
  const ArticleVersion = sequelize.define("ArticleVersion", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    versionNumber: {
      type: DataTypes.INTEGER,
      field: "version_number",
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    attachmentFilename: {
      type: DataTypes.STRING(255),
      field: "attachment_filename",
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: "article_versions",
    timestamps: false
  });

  return ArticleVersion;
};
