export default class MenuRenderer {
  constructor() {
    this.loadPages();
  }

  loadPages() {
    const pages = document.querySelectorAll("main > div");
    pages.forEach((page) => {
      let id = page.id;
      id = id.slice(this.pagePrefix.length);
      this.pages[id] = page;
    });
  }

  loadPage(name) {
    if (this.loadedPage) this.unloadPage();
    this.pages[name].classList.add("active");
  }

  unloadPage() {
    this.pages[this.loadedPage].classList.remove("active");
    this.loadedPage = null;
  }

  activate() {
    if (this.active) return;
    this.active = true;
    this.loadPage(this.stdPage);
  }

  deactivate() {
    if (!this.active) return;
    this.active = false;
    this.unloadPage();
  }

  pagePrefix = "page-";
  stdPage = "home";
  /**
   * @type {{[x:string]:Element}}
   */
  pages = {};
  loadedPage = null;
  active = false;
}

