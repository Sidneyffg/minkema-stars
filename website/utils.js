export default class Utils {
  static getFractionFromWhole(num) {
    return num - Math.round(num);
  }
  static angleToCoords(angle, speed) {
    const decimals = 1e5;
    angle = Utils.toRadians(angle);
    return {
      x: Math.round(speed * Math.sin(angle) * decimals) / decimals,
      y: Math.round(speed * -Math.cos(angle) * decimals) / decimals,
    };
  }
  static toRadians(angle) {
    return angle * (Math.PI / 180);
  }
  static posToTLScreenCoords(playerPos, pos, screenCenterPos, tileSize, { x, y }) {
    return {
      x: screenCenterPos.x + (pos.x - playerPos.x) * tileSize - x * 0.5,
      y: screenCenterPos.y + (pos.y - playerPos.y) * tileSize - y * 0.5,
    };
  }
  static posToMiddleScreenCoords(playerPos, pos, screenCenterPos, tileSize) {
    return {
      x: screenCenterPos.x + (pos.x - playerPos.x) * tileSize,
      y: screenCenterPos.y + (pos.y - playerPos.y) * tileSize,
    };
  }
  /**
   * @param {CanvasRenderingContext2D} ctx
   * @param {object} styles
   * @param {number} styles.fontsize
   * @param {CanvasTextAlign} [styles.align]
   * @param {CanvasTextBaseline} [styles.baseline]
   * @param {string} [styles.font]
   * @param {string} [styles.color]
   * @param {boolean} [styles.bold]
   */
  static setTextStyle(ctx, { fontsize, align, baseline, font, color, bold }) {
    align = align ? align : "left";
    baseline = baseline ? baseline : "alphabetic";
    font = font ? font : "Roboto";
    color = color ? color : "black";

    ctx.textAlign = align;
    ctx.textBaseline = baseline;
    ctx.fillStyle = color;
    ctx.font = `${bold ? "bold " : ""}${fontsize}px ${font}`;
  }
}
