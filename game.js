import Player from "./playerHandler/player.js";

export default class Game {
  /**
   * @param {Player[]} players
   * @param {*} mapData
   */
  constructor(players, mapData, id) {
    this.mapData = mapData;
    this.id = id;

    players.forEach((player) => {
      this.initPlayer(player);
    });

    this.on("posUpdate", ({ player, data }) => {
      player.pos.x += data.x;
      player.pos.y += data.y;
      this.emitToAllPlayers("posUpdate", {
        uid: player.uid,
        newPos: player.pos,
      });
    });
  }

  /**
   * @param {Player} player
   */
  initPlayer(player) {
    player.pos = { x: 3, y: 0 };
    player.socket.on("gameUpdate", (type, data) => {
      this.listeners[type].forEach((e) => e({ player, data }));
    });

    this.players.forEach((e) => {
      e.socket.emit("gameUpdate", "newPlayer", {
        pos: player.pos,
        uid: player.uid,
      });
    });
    this.players.push(player);

    const gameData = {
      map: this.mapData,
      players: this.genPlayerData(),
    };
    player.socket.emit("joinGame", gameData);
    player.addOfflineListener(() => {
      this.removePlayer(player);
    });
  }

  genPlayerData() {
    const playersData = [];
    this.players.forEach((e) => {
      playersData.push({
        pos: e.pos,
        uid: e.uid,
      });
    });
    return playersData;
  }

  addPlayer(player) {
    this.initPlayer(player);
  }

  /**
   * @param {Player} player
   */
  removePlayer(player) {
    const idx = this.players.indexOf(player);
    this.players.splice(idx, 1);
    this.emitToAllPlayers("playerLeft", { uid: player.uid });
  }

  /**
   * @param {string} type 
   * @param {*} data 
   */
  emitToAllPlayers(type, data) {
    this.players.forEach((player) => {
      player.socket.emit("gameUpdate", type, data);
    });
  }

  on(type, callback) {
    if (this.listeners[type] == undefined) {
      this.listeners[type] = [];
    }
    this.listeners[type].push(callback);
  }
  listeners = {};
  mapData;
  players = [];
}
