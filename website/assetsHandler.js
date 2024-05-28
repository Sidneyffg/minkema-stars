class AssetsHandler {
  async init() {
    return new Promise(async (resolve, reject) => {
      const fileNames = await this.getAssetsData();
      await this.loadAllAssets(fileNames);
      console.log(this.assets);
      resolve();
    });
  }
  async getAssetsData() {
    let data = await fetch(this.assetsDatapath);
    data = await data.json();
    return data;
  }

  loadAllAssets(fileNames) {
    return new Promise(async (resolve, reject) => {
      let completed = 0;
      fileNames.forEach(async (fileName) => {
        const asset = await this.loadAsset(`${this.assetsPath}/${fileName}`);
        this.assets[fileName.slice(0, -4)] = asset;
        completed++;

        if (completed == fileNames.length) resolve();
      });
    });
  }

  loadAsset(path) {
    return new Promise(async (resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve(img);
      };
      img.src = path;
    });
  }

  assets = {};
  assetsPath = "./assets";
  assetsDatapath = `${this.assetsPath}/data.json`;
}
