import KeyHandler from "./keyHandler.js";
import Time from "./time.js";
import Utils from "./utils.js";
import Vec2 from "./vec2.js";

export default class PlayerHandler {
  constructor(gameHandler, players, uid) {
    this.gameHandler = gameHandler;
    this.players = players;
    this.uid = uid;

    this.initPlayers();

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

  initPlayers() {
    this.players.forEach((e) => {
      e.pos = new Vec2(e.pos);
    });
    this.pos = this.players.find((e) => e.uid == this.uid).pos;
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
    const newPos = new Vec2(this.pos).add(movPos);

    if (this.isPlayerPosValid(newPos)) {
      return this.updatePosToServer(movPos);
    }
  }

  /**
   * @param {Vec2} pos
   * @returns {boolean}
   */
  isPlayerPosValid(pos) {
    return (
      this.isPosValid(new Vec2(pos).add(this.playerRadius)) &&
      this.isPosValid(new Vec2(pos).add({ x: this.playerRadius.x, y: -this.playerRadius.y })) &&
      this.isPosValid(new Vec2(pos).add({ x: -this.playerRadius.x, y: this.playerRadius.y })) &&
      this.isPosValid(new Vec2(pos).sub(this.playerRadius))
    );
  }

  /**
   * @param {Vec2} pos
   * @returns {boolean}
   */
  isPosValid(pos) {
    pos.round(0);

    const row = this.gameHandler.data.map.tiles[pos.y];
    if (!row) return false;
    const tile = row[pos.x];
    if (!tile) return false;

    return !tile.hasCollision;
  }

  /**
   * @param {Vec2} newPos
   */
  updatePosToServer(newPos) {
    this.gameHandler.emit("posUpdate", newPos.toJSON());
  }

  render() {
    const tileSize = this.gameHandler.tileHandler.tileSize;
    this.players.forEach((player) => {
      const playerPos = Utils.posToTLScreenCoords(
        this.pos,
        player.pos,
        this.gameHandler.screenCenterPos,
        this.gameHandler.tileHandler.tileSize,
        new Vec2(this.playerRadius).mult(tileSize * 2)
      );

      const textPos = Utils.posToMiddleScreenCoords(
        this.pos,
        player.pos,
        this.gameHandler.screenCenterPos,
        this.gameHandler.tileHandler.tileSize
      );
      textPos.y -= 20;
      this.#renderPlayer(playerPos, textPos, player.username);
    });
  }

  /**
   * @param {Vec2} playerPos
   * @param {Vec2} textPos
   * @param {string} username
   */
  #renderPlayer(playerPos, textPos, username) {
    const ctx = this.gameHandler.ctx;
    const tileSize = this.gameHandler.tileHandler.tileSize;
    const relPlayerDiamater = new Vec2(this.playerRadius).mult(tileSize * 2);
    ctx.fillRect(playerPos.x, playerPos.y, relPlayerDiamater.x, relPlayerDiamater.y);
    Utils.setTextStyle(ctx, { fontsize: 15, align: "center", bold: true });
    ctx.fillText(username, textPos.x, textPos.y);
  }

  /**
   * @type {Vec2}
   */
  pos;
  /**
   * @type {import("./gameHandler.js").default}
   */
  gameHandler;
  /**
   * @type {{}[]}
   */
  players;
  baseSpeed = 0.01;
  playerRadius = {
    x: 0.1,
    y: 0.1,
  };
}
