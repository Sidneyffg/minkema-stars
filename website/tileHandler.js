import Utils from "./utils.js";
import Assets from "./assets.js";
import Vec2 from "./vec2.js";

export default class TileHandler {
  constructor(gameHandler) {
    this.gameHandler = gameHandler;
    this.gameHandler.onScreenResize((w, h) => {
      this.updateTileData(w, h);
    });
  }

  /**
   * @param {Array} tiles
   * @param {Vec2} pos
   */
  render(tiles, pos) {
    for (let i = 0; i < tiles.length; i++) {
      for (let j = 0; j < tiles[0].length; j++) {
        const tileCoords = new Vec2({ x: j, y: i });
        this.drawTileCenter(
          Utils.posToTLScreenCoords(
            pos,
            tileCoords,
            this.gameHandler.screenCenterPos,
            this.tileSize,
            new Vec2(this.tileSize)
          ),
          tiles[i][j]
        );
      }
    }
  }

  /**
   * @param {Vec2} pos
   * @param {object} tile
   */
  drawTileCenter(pos, tile) {
    const img = Assets.assets.tiles.find((e) => e.tileId == tile.tileId).asset;
    this.gameHandler.ctx.drawImage(img, pos.x, pos.y, this.tileSize, this.tileSize);
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
   * @type {GameHandler}
   */
  gameHandler;
}
