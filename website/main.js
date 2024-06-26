import GameHandler from "./gameHandler.js";
import MenuHandler from "./menuHandler.js";
import KeyHandler from "./keyHandler.js";
import Assets from "./assets.js";
import Time from "./time.js";

export class Main {
  async init() {
    this.uid = this.#getUid();
    this.socket = io();
    this.loggedIn = await this.login();

    KeyHandler.init();
    await Assets.init();

    this.menuHandler = new MenuHandler(this);
    this.menuHandler.activate();

    this.socket.on("joinGame", (gameData) => {
      this.inGame = true;
      this.menuHandler.deactivate();
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
      const uid = this.uid;
      if (!token || !uid) return resolve(false);

      this.socket.emit("init", { type: "tokenLogin", token, uid }, ({ err, publicData, privateData }) => {
        if (err) {
          this.deleteToken();
          this.deleteUid();
          return resolve(false);
        }
        console.log(publicData, privateData);
        return resolve(true);
      });
    });
  }

  startGame(gameData) {
    console.log(gameData);
    this.gameHandler = new GameHandler(this.uid, this.socket, gameData, () => {
      this.menuHandler.activate();
    });
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
    this.gameHandler.render(this.ctx);
  }

  inGame = false;
}

new Main().init();
