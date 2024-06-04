import KeyHandler from "./keyHandler.js";
import Time from "./time.js";

export default class PlayerHandler {
  constructor(gameRenderer, users, uid) {
    this.gameRenderer = gameRenderer;
    this.users = users;
    this.uid = uid;
    this.pos = this.users.find((e) => e.uid == uid).pos;

    this.gameRenderer.on("posUpdate", (data) => {
      const user = this.getUser(data.uid);
      user.pos.x = data.newPos.x;
      user.pos.y = data.newPos.y;
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

  /**
   * @type {import("./gameRenderer.js").default}
   */
  gameRenderer;
  baseSpeed = 0.01;
}
/*
this.ctx.fillRect(
      this.canvas.width / 2 - 5,
      this.canvas.height / 2 - 5,
      10,
      10
    );
*/

class Utils {
  static getFractionFromWhole(num) {
    return num - Math.round(num);
  }
  static angleToCoords(angle, speed) {
    angle = Utils.toRadians(angle);
    return {
      x: speed * Math.sin(angle),
      y: speed * -Math.cos(angle),
    };
  }
  static toRadians(angle) {
    return angle * (Math.PI / 180);
  }
}
