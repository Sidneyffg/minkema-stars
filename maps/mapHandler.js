import fs from "fs";
import { v4 as uuid } from "uuid";

export default class MapHandler {
  static init() {
    MapHandler.loadTileData();
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

  static loadTileData() {
    const data = fs.readFileSync("./assets/data.json");
    this.tiles = JSON.parse(data).tiles;
  }

  static loadMaps() {
    const data = fs.readFileSync(MapHandler.dataPath);
    const maps = JSON.parse(data);

    Object.keys(maps).forEach((e) => {
      const tiles = maps[e].tiles;
      for (let i = 0; i < tiles.length; i++) {
        for (let j = 0; j < tiles[0].length; j++) {
          tiles[i][j] = this.tiles.find((e) => e.tileId == tiles[i][j]);
        }
      }
    });
    this.maps = maps;
  }

  static async saveMaps() {
    const data = JSON.stringify(MapHandler.maps);
    fs.writeFileSync(MapHandler.dataPath, data);
  }

  /**
   * @type {tile[]}
   */
  static tiles;
  /**
   * @type {map[]}
   */
  static maps;
  static folderPath = `${process.cwd()}/maps`;
  static dataPath = `${MapHandler.folderPath}/maps.json`;
}

/**
 * @typedef {object} tile
 * @property {string} tile.fileName
 * @property {number} tile.tileId
 * @property {bool} tile.hasCollision
 * @property {bool} [tile.undistructable]
 */

/**
 * @typedef {object} map
 * @property {tile[][]} map.tiles
 */
