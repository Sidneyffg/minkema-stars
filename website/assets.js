class Assets {
  static async init() {
    return new Promise(async (resolve, reject) => {
      const fileNames = await Assets.getAssetsData();
      await Assets.loadAllAssets(fileNames);
      console.log(Assets.assets);
      resolve();
    });
  }
  static async getAssetsData() {
    let data = await fetch(Assets.assetsDatapath);
    data = await data.json();
    return data;
  }

  static loadAllAssets(fileNames) {
    return new Promise(async (resolve, reject) => {
      let completed = 0;
      fileNames.forEach(async (fileName) => {
        const asset = await Assets.loadAsset(`${Assets.assetsPath}/${fileName}`);
        Assets.assets[fileName.slice(0, -4)] = asset;
        completed++;

        if (completed == fileNames.length) resolve();
      });
    });
  }

  static loadAsset(path) {
    return new Promise(async (resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve(img);
      };
      img.src = path;
    });
  }

  static assets = {};
  static assetsPath = "./assets";
  static assetsDatapath = `${Assets.assetsPath}/data.json`;
}
