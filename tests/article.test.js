const request = require("supertest");
const app = require("../src/app");
const { Workspace } = require("../src/models");

let cookie, workspaceId;

beforeAll(async () => {
  // Clean up old test workspaces
  await Workspace.destroy({where: {name: {[require('sequelize').Op.like]: 'Article WS%'}}}); 

  const login = await request(app).post("/login")
    .send({ email: "testuser@example.com", password: "password123" });
  cookie = login.headers["set-cookie"];

  const ws = await request(app).post("/workspaces")
    .set("Cookie", cookie).send({ name: `Article WS ${Date.now()}` });
  workspaceId = ws.headers.location.split("/").pop();
});

test("Create article", async () => {
  const res = await request(app)
    .post(`/workspaces/${workspaceId}/articles`)
    .set("Cookie", cookie)
    .send({ title: "Test", body: "Body" });
  expect(res.statusCode).toBeLessThan(400);
});
