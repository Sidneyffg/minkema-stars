import Game from "../game.js";
import MapHandler from "../maps/mapHandler.js";
import Player from "./player.js";
import fs from "fs";

export default class PlayerHandler {
  static init() {
    const data = fs.readFileSync("./playerHandler/players.json");
    JSON.parse(data).forEach((playerData) => {
      PlayerHandler.players.push(new Player(false, playerData));
    });
  }

  static newConnection(socket) {
    PlayerHandler.handleLogin(socket, (player) => {
      socket.on("joinGame", (id) => {
        const game = PlayerHandler.getGame(id);
        if (!game) return PlayerHandler.newGame([player], "7f72356e-fe32-488c-8c7a-6bda7f10383f", id);

        game.addPlayer(player);
      });

      socket.once("disconnect", () => {
        player.turnOffline();
      });
    });
  }

  /**
   * @callback handleLoginCb
   * @param {Player}
   */
  /**
   * @param {*} socket
   * @param {handleLoginCb} successCb
   */
  static handleLogin(socket, successCb) {
    socket.once("init", (data, cb) => {
      if (data.type == "tokenLogin") {
        const player = PlayerHandler.getPlayer({ uid: data.uid });
        if (!player || !player.compareToken(data.token))
          return PlayerHandler.handleLoginCb(false, cb, successCb, socket);
        return PlayerHandler.handleLoginCb(true, cb, successCb, socket, player);
      } else if (data.type == "usernameLogin") {
        if (
          !PlayerHandler.isValidUsername(data.username, {
            hasUid: true,
            playerExists: true,
          })
        )
          return PlayerHandler.handleLoginCb(false, cb, successCb, socket);
        const name = data.username.split("#")[0];
        const uid = data.username.split("#")[1];
        const player = PlayerHandler.getPlayer({ uid });
        if (!player || player.publicData.username !== name || !player.comparePassword(data.password))
          return PlayerHandler.handleLoginCb(false, cb, successCb, socket);
        return PlayerHandler.handleLoginCb(true, cb, successCb, socket, player);
      } else if (data.type == "signup") {
        if (!PlayerHandler.isValidUsername(data.username) || !PlayerHandler.isValidPassword(data.password))
          return PlayerHandler.handleLoginCb(false, cb, successCb, socket);
        const player = PlayerHandler.addPlayer(data.username, data.password);
        return PlayerHandler.handleLoginCb(true, cb, successCb, socket, player);
      }
    });
  }

  /**
   * @param {boolean} successfull
   * @param {Function} socketCb
   * @param {handleLoginCb} successCb
   * @param {Player} [player]
   */
  static handleLoginCb(successfull, socketCb, successCb, socket, player) {
    if (successfull) {
      player.turnOnline(socket);
      socketCb({
        publicData: player.publicData,
        privateData: player.privateData,
      });
      successCb(player);
    } else {
      socketCb({ err: true });
      PlayerHandler.handleLogin(socket, successCb);
    }
  }

  static newGame(players, mapId, id) {
    const map = MapHandler.getMap(mapId);
    const game = new Game(players, map, id, () => {
      PlayerHandler.terminateGame(game);
    });
    this.games.push(game);
    console.log(`Started game ${game.id}`);
    return game;
  }

  /**
   * @param {Game} game
   */
  static terminateGame(game) {
    if (game.players.length > 0) {
      return console.log("Tried terminating game with players left...");
    }
    const idx = this.games.indexOf(game);
    this.games.splice(idx, 1);
    console.log(`Terminated game ${game.id}`);
  }

  static getGame(id) {
    return PlayerHandler.games.find((e) => e.id == id);
  }

  /**
   * @param {object} data
   * @param {string} [data.token]
   * @param {string} [data.uid]
   * @returns {Player | null}
   */
  static getPlayer(data) {
    if (data.uid) return PlayerHandler.players.find((e) => e.publicData.uid == data.uid);
    if (data.token) return PlayerHandler.players.find((e) => e.privateData.token == data.token);
    return null;
  }

  static addPlayer(username, password) {
    const player = new Player(true, { username, password });
    PlayerHandler.players.push(player);
    PlayerHandler.savePlayers();
    return player;
  }

  /**
   * @param {Player} player
   */
  static removePlayer(player) {
    const idx = PlayerHandler.players.indexOf(player);
    if (idx == -1) return console.log("Failed deleting player: does not exist");
    PlayerHandler.players.splice(idx, 1);
    PlayerHandler.savePlayers();
    PlayerHandler.isValidUsername();
  }

  /**
   * @param {string} username
   * @param {object} [options]
   * @param {boolean} [options.hasUid]
   * @param {boolean} [options.playerExists] - needs an uid to work
   * @returns {boolean}
   */
  static isValidUsername(username, options = {}) {
    if (options.hasUid) {
      const matches = username.match(/[a-zA-Z0-9]{3,15}#[a-zA-NP-Z1-9]{6}/);
      if (!matches || matches.length != 1 || matches[0] != username) return false;
      if (options.playerExists) {
        const name = username.split("#")[0];
        const uid = username.split("#")[1];
        const player = PlayerHandler.getPlayer({ uid });
        if (!player || player.publicData.username != name) return false;
      }
      return true;
    }
    const matches = username.match(/[a-zA-Z0-9]{3,15}/);
    if (!matches || matches.length != 1 || matches[0] != username) return false;
    return true;
  }

  static isValidPassword(password) {
    const matches = password.match(/[a-zA-Z0-9.,]{8,30}/);
    if (!matches || matches.length != 1 || matches[0] != password) return false;
    return true;
  }

  static async savePlayers() {
    const players = [];
    PlayerHandler.players.forEach((e) => {
      players.push(e.getJSON());
    });
    const data = JSON.stringify(players);
    fs.writeFile("./playerHandler/players.json", data, (err) => {
      if (err) console.log("Failed to save players: ", err);
    });
  }

  /**
   * @type {Player[]}
   */
  static players = [];
  /**
   * @type {Game[]}
   */
  static games = [];
}
