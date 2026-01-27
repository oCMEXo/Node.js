const request = require("supertest");
const app = require("../src/app");
const { Workspace } = require("../src/models");

let cookie;

beforeAll(async () => {
  // Clean up old test workspaces
  await Workspace.destroy({where: {name: {[require('sequelize').Op.like]: 'Jest WS%'}}}); 

  const res = await request(app).post("/login")
    .send({ email: "testuser@example.com", password: "password123" });
  cookie = res.headers["set-cookie"];
});

test("Create workspace", async () => {
  const res = await request(app)
    .post("/workspaces")
    .set("Cookie", cookie)
    .send({ name: `Jest WS ${Date.now()}` });
  expect(res.statusCode).toBeLessThan(400);
});
