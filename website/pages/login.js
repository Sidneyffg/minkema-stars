export default class LoginPage {
  constructor(renderer) {
    this.renderer = renderer;

    this.appendHtml();
    this.loadElements();

    this.elems["open-signup"].addEventListener("click", () => {
      this.switchPage();
    });
    this.elems["open-login"].addEventListener("click", () => {
      this.switchPage();
    });

    this.elems["login-btn"].addEventListener("click", () => []);
  }

  loadElements() {
    const gbId = (id) => {
      return document.getElementById(`${this.pageId}-${id}`);
    };
    [
      "login-username",
      "login-password",
      "login-btn",
      "open-signup",
      "signup-username",
      "signup-password",
      "signup-password-repeat",
      "signup-btn",
      "open-login",
      "login-page",
      "signup-page",
    ].forEach((id) => {
      this.elems[id] = gbId(id);
    });
  }

  switchPage() {
    if (this.loginPageSelected) {
      this.elems["login-page"].classList.remove("active");
      this.elems["signup-page"].classList.add("active");
    } else {
      this.elems["login-page"].classList.add("active");
      this.elems["signup-page"].classList.remove("active");
    }
    this.loginPageSelected = !this.loginPageSelected;
  }

  load() {
    this.page.classList.add("active");
  }

  unload() {
    this.page.classList.remove("active");
  }

  appendHtml() {
    document.querySelector("main").innerHTML += this.html;
    this.page = document.getElementById(this.pageId);
  }

  html = /* html */ `
  <div id="page-login">
    <div class="login active" id="page-login-login-page">
      <h2>Login</h2>
      <label for="page-login-login-username">Username</label>
      <input type="text" id="page-login-login-username">
      <label for="page-login-login-password">Password</label>
      <input type="password" id="page-login-login-password">
      <button id="page-login-login-btn">Login</button>
      <div>
        <p>Don't have an account?</p>
        <p id="page-login-open-signup"><b>Sing up</b></p>
      </div>
    </div>
    <div class="signup" id="page-login-signup-page">
      <h2>Sign up</h2>
      <label for="page-login-signup-username">Username</label>
      <input type="text" id="page-login-signup-username" autocomplete="off">
      <label for="page-login-signup-password">Password</label>
      <input type="password" id="page-login-signup-password">
      <label for="page-login-signup-password-repeat">Repeat password</label>
      <input type="password" id="page-login-signup-password-repeat">
      <button id="page-login-signup-btn">Sign up</button>
      <div>
        <p>Already have an account?</p>
        <p id="page-login-open-login"><b>Log in</b></p>
      </div>
    </div>
  </div>`;

  /**
   * @type {import("../index.js").Renderer}
   */
  renderer;
  /**
   * @type {{[x:string]:Element}}
   */
  elems = {};
  pageName = "login";
  pageId = `page-${this.pageName}`;
  loginPageSelected = true;
}
