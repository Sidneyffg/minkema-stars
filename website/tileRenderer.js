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
    const centerPos = {
      x: this.renderer.canvas.width * 0.5,
      y: this.renderer.canvas.height * 0.5,
    };

    for (let i = 0; i < tiles.length; i++) {
      for (let j = 0; j < tiles[0].length; j++) {
        this.drawTileCenter(
          {
            x: centerPos.x + (j - pos.x) * this.tileSize,
            y: centerPos.y + (i - pos.y) * this.tileSize,
          },
          tiles[i][j]
        );
      }
    }
  }

  drawTileCenter(pos, tileId) {
    const img = this.assetsHandler.assets[["tile_orange", "tile_red"][tileId]];
    this.renderer.context.drawImage(
      img,
      pos.x - this.halftileSize,
      pos.y - this.halftileSize,
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
  tilesWidth = 100;
  halfTilesWidth = this.tilesWidth / 2;
}

function getFractionFromWhole(num) {
  return num - Math.round(num);
}
