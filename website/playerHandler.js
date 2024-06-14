import KeyHandler from "./keyHandler.js";
import Time from "./time.js";
import Utils from "./utils.js";

export default class PlayerHandler {
  constructor(gameRenderer, users, uid) {
    this.gameRenderer = gameRenderer;
    this.users = users;
    console.log(users);
    this.uid = uid;
    this.pos = this.users.find((e) => e.uid == uid).pos;

    this.gameRenderer.on("posUpdate", (data) => {
      const user = this.getUser(data.uid);
      user.pos.x = data.newPos.x;
      user.pos.y = data.newPos.y;
    });
    this.gameRenderer.on("newPlayer", (user) => {
      console.log("newPlayer");
      this.users.push(user);
    });
  }

  getUser(uid) {
    return this.users.find((e) => e.uid == uid);
  }

  updatePos() {
    const heldDownKeys = KeyHandler.heldDownKeys;
    const xMov =
      heldDownKeys.includes("d") * 1 - heldDownKeys.includes("a") * 1;
    const yMov =
      heldDownKeys.includes("s") * 1 - heldDownKeys.includes("w") * 1;

    if (xMov === 0 || yMov === 0) {
      if (xMov === 0 && yMov === 0) return;
      this.updatePosToServer({
        x: xMov * this.baseSpeed * Time.deltaTime,
        y: yMov * this.baseSpeed * Time.deltaTime,
      });
    } else {
      let angle;
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

      const movPos = Utils.angleToCoords(
        angle,
        this.baseSpeed * Time.deltaTime
      );
      this.updatePosToServer(movPos);
    }
  }

  updatePosToServer(newPos) {
    this.gameRenderer.emit("posUpdate", newPos);
  }

  renderPlayers() {
    this.users.forEach((user) => {
      const pos = Utils.posToScreenCoords(
        this.pos,
        user.pos,
        this.gameRenderer.screenCenterPos,
        this.gameRenderer.tileRenderer.tileSize,
        this.playerWidth
      );
      this.#renderPlayer(pos);
    });
  }

  #renderPlayer(pos) {
    this.gameRenderer.ctx.fillRect(
      pos.x,
      pos.y,
      this.playerWidth,
      this.playerWidth
    );
  }

  /**
   * @type {import("./gameRenderer.js").default}
   */
  gameRenderer;
  baseSpeed = 0.01;
  playerWidth = 10;
}
/*
this.ctx.fillRect(
      this.canvas.width / 2 - 5,
      this.canvas.height / 2 - 5,
      10,
      10
    );
*/