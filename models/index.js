// models/index.js
const Parent = require('./parent');
const Child = require('./child');

Parent.hasMany(Child, {
    foreignKey: 'parentId',
    as: 'children',
});

Child.belongsTo(Parent, {
    foreignKey: 'parentId',
    as: 'parent',
});

module.exports = { Parent, Child };
