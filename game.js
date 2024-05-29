export default class Game {
  /**
   * @param {import("socket.io").Socket[]} users
   * @param {*} mapData
   */
  constructor(users, mapData) {
    this.users = users;
    this.mapData = mapData;
    users.forEach((user) => {
      user.socket.on("gameUpdate", (type, data) => {
        this.listeners[type].forEach((e) => e({ user, data }));
      });
    });

    this.on("posUpdate", ({ user, data }) => {
      this.emitToAllPlayers("posUpdate", { uid: user.uid, newPos: data });
    });
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
