export default (sequelize, DataTypes) => {
  return sequelize.define(
    "Article",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      title: { type: DataTypes.STRING(255), allowNull: false },
      content: { type: DataTypes.TEXT, allowNull: false }
    },
    {
      tableName: "Articles",
      timestamps: true
    }
  );
};
