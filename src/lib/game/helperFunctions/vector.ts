export class Vec2 {
  x: number = 0;
  y: number = 0;
  constructor(x?: number, y?: number) {
    this.set(x == undefined ? 0 : x, y == undefined ? 0 : y);
  }

  set(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  add(vec2: Vec2): Vec2 {
    this.x += vec2.x;
    this.y += vec2.y;
    return this;
  }
  subtract(vec2: Vec2) {
    this.x -= vec2.x;
    this.y -= vec2.y;
  }
  multiply(vec2: Vec2) {
    this.x *= vec2.x;
    this.y *= vec2.y;
  }
  multiplyConst(c: number) {
    this.x *= c;
    this.y *= c;
  }

  mag(): number {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  normalize(): Vec2 {
    const magn = this.mag();
    this.x /= magn;
    this.y /= magn;
    return new Vec2(this.x, this.y);
  }

  fromAngle(angle: number, length: number): Vec2 {
    if (length === undefined) {
      length = 1;
    }
    return new Vec2(length * Math.cos(angle), length * Math.sin(angle));
  }

  toAngle() {
    Math.atan2(this.y, this.x);
  }

  distance(vector: Vec2): number {
    return Math.sqrt((vector.x - this.x) ** 2 + (vector.y - this.y) ** 2);
  }

  copy(): Vec2 {
    return new Vec2(this.x, this.y);
  }

  round(): Vec2 {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    return this;
  }

  left(): Vec2 {
    this.x = -1;
    this.y = 0;
    return this;
  }

  right(): Vec2 {
    this.x = 1;
    this.y = 0;
    return this;
  }

  up(): Vec2 {
    this.x = 0;
    this.y = -1;
    return this;
  }

  down(): Vec2 {
    this.x = 0;
    this.y = 1;
    return this;
  }

  length(): number {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }
}
