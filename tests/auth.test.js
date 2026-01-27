const request = require("supertest");
const app = require("../src/app");
const { User } = require("../src/models");

describe("Auth flow", () => {
    const user = {email: "testuser@example.com", password: "password123"};

    beforeAll(async () => {
        await User.destroy({where: {}, truncate: true, cascade: true});
    });

    test("Register user", async () => {
        const res = await request(app).post("/register").send(user);
        expect(res.statusCode).toBeLessThan(400);
    });

    test("Login user", async () => {
        const res = await request(app).post("/login").send(user);
        expect(res.headers["set-cookie"]).toBeDefined();
    });
});
