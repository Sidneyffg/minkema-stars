class TileRenderer {
  /**
   * @param {Renderer} renderer
   * @param {AssetsHandler} assetsHandler
   */
  constructor(renderer, assetsHandler) {
    this.renderer = renderer;
    this.assetsHandler = assetsHandler;
    renderer.onResize((w, h) => this.#updateTileData(w, h));
  }

  render(pos, tiles) {
    const offset = {
      x: getFractionFromWhole(pos.x),
      y: getFractionFromWhole(pos.y) - this.halfOffScreenHeight,
    };
    pos = { x: Math.round(pos.x), y: Math.round(pos.y) };
    for (let i = 0; i < this.tilesHeight + 1; i++) {
      for (let j = 0; j < this.tilesWidth + 1; j++) {
        const tilePos = {
          x: j + pos.x - Math.round(this.halfTilesWidth),
          y: i + pos.y - Math.round(this.halfShownTilesHeight),
        };
        if (
          tilePos.x < 0 ||
          tilePos.x >= tiles.length ||
          tilePos.y < 0 ||
          tilePos.y >= tiles[0].length
        )
          continue;
        this.drawTileCenter(
          {
            x: tilePos.x + offset.x,
            y: tilePos.y + offset.y,
          },
          tiles[tilePos.x][tilePos.y]
        );
      }
    }
  }

  drawTileCenter(pos, tileId) {
    const img = this.assetsHandler.assets[["tile_orange", "tile_red"][tileId]];
    this.renderer.context.drawImage(
      img,
      pos.x * this.tileSize - this.halftileSize,
      pos.y * this.tileSize - this.halftileSize,
      this.tileSize,
      this.tileSize
    );
  }

  #updateTileData(screenWidth, screenHeight) {
    this.tileSize = Math.ceil(screenWidth / this.tilesWidth);
    this.halftileSize = this.tileSize / 2;
    this.shownTilesHeight = screenHeight / this.tileSize;
    this.halfShownTilesHeight = this.shownTilesHeight / 2;
    this.tilesHeight = Math.ceil(this.shownTilesHeight);
    this.halfTilesHeight = this.tilesHeight / 2;
    this.halfOffScreenHeight = this.halfTilesHeight - this.halfShownTilesHeight;
  }
  tileSize;
  halfTileSize;
  shownTilesHeight;
  halfShownTilesHeight;
  tilesHeight;
  halfTilesHeight;
  tilesWidth = 10;
  halfTilesWidth = this.tilesWidth / 2;
}

function getFractionFromWhole(num) {
  return num - Math.round(num);
}
