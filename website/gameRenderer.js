import PlayerHandler from "./playerHandler.js";
import Assets from "./assets.js";
import Time from "./time.js";

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

    this.playerHandler = new PlayerHandler(this, data.users, this.uid);
    console.log(this.playerHandler.pos);

    this.tileRenderer.updateTileData(window.innerWidth, window.innerHeight);
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    window.onresize = () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.tileRenderer.updateTileData(window.innerWidth, window.innerHeight);
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
    this.tileRenderer.render(
      this.ctx,
      this.data.map.tiles,
      this.playerHandler.pos
    );
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  emit(type, data) {
    this.socket.emit("gameUpdate", type, data);
  }

  on(type, cb) {
    this.listeners[type] = cb;
  }
  listeners = {};

  tileRenderer = new TileRenderer();
  data;
}

class TileRenderer {
  render(ctx, tiles, pos) {
    const centerPos = {
      x: this.screenWidth * 0.5,
      y: this.screenHeight * 0.5,
    };

    for (let i = 0; i < tiles.length; i++) {
      for (let j = 0; j < tiles[0].length; j++) {
        this.drawTileCenter(
          ctx,
          {
            x: centerPos.x + (j - pos.x) * this.tileSize,
            y: centerPos.y + (i - pos.y) * this.tileSize,
          },
          tiles[i][j]
        );
      }
    }
  }

  drawTileCenter(ctx, pos, tileId) {
    const img = Assets.assets[["tile_orange", "tile_red"][tileId]];
    ctx.drawImage(
      img,
      pos.x - this.halfTileSize,
      pos.y - this.halfTileSize,
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
}
