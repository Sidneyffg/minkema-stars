import HomePage from "./pages/home.js";

export default class MenuRenderer {
  constructor(renderer) {
    this.renderer = renderer;
    this.loadPages();
  }

  loadPages() {
    const main = document.querySelector("main");
    this.homePage = new HomePage(this.renderer);
  }

  activate() {
    if (this.active) return;
    this.active = true;
    this.homePage.load();
    this.loadedPage = this.homePage;
  }

  deactivate() {
    if (!this.active) return;
    this.active = false;
    this.loadedPage.unload();
  }

  /**
   * @type {{[x:string]:Element}}
   */
  pages = {};
  loadedPage = null;
  active = false;
  /**
   * @type {import("./index.js").Renderer}
   */
  renderer;
}
