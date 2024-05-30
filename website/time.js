export default class Time {
  static nextFrame() {
    const time = Date.now();
    Time.deltaTime = time - Time.lastTime;
    Time.lastTime = time;
  }

  static lastTime = Date.now();
  static deltaTime = 0;
}
