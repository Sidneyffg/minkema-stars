import Utils from "./utils.js";

export default class MathcmakingHandler {
  constructor(gameHandler) {
    this.gameHandler = gameHandler;
  }

  render() {
    const canvas = this.gameHandler.canvas;
    const ctx = this.gameHandler.ctx;
    ctx.fillStyle = "rgb(14, 76, 192)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    Utils.setTextStyle(ctx, { fontsize: 70, align: "center", bold: true });

    const halfCanvasWidth = canvas.width * 0.5;
    ctx.fillText("Matchmaking...", halfCanvasWidth, 200, halfCanvasWidth);

    Utils.setTextStyle(ctx, { fontsize: 20, align: "center" });
    ctx.fillText(
      `${this.gameHandler.data.players.length} of ${this.gameHandler.data.totalPlayers}`,
      halfCanvasWidth,
      500
    );
  }

  /**
   * @type {import("./gameHandler.js").default}
   */
  gameHandler;
}
