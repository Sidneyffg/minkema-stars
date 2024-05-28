import fs from "fs";
import express from "express";
const app = express();
import { createServer } from "http";
const server = createServer(app);
import { Server } from "socket.io";
const io = new Server(server);
const websitePath = `${process.cwd()}/website`;
const assetsPath = `${process.cwd()}/assets`;

app.use("/", express.static(websitePath));
app.use("/assets", express.static(assetsPath));

generateAssetData();

io.on("connection", (socket) => {
  console.log("new connection");
});

function generateAssetData() {
  const dataFile = "data.json";
  const fileNames = fs.readdirSync(assetsPath);
  if (fileNames.includes(dataFile)) {
    const idx = fileNames.indexOf(dataFile);
    fileNames.splice(idx, 1);
  }
  fs.writeFileSync(`${assetsPath}/${dataFile}`, JSON.stringify(fileNames));
}

server.listen(3000, () => {
  console.log("listening on *:3000");
});
