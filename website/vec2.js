export default class Vec2 {
  /**
   * @param {{x:number,y:number}|Vec2|number} val
   */
  constructor(val) {
    this.set(val);
  }

  /**
   * @param {{x:number,y:number}|Vec2|number} vec
   */
  set(val) {
    if (typeof val == "number") {
      this.x = val;
      this.y = val;
    } else {
      this.x = val.x;
      this.y = val.y;
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
      }
      {
        this.x += vec.x;
        this.y += vec.y;
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
        this.x -= vec.x;
        this.y -= vec.y;
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
        this.x *= vec.x;
        this.y *= vec.y;
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
        this.x /= vec.x;
        this.y /= vec.y;
      }
    });
    return this;
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
