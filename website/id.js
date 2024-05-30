export default class Id {
  static new() {
    let id = Math.floor(Math.random() * Id.totalPossible);
    id = id.toString(36);
    return id;
  }
  
  static chars = 7;
  static totalPossible = 36 ** Id.chars;
}
