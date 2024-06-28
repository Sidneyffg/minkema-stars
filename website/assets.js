export default class Assets {
  static async init() {
    return new Promise(async (resolve, reject) => {
      const assets = await Assets.getAssetsData();
      await Assets.loadAllAssets(assets);
      console.log(Assets.assets);
      resolve();
    });
  }
  static async getAssetsData() {
    let data = await fetch(Assets.assetsDatapath);
    data = await data.json();
    return data;
  }

  static loadAllAssets(assets) {
    return new Promise(async (resolve, reject) => {
      const totalAssets = Assets.getTotalAssets(assets);
      let completed = 0;
      Object.keys(assets).forEach((key) => {
        Assets.assets[key] = [];
        assets[key].forEach(async (assetData) => {
          const asset = await Assets.loadAsset(`${Assets.assetsPath}/${assetData.fileName}`);

          Assets.assets[key].push({ asset, ...assetData });
          completed++;

          if (completed == totalAssets) resolve();
        });
      });
    });
  }

  static getTotalAssets(assets) {
    let totalAssets = 0;
    Object.keys(assets).forEach((key) => {
      totalAssets += Object.keys(assets[key]).length;
    });
    return totalAssets;
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
