export default class Vec2 {
  /**
   * @param {{x:number,y:number}|Vec2|number} val
   */
  constructor(val) {
    this.set(val);
  }

  /**
   * @param {Vec2|number} vec
   */
  set(vec) {
    if (typeof vec == "number") {
      this.x = vec;
      this.y = vec;
    } else {
      if (typeof vec.x == "number") this.x = vec.x;
      if (typeof vec.y == "number") this.y = vec.y;
    }
  }

  /**
   * @param  {...Vec2|number} vecs
   * @returns {Vec2} returns itself
   */
  add(...vecs) {
    vecs.forEach((vec) => {
      if (typeof vec == "number") {
        this.x += vec;
        this.y += vec;
      } else {
        if (typeof vec.x == "number") this.x += vec.x;
        if (typeof vec.y == "number") this.y += vec.y;
      }
    });
    return this;
  }

  /**
   * @param  {...Vec2|number} vecs
   * @returns {Vec2} returns itself
   */
  sub(...vecs) {
    vecs.forEach((vec) => {
      if (typeof vec == "number") {
        this.x -= vec;
        this.y -= vec;
      } else {
        if (typeof vec.x == "number") this.x -= vec.x;
        if (typeof vec.y == "number") this.y -= vec.y;
      }
    });
    return this;
  }

  /**
   * @param  {...Vec2|number} vecs
   * @returns {Vec2} returns itself
   */
  mult(...vecs) {
    vecs.forEach((vec) => {
      if (typeof vec == "number") {
        this.x *= vec;
        this.y *= vec;
      } else {
        if (typeof vec.x == "number") this.x *= vec.x;
        if (typeof vec.y == "number") this.y *= vec.y;
      }
    });
    return this;
  }

  /**
   * @param  {...Vec2|number} vecs
   * @returns {Vec2} returns itself
   */
  dev(...vecs) {
    vecs.forEach((vec) => {
      if (typeof vec == "number") {
        this.x /= vec;
        this.y /= vec;
      } else {
        if (typeof vec.x == "number") this.x /= vec.x;
        if (typeof vec.y == "number") this.y /= vec.y;
      }
    });
    return this;
  }

  /**
   * @param {Vec2|number} vec
   * @returns {boolean}
   */
  isEqualTo(vec) {
    if (typeof vec == "number") {
      return this.x == vec && this.y == vec;
    } else {
      return this.x == vec.x && this.y == vec.y;
    }
  }

  /**
   * @param {number} decimals
   * @returns {Vec2}
   */
  round(decimals) {
    const mult = 10 ** decimals;

    this.mult(mult);
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    this.dev(mult);
    return this;
  }

  /**
   * @returns {{x:number,y:number}}
   */
  toJSON() {
    return {
      x: this.x,
      y: this.y,
    };
  }

  /**
   * @type {number}
   */
  x;
  /**
   * @type {number}
   */
  y;
}
