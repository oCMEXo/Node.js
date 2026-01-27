const request = require("supertest");
const app = require("../src/app");
const { Workspace } = require("../src/models");

let cookie, articleId, workspaceId;

beforeAll(async () => {
    // Clean up old test workspaces
    await Workspace.destroy({where: {name: {[require('sequelize').Op.like]: 'PDF Export Test Workspace%'}}}); 

    // Login
    const login = await request(app)
        .post("/login")
        .send({ email: "testuser@example.com", password: "password123" });
    cookie = login.headers["set-cookie"];

    // Create workspace
    const ws = await request(app)
        .post("/workspaces")
        .set("Cookie", cookie)
        .send({ name: `PDF Export Test Workspace ${Date.now()}` });
    workspaceId = ws.headers.location.split("/").pop();

    // Create article with detailed content
    await request(app)
        .post(`/workspaces/${workspaceId}/articles`)
        .set("Cookie", cookie)
        .send({
            title: "Test Article for PDF Export",
            body: "This is a comprehensive test article with detailed content to ensure PDF generation works correctly. It includes multiple sentences and paragraphs to test the layout and formatting."
        });

    // Get article ID
    const list = await request(app)
        .get(`/workspaces/${workspaceId}/articles`)
        .set("Cookie", cookie);

    articleId = list.text.match(/articles\/(\d+)/)[1];
});

describe("PDF Export Functionality", () => {
    test("should export article as PDF with correct content-type", async () => {
        const res = await request(app)
            .get(`/articles/${articleId}/export`)
            .set("Cookie", cookie);

        expect(res.status).toBe(200);
        expect(res.headers["content-type"]).toContain("application/pdf");
    });

    test("should have correct content-disposition header with filename", async () => {
        const res = await request(app)
            .get(`/articles/${articleId}/export`)
            .set("Cookie", cookie);

        expect(res.headers["content-disposition"]).toBeDefined();
        expect(res.headers["content-disposition"]).toContain("attachment");
        expect(res.headers["content-disposition"]).toContain(`article-${articleId}`);
    });

    test("should return PDF content (binary data)", async () => {
        const res = await request(app)
            .get(`/articles/${articleId}/export`)
            .set("Cookie", cookie)
            .buffer()
            .parse((res, cb) => {
                res.setEncoding("binary");
                let data = "";
                res.on("data", chunk => {
                    data += chunk;
                });
                res.on("end", () => {
                    cb(null, Buffer.from(data, "binary"));
                });
            });

        expect(res.body).toBeInstanceOf(Buffer);
        expect(res.body.length).toBeGreaterThan(0);
        
        // Check PDF magic number (PDF files start with %PDF)
        const pdfHeader = res.body.toString("utf8", 0, 4);
        expect(pdfHeader).toBe("%PDF");
    });

    test("should handle non-existent article gracefully", async () => {
        const res = await request(app)
            .get(`/articles/99999999/export`)
            .set("Cookie", cookie);

        expect(res.status).toBe(404);
    });

    test("should work with longer articles", async () => {
        // Create article with longer content
        const longBody = "Lorem ipsum dolor sit amet. ".repeat(100);
        
        await request(app)
            .post(`/workspaces/${workspaceId}/articles`)
            .set("Cookie", cookie)
            .send({
                title: "Long Article for PDF Test",
                body: longBody
            });

        const list = await request(app)
            .get(`/workspaces/${workspaceId}/articles`)
            .set("Cookie", cookie);

        const longArticleId = list.text.match(/articles\/(\d+)/g).pop().split("/").pop();

        const res = await request(app)
            .get(`/articles/${longArticleId}/export`)
            .set("Cookie", cookie);

        expect(res.status).toBe(200);
        expect(res.headers["content-type"]).toContain("application/pdf");
    });
});
