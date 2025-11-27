// models/parent.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db');

class Parent extends Model {}

Parent.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Parent',
        tableName: 'parents',
        timestamps: true,
    }
);

module.exports = Parent;
