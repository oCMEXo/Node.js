require("dotenv").config();
jest.setTimeout(20000);

afterAll(async () => {
    const { sequelize } = require("../src/models");
    await sequelize.close();
});

process.env.NODE_ENV = "test";
