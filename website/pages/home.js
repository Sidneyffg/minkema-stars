export default class HomePage {
  constructor(renderer) {
    this.renderer = renderer;
    const gbId = (id) => {
      return document.getElementById(id);
    };
    document.querySelector("main").innerHTML += this.html;
    this.page = gbId("page-home");
    this.gameidInp = gbId("page-home-gameid");

    gbId("page-home-play").addEventListener("click", () => {
      const gameid = this.gameidInp.value;
      if (!gameid) return;
      this.renderer.joinGame(gameid);
    });
  }

  load() {
    this.page.classList.add("active");
  }

  unload() {
    this.page.classList.remove("active");
  }

  html = /* html */ `
  <div id="page-home">
    <label for="gameid">Game id</label>
    <input id="page-home-gameid" type="text" name="gameid" />
    <button id="page-home-play">play</button>
  </div>`;

  /**
   * @type {import("../index.js").Renderer}
   */
  renderer;
}
