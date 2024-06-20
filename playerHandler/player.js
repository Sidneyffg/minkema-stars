import { v4 as uuid } from "uuid";

import bcrypt from "bcrypt";

export default class Player {
  constructor(data) {
    this.online = false;
    this.socket = null;
    if (!data.uid) {
      return this.#initPlayerData(data);
    }
    this.token = data.token;
    this.uid = data.uid;
    this.username = data.username;
    this.password = data.password;
  }

  #initPlayerData(data) {
    this.username = data.username;
    this.uid = genNewUid();
    this.token = uuid();
    this.password = bcrypt.hashSync(data.password, 10);
  }

  comparePassword(password) {
    if (typeof password != "string") return false;
    return !!bcrypt.compareSync(password, this.password);
  }

  compareToken(token) {
    if (token.length !== this.token.length) return false;

    let isEqual = true;
    for (let i = 0; i < token.length; i++)
      if (token.charAt(i) != this.token.charAt(i)) isEqual = false;

    return isEqual;
  }

  turnOnline(socket) {
    this.online = true;
    this.socket = socket;
    console.log(`Player ${this.uid} is now online`);
  }

  turnOffline() {
    this.online = false;
    this.socket = null;
    this.#offlineListeners.forEach((e) => {
      e();
    });
    this.#offlineListeners = [];
    console.log(`Player ${this.uid} is now offline`);
  }

  /**
   * @callback emptyCallback
   */
  /**
   * @param {emptyCallback} cb
   */
  addOfflineListener(cb) {
    this.#offlineListeners.push(cb);
  }
  /**
   * @type {emptyCallback[]}
   */
  #offlineListeners = [];

  getJSON() {
    return {
      token: this.token,
      uid: this.uid,
      username: this.username,
      password: this.password,
    };
  }

  token;
  uid;
  username;
  password;
  online;
  socket;
}

function genNewUid() {
  // every letter and number except O and 0
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNPQRSTUVWXYZ123456789";
  const uidLength = 6;

  let uid = "";
  for (let i = 0; i < uidLength; i++)
    uid += chars.charAt(Math.floor(Math.random() * chars.length));

  return uid;
}
