class GameRenderer {
  /**
   * @param {Renderer} renderer
   */
  constructor(renderer) {
    this.renderer = renderer;
    renderer.onResize((w, h) => {
      this.tileRenderer.updateTileData(w, h);
    });
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

  render(ctx) {
    this.updatePos();
    this.tileRenderer.render(ctx, this.tiles, this.pos);
  }

  updatePos() {
    const heldDownKeys = KeyHandler.heldDownKeys;
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

      const movPos = Utils.angleToCoords(angle, this.baseSpeed);
      this.pos.x += movPos.x;
      this.pos.y += movPos.y;
    }
  }

  baseSpeed = 0.1;
  tileRenderer = new TileRenderer();
}

class TileRenderer {
  /**
   * @param {GameRenderer} gameRenderer
   */
  constructor(gameRenderer) {
    this.gameRenderer = gameRenderer;
  }
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
      pos.x - this.halftileSize,
      pos.y - this.halftileSize,
      this.tileSize,
      this.tileSize
    );
  }

  updateTileData(screenWidth, screenHeight) {
    this.tileSize = Math.ceil(screenWidth / this.tilesWidth);
    this.halftileSize = this.tileSize / 2;
    this.screenWidth = screenWidth;
    this.screenHeight = screenHeight;
  }
  tileSize;
  halfTileSize;
  screenWidth;
  screenHeight;
  tilesWidth = 20;
}

class Utils {
  static getFractionFromWhole(num) {
    return num - Math.round(num);
  }
  static angleToCoords(angle, speed) {
    angle = Utils.toRadians(angle);
    return {
      x: speed * Math.sin(angle),
      y: speed * -Math.cos(angle),
    };
  }
  static toRadians(angle) {
    return angle * (Math.PI / 180);
  }
}
