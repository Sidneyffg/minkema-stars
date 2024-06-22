export default class Utils {
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
  static posToTLScreenCoords(playerPos, pos, screenCenterPos, tileSize, w, h) {
    if (!h) h = w;
    return {
      x: screenCenterPos.x + (pos.x - playerPos.x) * tileSize - w * 0.5,
      y: screenCenterPos.y + (pos.y - playerPos.y) * tileSize - h * 0.5,
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
