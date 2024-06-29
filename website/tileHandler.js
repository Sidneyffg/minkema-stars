import Utils from "./utils.js";
import Assets from "./assets.js";

export default class TileHandler {
  constructor(gameHandler) {
    this.gameHandler = gameHandler;
    this.gameHandler.onScreenResize((w, h) => {
      this.updateTileData(w, h);
    });
  }
  render(tiles, pos) {
    for (let i = 0; i < tiles.length; i++) {
      for (let j = 0; j < tiles[0].length; j++) {
        this.drawTileCenter(
          Utils.posToTLScreenCoords(
            pos,
            { x: j, y: i },
            this.gameHandler.screenCenterPos,
            this.tileSize,
            this.tileSize
          ),
          tiles[i][j]
        );
      }
    }
  }

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
