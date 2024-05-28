class Renderer {
  async init() {
    this.keyHandler = new KeyHandler();
    this.assetsHandler = new AssetsHandler();
    await this.assetsHandler.init();

    this.tileRenderer = new TileRenderer(this, this.assetsHandler);

    this.windowResize();
    window.onresize = () => {
      this.windowResize();
    };
    this.pos = { x: 0, y: 0 };
    this.renderFrame();
  }

  renderFrame() {
    requestAnimationFrame(() => {
      this.renderFrame();
    });
    this.clearCanvas();
    if (this.keyHandler.heldDownKeys.includes("w")) this.pos.y -= 0.1;
    if (this.keyHandler.heldDownKeys.includes("s")) this.pos.y += 0.1;
    if (this.keyHandler.heldDownKeys.includes("a")) this.pos.x -= 0.1;
    if (this.keyHandler.heldDownKeys.includes("d")) this.pos.x += 0.1;
    this.tileRenderer.render(this.pos, [
      [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ]);
    this.context.fillRect(
      this.canvas.width / 2 - 5,
      this.canvas.height / 2 - 5,
      10,
      10
    );
  }

  clearCanvas() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  windowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.resizeCallbacks.forEach((e) => e(width, height));
    this.canvas.width = width;
    this.canvas.height = height;
  }

  onResize(callback) {
    this.resizeCallbacks.push(callback);
  }
  resizeCallbacks = [];

  renderers;
  canvas = document.querySelector("canvas");
  context = this.canvas.getContext("2d");
}

const renderer = new Renderer();
renderer.init();
