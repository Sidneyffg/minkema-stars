import MathcmakingHandler from "./matchmakingHandler.js";
import PlayerHandler from "./playerHandler.js";
import Assets from "./assets.js";
import Time from "./time.js";
import Utils from "./utils.js";

export default class GameRenderer {
  /**
   * @param {Renderer} renderer
   */
  constructor(uid, socket, data) {
    this.uid = uid;
    this.socket = socket;
    this.data = data;
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
    this.render();
  }

  initPhase() {
    this.on("phaseUpdate", ({ newPhase }) => {
      this.data.phase = newPhase;
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

        this.tileRenderer.render(this.data.map.tiles, this.playerHandler.pos);
        this.playerHandler.render();
        this.renderCoords();
        break;
    }
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  renderCoords() {
    this.ctx.textAlign = "right";
    this.ctx.textBaseline = "alphabetic";
    this.ctx.font = "20px Roboto";
    const x = Math.round(this.playerHandler.pos.x);
    const y = Math.round(this.playerHandler.pos.y);
    this.ctx.fillText(`(${x}, ${y})`, this.canvas.width - 5, 25);
  }

  emit(type, data) {
    this.socket.emit("gameUpdate", type, data);
  }

  screenResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.canvas.width = width;
    this.canvas.height = height;
    this.screenCenterPos = {
      x: width * 0.5,
      y: height * 0.5,
    };
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
  tileRenderer = new TileRenderer(this);
  /**
   * @type {{phase:"matchmaking"|"ingame",mapdata:object,players:array,totalPlayers:number}}
   */
  data;
}

class TileRenderer {
  constructor(gameRenderer) {
    this.gameRenderer = gameRenderer;
    this.gameRenderer.onScreenResize((w, h) => {
      this.updateTileData(w, h);
    });
  }
  render(tiles, pos) {
    for (let i = 0; i < tiles.length; i++) {
      for (let j = 0; j < tiles[0].length; j++) {
        this.drawTileCenter(
          Utils.posToTLScreenCoords(
            pos,
            { x: i, y: j },
            this.gameRenderer.screenCenterPos,
            this.tileSize,
            this.tileSize
          ),
          tiles[i][j]
        );
      }
    }
  }

  drawTileCenter(pos, tileId) {
    const img = Assets.assets[["tile_orange", "tile_red"][tileId]];
    this.gameRenderer.ctx.drawImage(img, pos.x, pos.y, this.tileSize, this.tileSize);
  }

  updateTileData(screenWidth, screenHeight) {
    this.tileSize = Math.ceil(screenWidth / this.tilesWidth);
    this.halfTileSize = this.tileSize / 2;
    this.screenWidth = screenWidth;
    this.screenHeight = screenHeight;
  }
  tileSize;
  halfTileSize;
  screenWidth;
  screenHeight;
  tilesWidth = 20;
  /**
   * @type {GameRenderer}
   */
  gameRenderer;
}
