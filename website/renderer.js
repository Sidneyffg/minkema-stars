class Renderer {
  async init() {
    const socket = io();
    KeyHandler.init();
    await Assets.init();

    this.gameRenderer = new GameRenderer(this);

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
    Time.nextFrame();
    this.clearCanvas();
    this.gameRenderer.render(this.ctx);
    this.ctx.fillRect(
      this.canvas.width / 2 - 5,
      this.canvas.height / 2 - 5,
      10,
      10
    );
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
  ctx = this.canvas.getContext("2d");
}

const renderer = new Renderer();
renderer.init();
