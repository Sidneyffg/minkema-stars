import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";

export default class Player {
  constructor(newPlayer, data) {
    this.online = false;
    this.socket = null;

    if (newPlayer) return this.#initPlayerData(data);
    this.publicData = data.publicData;
    this.privateData = data.privateData;
    this.serverData = data.serverData;
  }

  #initPlayerData(data) {
    this.publicData = {
      username: data.username,
      uid: genNewUid(),
    };
    this.privateData = {
      token: uuid(),
    };
    this.serverData = {
      password: bcrypt.hashSync(data.password, 10),
    };
  }

  comparePassword(password) {
    if (typeof password != "string") return false;
    return !!bcrypt.compareSync(password, this.serverData.password);
  }

  compareToken(token) {
    if (token.length !== this.privateData.token.length) return false;

    let isEqual = true;
    for (let i = 0; i < token.length; i++) if (token.charAt(i) != this.privateData.token.charAt(i)) isEqual = false;

    return isEqual;
  }

  turnOnline(socket) {
    this.online = true;
    this.socket = socket;
    console.log(`Player ${this.publicData.uid} (${this.publicData.username}) is now online`);
  }

  turnOffline() {
    this.online = false;
    this.socket = null;
    this.#offlineListeners.forEach(({ cb }) => {
      cb();
    });
    this.#offlineListeners = [];
    console.log(`Player ${this.publicData.uid} (${this.publicData.username}) is now offline`);
  }

  /**
   * @callback emptyCallback
   */
  /**
   * @param {emptyCallback} cb
   * @returns {string} id
   */
  addOfflineListener(cb) {
    const id = uuid();
    this.#offlineListeners.push({ cb, id });
    return id;
  }

  /**
   * @param {string} id
   */
  removeOfflineListener(id) {
    const listener = this.#offlineListeners.find((e) => e.id == id);
    if (!listener) return console.log("Tried removeing nonexistent offline listner...");
    const idx = this.#offlineListeners.indexOf(listener);
    this.#offlineListeners.splice(idx, 1);
  }

  /**
   * @type {{cb:emptyCallback[],id:string}[]}
   */
  #offlineListeners = [];

  getJSON() {
    return {
      publicData: this.publicData,
      privateData: this.privateData,
      serverData: this.serverData,
    };
  }

  /**
   * @type {playerPublicData}
   */
  publicData;

  /**
   * @type {playerPrivateData}
   */
  privateData;

  /**
   * @type {playerServerData}
   */
  serverData;
  gameData;
  online = false;
  socket = null;
}

function genNewUid() {
  // every letter and number except O and 0
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNPQRSTUVWXYZ123456789";
  const uidLength = 6;

  let uid = "";
  for (let i = 0; i < uidLength; i++) uid += chars.charAt(Math.floor(Math.random() * chars.length));

  return uid;
}

/**
 * @typedef playerPublicData
 * @type {object}
 * @property {string} username
 * @property {string} uid
 */

/**
 * @typedef playerPrivateData
 * @type {object}
 * @property {string} token
 */

/**
 * @typedef playerServerData
 * @type {object}
 * @property {string} password
 */
