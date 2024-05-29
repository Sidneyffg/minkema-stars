class Renderer {
  async init() {
    this.socket = io();
    this.initConnection();
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

  getUid() {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].split("=");
      if (cookie[0] == "uid") return cookie[1];
    }
  }

  initConnection() {
    this.uid = this.getUid();
    if (!this.uid) window.location.href += "/login";
    this.socket.emit("init", {
      uid: this.uid,
    });
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
