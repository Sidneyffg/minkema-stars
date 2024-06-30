import Vec2 from "./vec2.js";

export default class Utils {
  /**
   * @param {number} num 
   * @returns {number}
   */
  static getFractionFromWhole(num) {
    return num - Math.round(num);
  }
  /**
   * @param {number} angle 
   * @param {number} speed 
   * @returns {Vec2}
   */
  static angleToCoords(angle, speed) {
    const decimals = 1e5;
    angle = Utils.toRadians(angle);
    const x = Math.round(speed * Math.sin(angle) * decimals) / decimals;
    const y = Math.round(speed * -Math.cos(angle) * decimals) / decimals;
    return new Vec2({ x, y });
  }
  /**
   * @param {number} angle 
   * @returns {number}
   */
  static toRadians(angle) {
    return angle * (Math.PI / 180);
  }
  /**
   * @param {Vec2} playerPos
   * @param {Vec2} pos
   * @param {Vec2} screenCenterPos
   * @param {number} tileSize
   * @param {Vec2} size
   * @returns {Vec2}
   */
  static posToTLScreenCoords(playerPos, pos, screenCenterPos, tileSize, size) {
    const middle = Utils.posToMiddleScreenCoords(playerPos, pos, screenCenterPos, tileSize);
    return middle.sub(size.mult(0.5));
  }
  /**
   *
   * @param {Vec2} playerPos
   * @param {Vec2} pos
   * @param {Vec2} screenCenterPos
   * @param {number} tileSize
   * @returns {Vec2}
   */
  static posToMiddleScreenCoords(playerPos, pos, screenCenterPos, tileSize) {
    return new Vec2(pos).sub(playerPos).mult(tileSize).add(screenCenterPos);
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
