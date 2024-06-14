import GameRenderer from "./gameRenderer.js";
import MenuRenderer from "./menuRenderer.js";
import KeyHandler from "./keyHandler.js";
import Assets from "./assets.js";
import Time from "./time.js";

export class Renderer {
  async init() {
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

  login() {
    return new Promise((resolve) => {
      const token = this.getToken();
      if (!token) return resolve(false);
      this.socket.emit("init", token, (data) => {
        if (!data) {
          this.deleteToken();
          return resolve(false);
        }
        this.data = data;
        return resolve(true);
      });
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
