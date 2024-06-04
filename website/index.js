import GameRenderer from "./gameRenderer.js";
import MenuRenderer from "./menuRenderer.js";
import KeyHandler from "./keyHandler.js";
import Assets from "./assets.js";
import Time from "./time.js";

export class Renderer {
  async init() {
    this.socket = io();
    this.initConnection();
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

  getUid() {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].split("=");
      if (cookie[0] == "uid") return cookie[1];
    }
    return Math.random().toString(36).slice(2, 10);
  }

  initConnection() {
    this.uid = this.getUid();
    if (!this.uid) window.location.href += "/login";
    this.socket.emit("init", {
      uid: this.uid,
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
