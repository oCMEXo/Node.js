const http = require("http");
const path = require("path");
const fs = require("fs");
const { Server } = require("socket.io");
const app = require("./app");
const { initNotifications } = require("./services/notifications");

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server);

initNotifications(io);

io.on("connection", socket => {
  console.log("Client connected", socket.id);
});

server.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
