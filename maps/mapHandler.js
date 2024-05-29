import fs from "fs";
import { v4 as uuid } from "uuid";

export default class MapHandler {
  static init() {
    MapHandler.loadMaps();
  }

  static getMap(id) {
    return MapHandler.maps[id];
  }

  static editMap(id, newMap) {
    MapHandler.maps[id] = newMap;
    MapHandler.saveMaps();
  }

  static newMap(map) {
    const id = uuid();
    MapHandler.maps[id] = map;
    MapHandler.saveMaps();
    return id;
  }

  static deleteMap(id) {
    delete MapHandler.maps[id];
    MapHandler.saveMaps();
  }

  static loadMaps() {
    const data = fs.readFileSync(MapHandler.dataPath);
    MapHandler.maps = JSON.parse(data);
  }

  static async saveMaps() {
    const data = JSON.stringify(MapHandler.maps);
    fs.writeFileSync(MapHandler.dataPath, data);
  }

  static maps;
  static folderPath = `${process.cwd()}/maps`;
  static dataPath = `${MapHandler.folderPath}/maps.json`;
}
