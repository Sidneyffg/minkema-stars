export default class MathcmakingHandler {
  constructor(gameRenderer) {
    this.gameRenderer = gameRenderer;
  }

  render() {
    const canvas = this.gameRenderer.canvas;
    const ctx = this.gameRenderer.ctx;
    ctx.fillStyle = "rgb(14, 76, 192)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "black";
    ctx.font = "bold 70px Roboto";

    const halfCanvasWidth = canvas.width * 0.5;
    ctx.fillText("Matchmaking...", halfCanvasWidth, 200, halfCanvasWidth);
    ctx.font = "20px Roboto";
    ctx.fillText(
      `${this.gameRenderer.data.players.length} of ${this.gameRenderer.data.totalPlayers}`,
      halfCanvasWidth,
      500
    );
  }

  /**
   * @type {import("./gameRenderer.js").default}
   */
  gameRenderer;
}
