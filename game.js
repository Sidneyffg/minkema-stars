import Player from "./playerHandler/player.js";

/**
 * @callback terminateGameCb
 */

/**
 * @typedef {object} pos
 * @property {number} pos.x
 * @property {number} pos.y
 */

export default class Game {
  /**
   * @param {Player[]} players
   * @param {*} mapData
   * @param {string} id
   * @param {terminateGameCb} terminateCb
   */
  constructor(players, mapData, id, terminateCb) {
    this.mapData = mapData;
    this.id = id;
    this.terminateCb = terminateCb;
    this.phase = "matchmaking";

    if (players.length > this.settings.totalPlayers)
      return console.log("More players in game than allowed, aborting game...");

    players.forEach((player) => {
      this.initPlayer(player);
    });

    this.on("posUpdate", ({ player, data }) => {
      const newPos = {
        x: player.gameData.pos.x + data.x,
        y: player.gameData.pos.y + data.y,
      };
      if (!this.isPlayerPosValid(player, newPos)) return;

      player.gameData.pos = newPos;
      this.emitToAllPlayers("posUpdate", {
        uid: player.gameData.uid,
        newPos: player.gameData.pos,
      });
    });

    this.on("leave", ({ player }) => {
      switch (this.phase) {
        case "ingame":
          if (!this.openLobby) break;
          this.removePlayer(player);
          break;
        case "matchmaking":
          this.removePlayer(player);
          break;
      }
      if (this.players.length == 0) this.terminate();
    });
  }

  /**
   * @param {Player} player
   */
  initPlayer(player) {
    player.gameData = {
      pos: { x: 3, y: 3 },
      username: player.publicData.username,
      uid: player.publicData.uid,
    };

    player.socket.on("gameUpdate", (type, data) => {
      this.listeners[type].forEach((e) => e({ player, data }));
    });

    this.players.forEach((e) => {
      e.socket.emit("gameUpdate", "newPlayer", player.gameData);
    });
    this.players.push(player);

    player.socket.emit("joinGame", this.getGameData());
    player.gameData.offlineListenerId = player.addOfflineListener(() => {
      this.removePlayer(player);
      if (this.players.length == 0) this.terminate();
    });

    if (this.players.length == this.settings.totalPlayers) this.startGame();
  }

  startGame() {
    this.phase = "ingame";
    this.emitToAllPlayers("phaseUpdate", { newPhase: "ingame" });
  }

  getGameData() {
    return {
      players: this.players.map((e) => e.gameData),
      map: this.mapData,
      phase: this.phase,
      openLobby: this.openLobby,
      totalPlayers: this.settings.totalPlayers,
    };
  }

  addPlayer(player) {
    this.initPlayer(player);
  }

  /**
   * @param {Player} player
   */
  removePlayer(player) {
    if (player.socket) {
      this.emitToPlayer(player, "terminate");
      player.socket.removeAllListeners("gameUpdate");
    }
    player.removeOfflineListener(player.gameData.offlineListenerId);
    const idx = this.players.indexOf(player);
    this.players.splice(idx, 1);
    this.emitToAllPlayers("playerLeft", { uid: player.gameData.uid });
    player.gameData = null;
  }

  /**
   * @param {Player} player
   * @param {pos} newPos
   */
  isPlayerPosValid(player, newPos) {
    const halfPlayerWidth = 0.1;
    const halfPlayerHeight = 0.1;
    return (
      this.isPosValid({
        x: newPos.x + halfPlayerWidth,
        y: newPos.y + halfPlayerHeight,
      }) &&
      this.isPosValid({
        x: newPos.x + halfPlayerWidth,
        y: newPos.y - halfPlayerHeight,
      }) &&
      this.isPosValid({
        x: newPos.x - halfPlayerWidth,
        y: newPos.y + halfPlayerHeight,
      }) &&
      this.isPosValid({
        x: newPos.x - halfPlayerWidth,
        y: newPos.y - halfPlayerHeight,
      })
    );
  }

  /**
   * @param {pos} pos
   */
  isPosValid(pos) {
    pos = {
      x: Math.round(pos.x),
      y: Math.round(pos.y),
    };

    const row = this.mapData.tiles[pos.y];
    if (!row) return false;
    const tile = row[pos.x];
    if (!tile) return false;

    return !tile.hasCollision;
  }

  /**
   * @param {string} type
   * @param {*} data
   */
  emitToAllPlayers(type, data) {
    this.players.forEach((player) => {
      this.emitToPlayer(player, type, data);
    });
  }

  /**
   * @param {Player} player
   * @param {string} type
   * @param {*} data
   */
  emitToPlayer(player, type, data) {
    player.socket.emit("gameUpdate", type, data);
  }

  /**
   * @callback gameUpdateCallback
   * @param {{player:Player,data:any}}
   */

  /**
   * @param {string} type
   * @param {gameUpdateCallback} callback
   */
  on(type, callback) {
    if (this.listeners[type] == undefined) {
      this.listeners[type] = [];
    }
    this.listeners[type].push(callback);
  }
  listeners = {};

  terminate() {
    this.players.forEach((e) => this.removePlayer(e));
    this.terminateCb();
  }

  /**
   * @type {terminateGameCb}
   */
  terminateCb;

  /**
   * @type {"matchmaking"|"ingame"}
   */
  phase;

  /**
   * @type {boolean}
   */
  openLobby = true;
  settings = {
    totalPlayers: 2,
  };
  /**
   * @type {import("./maps/mapHandler.js").map}
   */
  mapData;

  /**
   * @type {Player[]}
   */
  players = [];
}
