import HomePage from "./pages/home.js";
import LoginPage from "./pages/login.js";

export default class MenuRenderer {
  constructor(renderer) {
    this.renderer = renderer;
    this.loadPages();
  }

  loadPages() {
    this.homePage = new HomePage(this.renderer);
    this.loginPage = new LoginPage(this.renderer, this);
  }

  loadPage(page) {
    if (this.loadedPage) this.loadedPage.unload();
    page.load();
    this.loadedPage = page;
  }

  activate() {
    if (this.active) return;
    this.active = true;
    if (this.renderer.loggedIn) {
      this.homePage.load();
      this.loadedPage = this.homePage;
    } else {
      this.loginPage.load();
      this.loadedPage = this.loginPage;
    }
  }

  deactivate() {
    if (!this.active) return;
    this.active = false;
    this.loadedPage.unload();
  }

  message(type, msg) {
    const btn_callBack = document.getElementById("message");
    btn_callBack.innerHTML = `<span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span>${msg}`;
    btn_callBack.style.display = `block`;
    btn_callBack.classList.add(`${type}`);
  }

  /**
   * @type {{[x:string]:Element}}
   */
  loadedPage = null;
  active = false;
  /**
   * @type {import("./index.js").Renderer}
   */
  renderer;
}
