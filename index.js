import fs from "fs";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import MapHandler from "./maps/mapHandler.js";
import PlayerHandler from "./playerHandler/playerHandler.js";

const app = express();
const server = createServer(app);
const io = new Server(server);
const websitePath = `${process.cwd()}/website`;
const assetsPath = `${process.cwd()}/assets`;
MapHandler.init();
PlayerHandler.init();

app.use("/", express.static(websitePath));
app.use("/assets", express.static(assetsPath));

generateAssetData();

io.on("connection", (socket) => {
  PlayerHandler.newConnection(socket);
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
