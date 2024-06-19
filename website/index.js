import GameRenderer from "./gameRenderer.js";
import MenuRenderer from "./menuRenderer.js";
import KeyHandler from "./keyHandler.js";
import Assets from "./assets.js";
import Time from "./time.js";

export class Renderer {
  async init() {
    this.uid = this.#getUid();
    this.socket = io();
    this.loggedIn = await this.login();

    KeyHandler.init();
    await Assets.init();

    this.menuRenderer = new MenuRenderer(this);
    this.menuRenderer.activate();

    this.socket.on("joinGame", (gameData) => {
      this.inGame = true;
      this.menuRenderer.deactivate();
      this.startGame(gameData);
    });
  }

  getToken() {
    return window.localStorage.getItem("token");
  }

  setToken(token) {
    window.localStorage.setItem("token", token);
  }

  deleteToken() {
    window.localStorage.removeItem("token");
  }

  #getUid() {
    return window.localStorage.getItem("uid");
  }

  setUid(uid) {
    window.localStorage.setItem("uid", uid);
    this.uid = uid;
  }

  deleteUid() {
    window.localStorage.removeItem("uid");
  }

  login() {
    return new Promise((resolve) => {
      const token = this.getToken();
      if (!token || !this.uid) return resolve(false);

      this.socket.emit(
        "init",
        { type: "tokenLogin", token, uid: this.uid },
        (data) => {
          if (data.err) {
            this.deleteToken();
            this.deleteUid();
            return resolve(false);
          }
          return resolve(true);
        }
      );
    });
  }

  startGame(gameData) {
    this.gameRenderer = new GameRenderer(this.uid, this.socket, gameData);
  }

  joinGame(id) {
    this.socket.emit("joinGame", id);
  }

  renderFrame() {
    requestAnimationFrame(() => {
      if (this.inGame) this.renderFrame();
    });
    Time.nextFrame();
    this.clearCanvas();
    this.gameRenderer.render(this.ctx);
  }

  renderers;
  inGame = false;
}

const renderer = new Renderer();
renderer.init();
