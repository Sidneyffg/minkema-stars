export default class LoginPage {
  constructor(main, menuHandler) {
    this.main = main;
    this.menuHandler = menuHandler;

    this.appendHtml();
    this.loadElements();

    this.elems["open-signup"].addEventListener("click", () => {
      this.switchPage();
    });
    this.elems["open-login"].addEventListener("click", () => {
      this.switchPage();
    });

    this.elems["login-btn"].addEventListener("click", () => {
      const username = this.elems["login-username"].value;
      if (!this.#isValidUsername(username, { hasUid: true }))
        return this.menuHandler.message("error", "Invalid username");
      const password = this.elems["login-password"].value;
      if (!this.#isValidPassword(password)) return this.menuHandler.message("error", "Invalid password");
      this.main.socket.emit(
        "init",
        { type: "usernameLogin", username, password },
        ({ err, publicData, privateData }) => {
          if (err) return this.menuHandler.message("error", "Failed to log in");

          this.main.setToken(privateData.token);
          this.main.setUid(publicData.uid);
          this.menuHandler.loadPage(this.menuHandler.homePage);
        }
      );
    });

    this.elems["signup-btn"].addEventListener("click", () => {
      const username = this.elems["signup-username"].value;
      if (!this.#isValidUsername(username)) return this.menuHandler.message("error", "Invalid username");
      const password = this.elems["signup-password"].value;
      if (!this.#isValidPassword(password)) return this.menuHandler.message("error", "Invalid password");
      const passwordRepeat = this.elems["signup-password-repeat"].value;
      if (password !== passwordRepeat) return this.menuHandler.message("error", "Passwords do not match");

      this.main.socket.emit("init", { type: "signup", username, password }, ({ err, publicData, privateData }) => {
        if (err) return this.menuHandler.message("error", "Failed to log in");

        this.main.setToken(privateData.token);
        this.main.setUid(publicData.uid);
        this.menuHandler.loadPage(this.menuHandler.homePage);
      });
    });
  }

  /**
   * @param {string} username
   * @param {object} [options]
   * @param {boolean} [options.hasUid]
   * @returns {boolean}
   */
  #isValidUsername(username, options = {}) {
    if (options.hasUid) {
      const matches = username.match(/[a-zA-Z0-9]{3,15}#[a-zA-NP-Z1-9]{6}/);
      if (!matches || matches.length != 1 || matches[0] != username) return false;
      return true;
    }
    const matches = username.match(/[a-zA-Z0-9]{3,15}/);
    if (!matches || matches.length != 1 || matches[0] != username) return false;
    return true;
  }

  #isValidPassword(password) {
    const matches = password.match(/[a-zA-Z0-9.,]{8,30}/);
    if (!matches || matches.length != 1 || matches[0] != password) return false;
    return true;
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
    const div = document.createElement("DIV");
    div.innerHTML = this.html;
    div.id = this.pageId;
    document.querySelector("main").appendChild(div);
    this.page = document.getElementById(this.pageId);
  }

  html = /* html */ `
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
  `;

  /**
   * @type {import("../main.js").Main}
   */
  main;
  /**
   * @type {{[x:string]:Element}}
   */
  elems = {};
  pageName = "login";
  pageId = `page-${this.pageName}`;
  loginPageSelected = true;
}
