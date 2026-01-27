const request = require("supertest");
const app = require("../src/app");
const { Workspace } = require("../src/models");

let cookie, workspaceId;

beforeAll(async () => {
  // Clean up old test workspaces
  await Workspace.destroy({where: {name: {[require('sequelize').Op.like]: 'Search WS%'}}}); 

  const login = await request(app).post("/login")
    .send({ email: "testuser@example.com", password: "password123" });
  cookie = login.headers["set-cookie"];

  const ws = await request(app).post("/workspaces")
    .set("Cookie", cookie).send({ name: `Search WS ${Date.now()}` });
  workspaceId = ws.headers.location.split("/").pop();

  await request(app).post(`/workspaces/${workspaceId}/articles`)
    .send({ title: "Hello", body: "World" });
});

test("Search works", async () => {
  const res = await request(app)
    .get(`/workspaces/${workspaceId}/articles?query=hello`)
    .set("Cookie", cookie);

  expect(res.statusCode).toBe(200);
});
