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

    console.log(data,uid)
    this.playerHandler = new PlayerHandler(this, data.players, this.uid);
    console.log(this.playerHandler.pos);

    this.screenResize();
    window.onresize = () => {
      this.screenResize();
    };
    this.socket.on("gameUpdate", (type, data) => {
      const cb = this.listeners[type];
      if (cb) cb(data);
    });
    this.render();
  }

  render() {
    requestAnimationFrame(() => {
      this.render();
    });
    Time.nextFrame();

    this.clearCanvas();
    this.playerHandler.updatePos();

    this.tileRenderer.render(this.data.map.tiles, this.playerHandler.pos);
    this.playerHandler.renderPlayers();
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
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

  tileRenderer = new TileRenderer(this);
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
          Utils.posToScreenCoords(
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
    this.gameRenderer.ctx.drawImage(
      img,
      pos.x,
      pos.y,
      this.tileSize,
      this.tileSize
    );
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
