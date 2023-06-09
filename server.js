import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import fetch from "node-fetch";

const app = express();
const server = createServer(app);
const io = new Server(server);

app.get("/", (req, res) => {
  res.sendFile(`${process.cwd()}/index.html`);
});

const webhookUrls = [
  'https://discord.com/api/webhooks/1116703131095539785/sm8lqcqHYu4PADVp2skjWBl6OdENe0RsT-TWWiFXLx2J6_QKYxickbF5KNLWKVfXzcL0'
  // More Webhook URLs can be added here
];

io.on("connection", (socket) => {
  console.log("ユーザーが接続しました");
  socket.on("chat message", async (msg) => {
    io.emit("chat message", msg);

    const data = { content: `Message: ${msg}` };

    for (const url of webhookUrls) {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        console.error(`Error sending message to Discord: ${response.statusText}`);
      }
    }
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log("listenin on 3000");
});

app.use(express.static('public'));
