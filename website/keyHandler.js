class KeyHandler {
  static init() {
    KeyHandler.listenKeyDown();
    KeyHandler.listenKeyUp();
  }
  static listenKeyDown() {
    window.addEventListener("keydown", (e) => {
      if (KeyHandler.heldDownKeys.includes(e.key)) return;
      KeyHandler.heldDownKeys.push(e.key);
    });
  }
  static listenKeyUp() {
    window.addEventListener("keyup", (e) => {
      if (!KeyHandler.heldDownKeys.includes(e.key)) return;
      const idx = KeyHandler.heldDownKeys.indexOf(e.key);
      KeyHandler.heldDownKeys.splice(idx, 1);
    });
  }
  static heldDownKeys = [];
}
