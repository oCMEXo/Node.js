export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("Articles", {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
    title: { type: Sequelize.STRING(255), allowNull: false },
    content: { type: Sequelize.TEXT, allowNull: false },
    createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn("NOW") },
    updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn("NOW") }
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("Articles");
}
