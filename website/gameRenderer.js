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
    this.updatePos();

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

  updatePos() {
    const heldDownKeys = this.keyHandler.heldDownKeys;
    const xMov =
      heldDownKeys.includes("d") * 1 - heldDownKeys.includes("a") * 1;
    const yMov =
      heldDownKeys.includes("s") * 1 - heldDownKeys.includes("w") * 1;

    if (xMov === 0 || yMov === 0) {
      this.pos.x += xMov * this.baseSpeed;
      this.pos.y += yMov * this.baseSpeed;
    } else {
      let angle;
      if (xMov === 1) {
        if (yMov === 1) {
          angle = 135;
        } else {
          angle = 45;
        }
      } else {
        if (yMov === 1) {
          angle = 225;
        } else {
          angle = 315;
        }
      }

      const movPos = this.utils.angleToCoords(angle, this.baseSpeed);
      this.pos.x += movPos.x;
      this.pos.y += movPos.y;
    }
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
  tilesWidth = 20;
  halfTilesWidth = this.tilesWidth / 2;
  utils = new Utils();
  baseSpeed = 0.1;
}

class Utils {
  getFractionFromWhole(num) {
    return num - Math.round(num);
  }
  angleToCoords(angle, speed) {
    angle = this.toRadians(angle);
    return {
      x: speed * Math.sin(angle),
      y: speed * -Math.cos(angle),
    };
  }
  toRadians(angle) {
    return angle * (Math.PI / 180);
  }
}
