class Renderer {
  async init() {
    this.assetsHandler = new AssetsHandler();
    await this.assetsHandler.init();

    // Renderers in order from bottom to top of screen
    this.tileRenderer = new TileRenderer(this, this.assetsHandler);

    this.windowResize();
    window.onresize = () => {
      this.windowResize();
    };

    this.renderFrame();
  }

  renderFrame() {
    requestAnimationFrame(() => {
      this.renderFrame();
    });
    this.clearCanvas();
    this.tileRenderer.render({ x: 0, y: 0 }, [
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
