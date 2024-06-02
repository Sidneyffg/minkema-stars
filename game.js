export default class Game {
  /**
   * @param {import("socket.io").Socket[]} users
   * @param {*} mapData
   */
  constructor(users, mapData, id) {
    this.users = users;
    this.mapData = mapData;
    this.id = id;
    users.forEach((user) => {
      this.initUser(user);
    });

    this.on("posUpdate", ({ user, data }) => {
      user.pos.x += data.x;
      user.pos.y += data.y;
      this.emitToAllPlayers("posUpdate", { uid: user.uid, newPos: user.pos });
    });
  }

  initUser(user) {
    user.pos = { x: 3, y: 0 };
    user.socket.on("gameUpdate", (type, data) => {
      this.listeners[type].forEach((e) => e({ user, data }));
    });
    const gameData = {
      map: this.mapData,
      pos: user.pos,
    };
    user.socket.emit("joinGame", gameData);
  }

  addUser(user) {
    this.users.push(user);
    this.initUser(user);
  }

  emitToAllPlayers(type, data) {
    this.users.forEach((user) => {
      user.socket.emit("gameUpdate", type, data);
    });
  }

  on(type, callback) {
    if (this.listeners[type] == undefined) {
      this.listeners[type] = [];
    }
    this.listeners[type].push(callback);
  }
  listeners = {};
  mapData;
}