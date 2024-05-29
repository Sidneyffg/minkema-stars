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
      const map = MapHandler.getMap("7f72356e-fe32-488c-8c7a-6bda7f10383f");
      UserHandler.games.push(new Game([user], map));
    });
    socket.once("disconnect", () => {});
  }

  removeUser(user) {}

  static users = [];
  static games = [];
}
