export default class Game {
  /**
   * @param {import("socket.io").Socket[]} users
   * @param {*} mapData
   */
  constructor(users, mapData, id) {
    this.mapData = mapData;
    this.id = id;

    // doesnt work with multiple people joining at the same time
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

    this.users.forEach((e) => {
      e.socket.emit("gameUpdate", "newPlayer", {
        pos: user.pos,
        uid: user.uid,
      });
    });
    this.users.push(user);

    const gameData = {
      map: this.mapData,
      users: this.genUserData(),
    };
    user.socket.emit("joinGame", gameData);
  }

  genUserData() {
    const usersData = [];
    this.users.forEach((e) => {
      usersData.push({
        pos: e.pos,
        uid: e.uid,
      });
    });
    return usersData;
  }

  addUser(user) {
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
  users = [];
}
