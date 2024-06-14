import HomePage from "./pages/home.js";
import LoginPage from "./pages/login.js";

export default class MenuRenderer {
  constructor(renderer) {
    this.renderer = renderer;
    this.loadPages();
  }

  loadPages() {
    this.homePage = new HomePage(this.renderer);
    this.loginPage = new LoginPage(this.renderer);
  }

  activate() {
    if (this.active) return;
    this.active = true;
    if (this.renderer.loggedIn) {
      this.homePage.load();
      this.loadedPage = this.homePage
    } else {
      this.loginPage.load();
      this.loadedPage = this.loginPage
    }

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
