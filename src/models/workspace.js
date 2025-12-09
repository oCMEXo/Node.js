
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Workspace = sequelize.define('Workspace', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
      unique: true
    }
  }, {
    tableName: 'workspaces',
    timestamps: false
  });

  return Workspace;
};
