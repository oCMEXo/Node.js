const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db');
const Parent = require('./parent');

class Child extends Model {}

Child.init(
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
        parentId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: Parent,
                key: 'id',
            },
        },
    },
    {
        sequelize,
        modelName: 'Child',
        tableName: 'children',
        timestamps: true,
    }
);

module.exports = Child;
