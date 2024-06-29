import HomePage from "./pages/home.js";
import LoginPage from "./pages/login.js";

export default class MenuHandler {
  constructor(main) {
    this.main = main;
    this.loadPages();
  }

  loadPages() {
    this.homePage = new HomePage(this.main);
    this.loginPage = new LoginPage(this.main, this);
  }

  loadPage(page) {
    if (this.loadedPage) this.loadedPage.unload();
    page.load();
    this.loadedPage = page;
  }

  activate() {
    if (this.active) return;
    this.active = true;
    if (this.main.loggedIn) {
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
   * @type {import("./main.js").Main}
   */
  main;
}
