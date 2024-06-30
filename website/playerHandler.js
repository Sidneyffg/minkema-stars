import KeyHandler from "./keyHandler.js";
import Time from "./time.js";
import Utils from "./utils.js";

export default class PlayerHandler {
  constructor(gameHandler, players, uid) {
    this.gameHandler = gameHandler;
    this.players = players;
    console.log(players);
    this.uid = uid;
    this.pos = this.players.find((e) => e.uid == uid).pos;

    this.gameHandler.on("posUpdate", (data) => {
      const player = this.getPlayer(data.uid);
      player.pos.x = data.newPos.x;
      player.pos.y = data.newPos.y;
    });
    this.gameHandler.on("newPlayer", (player) => {
      console.log("newPlayer");
      this.players.push(player);
    });
    this.gameHandler.on("playerLeft", ({ uid }) => {
      const player = this.players.find((e) => e.uid == uid);
      const idx = this.players.indexOf(player);
      this.players.splice(idx, 1);
    });
  }

  getPlayer(uid) {
    return this.players.find((e) => e.uid == uid);
  }

  updatePos() {
    const heldDownKeys = KeyHandler.heldDownKeys;
    const xMov = heldDownKeys.includes("d") * 1 - heldDownKeys.includes("a") * 1;
    const yMov = heldDownKeys.includes("s") * 1 - heldDownKeys.includes("w") * 1;

    let angle;
    if (xMov === 0 || yMov === 0) {
      if (xMov === 0 && yMov === 0) return;

      if (xMov) angle = 180 - xMov * 90;
      else angle = 90 + yMov * 90;
    } else {
      if (xMov === 1) {
        if (yMov === 1) {
          angle = 135;
        } else {
          angle = 45;
        }
      } else {
        if (yMov === 1) {
          angle = 225;
        } else {
          angle = 315;
        }
      }
    }
    const movPos = Utils.angleToCoords(angle, this.baseSpeed * Time.deltaTime);
    const newPos = {
      x: this.pos.x + movPos.x,
      y: this.pos.y + movPos.y,
    };

    if (this.isPlayerPosValid(newPos)) {
      return this.updatePosToServer(movPos);
    }
  }

  isPlayerPosValid(pos) {
    return (
      this.isPosValid({
        x: pos.x + this.playerRadius.x,
        y: pos.y + this.playerRadius.y,
      }) &&
      this.isPosValid({
        x: pos.x + this.playerRadius.x,
        y: pos.y - this.playerRadius.y,
      }) &&
      this.isPosValid({
        x: pos.x - this.playerRadius.x,
        y: pos.y + this.playerRadius.y,
      }) &&
      this.isPosValid({
        x: pos.x - this.playerRadius.x,
        y: pos.y - this.playerRadius.y,
      })
    );
  }

  isPosValid(pos) {
    pos = {
      x: Math.round(pos.x),
      y: Math.round(pos.y),
    };

    const row = this.gameHandler.data.map.tiles[pos.y];
    if (!row) return false;
    const tile = row[pos.x];
    if (!tile) return false;

    return !tile.hasCollision;
  }

  updatePosToServer(newPos) {
    this.gameHandler.emit("posUpdate", newPos);
  }

  render() {
    const tileSize = this.gameHandler.tileHandler.tileSize;
    this.players.forEach((player) => {
      const playerPos = Utils.posToTLScreenCoords(
        this.pos,
        player.pos,
        this.gameHandler.screenCenterPos,
        this.gameHandler.tileHandler.tileSize,
        {
          x: this.playerRadius.x * 2 * tileSize,
          y: this.playerRadius.y * 2 * tileSize,
        }
      );

      const textPos = Utils.posToMiddleScreenCoords(
        this.pos,
        {
          x: player.pos.x,
          y: player.pos.y,
        },
        this.gameHandler.screenCenterPos,
        this.gameHandler.tileHandler.tileSize
      );
      textPos.y -= 20;
      this.#renderPlayer(playerPos, textPos, player.username);
    });
  }

  #renderPlayer(playerPos, textPos, username) {
    const ctx = this.gameHandler.ctx;
    const tileSize = this.gameHandler.tileHandler.tileSize;
    ctx.fillRect(playerPos.x, playerPos.y, this.playerRadius.x * 2 * tileSize, this.playerRadius.y * 2 * tileSize);
    Utils.setTextStyle(ctx, { fontsize: 15, align: "center", bold: true });
    ctx.fillText(username, textPos.x, textPos.y);
  }

  /**
   * @type {{x:number,y:number}}
   */
  pos;
  /**
   * @type {import("./gameHandler.js").default}
   */
  gameHandler;
  players;
  baseSpeed = 0.01;
  playerRadius = {
    x: 0.1,
    y: 0.1,
  };
}
