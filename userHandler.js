import Game from "./game.js";
import MapHandler from "./maps/mapHandler.js";

export default class UserHandler {
  static newConnection(socket) {
    socket.once("init", (data) => {
      const user = {
        socket,
        ...data,
      };
      UserHandler.users.push(user);

      socket.on("joinGame", (id) => {
        const game = UserHandler.getGame(id);
        if (!game)
          return UserHandler.newGame(
            [user],
            "7f72356e-fe32-488c-8c7a-6bda7f10383f",
            id
          );

        game.addUser(user);
      });
    });
    socket.once("disconnect", () => {});
  }

  static newGame(users, mapId, id) {
    const map = MapHandler.getMap(mapId);
    const game = new Game(users, map, id);
    this.games.push(game);
    return game;
  }

  static getGame(id) {
    return UserHandler.games.find((e) => e.id == id);
  }

  static removeUser(user) {}

  static users = [];
  /**
   * @type {Game[]}
   */
  static games = [];
}
