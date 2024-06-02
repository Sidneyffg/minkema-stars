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

    this.gameRenderer = new GameRenderer(this);
    this.menuRenderer = new MenuRenderer(this);
    this.menuRenderer.activate();

    this.windowResize();
    window.onresize = () => {
      this.windowResize();
    };

    this.socket.on("joinGame", (gameData) => {
      this.inGame = true;
      this.menuRenderer.deactivate();
      this.gameRenderer.updateGameData(gameData);
      this.renderFrame();
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
    this.ctx.fillRect(
      this.canvas.width / 2 - 5,
      this.canvas.height / 2 - 5,
      10,
      10
    );
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  windowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.resizeCallbacks.forEach((e) => e(width, height));
    this.canvas.width = width;
    this.canvas.height = height;
  }

  onResize(callback) {
    this.resizeCallbacks.push(callback);
  }
  resizeCallbacks = [];

  renderers;
  inGame = false;
  canvas = document.querySelector("canvas");
  ctx = this.canvas.getContext("2d");
}

const renderer = new Renderer();
renderer.init();
