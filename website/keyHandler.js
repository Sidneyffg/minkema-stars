import Id from "./id.js";

export default class KeyHandler {
  static init() {
    KeyHandler.listenKeyDown();
    KeyHandler.listenKeyUp();
  }
  static listenKeyDown() {
    window.addEventListener("keydown", (e) => {
      if (!e.key) return;
      if (KeyHandler.heldDownKeys.includes(e.key)) return;
      KeyHandler.heldDownKeys.push(e.key);
      KeyHandler.callbacks.forEach(({ cb }) => cb(e.key));
    });
  }
  static listenKeyUp() {
    window.addEventListener("keyup", (e) => {
      if (!KeyHandler.heldDownKeys.includes(e.key)) return;
      const idx = KeyHandler.heldDownKeys.indexOf(e.key);
      KeyHandler.heldDownKeys.splice(idx, 1);
    });
  }

  /**
   * @callback onKeyPressCb
   * @param {string} key
   */
  /**
   * @param {onKeyPressCb} cb
   */

  static onKeyPress(cb) {
    const id = Id.new();
    KeyHandler.callbacks.push({ cb, id });
  }

  static removeListener(id) {
    const obj = KeyHandler.callbacks.find((e) => e.id == id);
    if (!obj) return;
    const idx = KeyHandler.indexOf(obj);
    KeyHandler.splice(idx, 1);
  }
  /**
   * @type {{cb:string,id:string}[]}
   */
  static callbacks = [];
  static heldDownKeys = [];
}
