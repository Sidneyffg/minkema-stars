class GameRenderer {
  /**
   * @param {Renderer} renderer
   * @param {AssetsHandler} assetsHandler
   */
  constructor(renderer, assetsHandler, keyHandler) {
    this.renderer = renderer;
    this.assetsHandler = assetsHandler;
    this.keyHandler = keyHandler;
    renderer.onResize((w, h) => this.#updateTileData(w, h));
  }
  pos = { x: 0, y: 0 };
  tiles = [
    [1, 1, 1, 1, 0, 1, 0, 1, 0, 1],
    [1, 1, 0, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ];

  render() {
    if (this.keyHandler.heldDownKeys.includes("w")) this.pos.y -= 0.1;
    if (this.keyHandler.heldDownKeys.includes("s")) this.pos.y += 0.1;
    if (this.keyHandler.heldDownKeys.includes("a")) this.pos.x -= 0.1;
    if (this.keyHandler.heldDownKeys.includes("d")) this.pos.x += 0.1;
    const centerPos = {
      x: this.renderer.canvas.width * 0.5,
      y: this.renderer.canvas.height * 0.5,
    };

    for (let i = 0; i < this.tiles.length; i++) {
      for (let j = 0; j < this.tiles[0].length; j++) {
        this.drawTileCenter(
          {
            x: centerPos.x + (j - this.pos.x) * this.tileSize,
            y: centerPos.y + (i - this.pos.y) * this.tileSize,
          },
          this.tiles[i][j]
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
