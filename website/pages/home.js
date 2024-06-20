export default class HomePage {
  constructor(main) {
    this.main = main;

    this.appendHtml();
    this.loadElements();

    this.elems["play"].addEventListener("click", () => {
      const gameid = this.elems["gameid"].value;
      if (!gameid) return;
      this.main.joinGame(gameid);
    });
  }

  loadElements() {
    const gbId = (id) => {
      return document.getElementById(`${this.pageId}-${id}`);
    };
    ["gameid", "play"].forEach((id) => {
      this.elems[id] = gbId(id);
    });
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
    <label for="gameid">Game id</label>
    <input id="page-home-gameid" type="text" name="gameid" />
    <button id="page-home-play">play</button>
  `;

  /**
   * @type {import("../main.js").Main}
   */
  main;
  elems = {};
  pageName = "home";
  pageId = `page-${this.pageName}`;
}
