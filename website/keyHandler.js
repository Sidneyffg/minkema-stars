class KeyHandler {
  constructor() {
    this.listenKeyDown();
    this.listenKeyUp();
  }
  listenKeyDown() {
    window.addEventListener("keydown", (e) => {
      if (this.heldDownKeys.includes(e.key)) return;
      this.heldDownKeys.push(e.key);
    });
  }
  listenKeyUp() {
    window.addEventListener("keyup", (e) => {
      if (!this.heldDownKeys.includes(e.key)) return;
      const idx = this.heldDownKeys.indexOf(e.key);
      this.heldDownKeys.splice(idx, 1);
    });
  }
  heldDownKeys = [];
}
