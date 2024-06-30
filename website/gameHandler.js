import MathcmakingHandler from "./matchmakingHandler.js";
import PlayerHandler from "./playerHandler.js";
import TileHandler from "./tileHandler.js";
import Time from "./time.js";
import Utils from "./utils.js";
import KeyHandler from "./keyHandler.js";
import Vec2 from "./vec2.js";

export default class GameHandler {
  constructor(uid, socket, data, terminateCb) {
    this.uid = uid;
    this.socket = socket;
    this.data = data;
    this.terminateCb = terminateCb;
    this.canvas = document.querySelector("canvas");
    this.ctx = this.canvas.getContext("2d");

    this.playerHandler = new PlayerHandler(this, data.players, this.uid);

    this.screenResize();
    window.onresize = () => {
      this.screenResize();
    };

    this.socket.on("gameUpdate", (type, data) => {
      const cb = this.listeners[type];
      if (cb) cb(data);
    });

    this.initPhase();
    this.handleKeys();
    this.handleTermination();
    this.render();
  }

  initPhase() {
    this.on("phaseUpdate", ({ newPhase }) => {
      this.data.phase = newPhase;
    });
  }

  handleKeys() {
    KeyHandler.onKeyPress((key) => {
      switch (key) {
        case "Escape":
          if (this.data.phase == "ingame" && !this.data.openLobby) break;
          this.emit("leave");
          break;
      }
    });
  }

  handleTermination() {
    this.on("terminate", () => {
      this.terminateCb();
    });
  }

  render() {
    requestAnimationFrame(() => {
      this.render();
    });

    Time.nextFrame();
    this.clearCanvas();

    switch (this.data.phase) {
      case "matchmaking":
        this.matchmakingHandler.render();
        break;
      case "ingame":
        this.playerHandler.updatePos();

        this.tileHandler.render(this.data.map.tiles, this.playerHandler.pos);
        this.playerHandler.render();
        this.renderCoords();
        break;
    }
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  renderCoords() {
    const fontsize = 20;
    const margin = 5;
    Utils.setTextStyle(this.ctx, { fontsize, align: "right" });

    const x = Math.round(this.playerHandler.pos.x);
    const y = Math.round(this.playerHandler.pos.y);
    this.ctx.fillText(`(${x}, ${y})`, this.canvas.width - margin, fontsize + margin);
  }

  emit(type, data) {
    this.socket.emit("gameUpdate", type, data);
  }

  screenResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.canvas.width = width;
    this.canvas.height = height;
    
    this.screenCenterPos = new Vec2({
      x: width * 0.5,
      y: height * 0.5,
    });
    this.screenResizeListeners.forEach((cb) => {
      cb(width, height);
    });
  }

  onScreenResize(cb) {
    this.screenResizeListeners.push(cb);
  }
  screenResizeListeners = [];

  on(type, cb) {
    this.listeners[type] = cb;
  }
  listeners = {};

  matchmakingHandler = new MathcmakingHandler(this);
  tileHandler = new TileHandler(this);
  /**
   * @type {{phase:"matchmaking"|"ingame",map:object,players:array,totalPlayers:number,openLobby:boolean}}
   */
  data;
  terminateCb;
}
