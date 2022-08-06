import { drawShape } from "../helperFunctions/canvas.js";
import { Vec2 } from "../helperFunctions/vector.js";
import { Line, Shape } from "../helperFunctions/shapes.js";
import { distBetweenPoints } from "../helperFunctions/math.js";
import { Game } from "../Game.js";

export default class Entity {
  type: string = "Entity";
  zIndex: number = 1;
  pos: Vec2;
  vel: Vec2 = new Vec2();
  acc: Vec2 = new Vec2();
  grounded: boolean = false;
  id: string;
  gravity: number = 9.81;
  collider: any = undefined;
  friction: number = 7;
  shapes: any;
  passThrough: boolean;
  colliders: { [id: string]: Entity } = {};
  game: Game;
  deadly: boolean = false;
  damage: number = 10;
  props: any;

  constructor(
    id: string,
    type: string,
    pos: Vec2,
    shape: Shape | Shape[],
    passThrough: boolean,
    game: Game,
    zIndex?: number
  ) {
    this.game = game;
    this.pos = new Vec2(pos.x, pos.y);
    this.id = id;
    this.type = type;
    this.passThrough = passThrough;
    this.zIndex = typeof zIndex === "undefined" ? 1 : zIndex;
    if (Array.isArray(shape)) {
      this.shapes = shape;
    } else {
      this.shapes = [shape];
    }
  }

  setCollider(shape: any) {
    this.collider = shape;
  }
  setPassThrough(bool: boolean) {
    this.passThrough = bool;
  }

  getCollider(): any {
    if (this.collider != undefined) {
      this.collider.pos = this.pos;
      return this.collider;
    }
    return undefined;
  }

  isCollidingWith(id: string) {
    return this.colliders[id] != undefined ? this.colliders[id] : undefined;
  }

  update() {}

  move(): void {
    const deltaTime = this.game.deltaTime;

    const wasleft = this.vel.x < 0;
    const wasright = this.vel.x > 0;

    this.vel.y += this.gravity * deltaTime;
    if (this.vel.x > 0) {
      this.vel.x -= this.friction * deltaTime * this.vel.x;
    } else if (this.vel.x < 0) {
      this.vel.x -= this.friction * deltaTime * this.vel.x;
    }

    if ((wasleft && this.vel.x > 0) || (wasright && this.vel.x < 0)) {
      this.vel.x = 0; // clamp at zero to prevent friction from making us jiggle side to side
    }

    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.y = 0;

    this.rectangleCollision();

    if (Object.keys(this.colliders).length > 0) {
      for (let entity in this.colliders) {
        this.pos.add(this.colliders[entity].vel);
      }
    }
  }

  setVel(vel: Vec2) {
    this.vel = vel;
  }

  render(ctx: CanvasRenderingContext2D) {
    this.shapes.forEach((shape: Shape) => {
      drawShape(ctx, this.pos, shape);
    });
  }

  reset() {
    this.pos = new Vec2(0, 0);
    this.vel = new Vec2(0, 0);
  }

  //check for collision with all entities and save the colliding entity

  rectangleCollision() {
    this.colliders = {};
    const entities = this.game.entities;
    const rect1 = this;
    if (rect1 == undefined) {
      return false;
    }
    let col = false;

    for (let entity in entities) {
      if (entity != this.id) {
        const rect2 = entities[entity];
        if (rect2 != undefined) {
          const collision = this.rectangleCollisionWith(entities[entity]);
          if (collision) {
            this.colliders[entity] = entities[entity];
            col = true;

            //if moving right
            if (this.vel.x > 0) {
              //check distance between right side of rect1 and left side of rect2
              const distance = distBetweenPoints(
                this.getRight(),
                0,
                rect2.getLeft(),
                0
              );
              //if distance is less than the velocity of the entity
              if (distance < this.vel.x) {
                this.pos.x -= distance + 0.2;
                this.vel.x *= -1 * 0.1;
              }
            }
            //if moving left
            else if (this.vel.x < 0) {
              //check distance between left side of rect1 and right side of rect2
              const distance = distBetweenPoints(
                this.getLeft(),
                0,
                rect2.getRight(),
                0
              );
              //if distance is less than the velocity of the entity
              if (distance < Math.abs(this.vel.x)) {
                this.pos.x += distance + 0.2;
                this.vel.x *= -1 * 0.1;
              }
            }
            //if moving down
            if (this.vel.y > 0) {
              //check distance between bottom of rect1 and top of rect2
              const distance = distBetweenPoints(
                this.getBottom(),
                0,
                rect2.getTop(),
                0
              );
              //if distance is less than the velocity of the entity
              if (distance < this.vel.y) {
                this.pos.y -= distance + 0.2;
                this.vel.y = 0;
                this.acc.y = 0;
                this.grounded = true;
              }
            }
            //if moving up
            else if (this.vel.y < 0) {
              //check distance between top of rect1 and bottom of rect2
              const distance = distBetweenPoints(
                this.getTop(),
                0,
                rect2.getBottom(),
                0
              );
              //if distance is less than the velocity of the entity
              if (distance < Math.abs(this.vel.y)) {
                this.pos.y += distance;
                this.vel.y = 0;
                this.acc.y = 0;
              }
            }
          }
        }
      }
    }
    return col;
  }

  rectangleCollisionWith(rect: Entity) {
    const rect1 = this;
    const rect2 = rect;
    if (rect1 == undefined || rect2 == undefined) {
      return false;
    }
    return (
      rect1.getLeft() < rect2.getRight() &&
      rect1.getRight() > rect2.getLeft() &&
      rect1.getTop() < rect2.getBottom() &&
      rect1.getBottom() > rect2.getTop()
    );
  }

  getLeft(): number {
    return this.pos.x;
  }
  getRight(): number {
    return this.pos.x + this.shapes[0].width;
  }
  getTop(): number {
    return this.pos.y;
  }
  getBottom(): number {
    return this.pos.y + this.shapes[0].height;
  }
  getTopLeft(): Vec2 {
    return new Vec2(this.getLeft(), this.getTop());
  }
  getTopRight(): Vec2 {
    return new Vec2(this.getRight(), this.getTop());
  }
  getBottomLeft(): Vec2 {
    return new Vec2(this.getLeft(), this.getBottom());
  }
  getBottomRight(): Vec2 {
    return new Vec2(this.getRight(), this.getBottom());
  }

  getTopSide(): Line {
    const line = new Line(0, 0, 0, 0, "red");
    line.set(this.getTopRight(), this.getTopRight());
    return line;
  }
  getLeftSide(): Line {
    const line = new Line(0, 0, 0, 0, "red");
    line.set(this.getTopLeft(), this.getBottomLeft());
    return line;
  }
  getRightSide(): Line {
    const line = new Line(0, 0, 0, 0, "red");
    line.set(this.getTopRight(), this.getBottomRight());
    return line;
  }
  getBottomSide(): Line {
    const line = new Line(0, 0, 0, 0, "red");
    line.set(this.getBottomLeft(), this.getBottomRight());
    return line;
  }

  getCenterX(): number {
    return (this.getLeft() + this.getRight()) / 2;
  }
  getCenterY(): number {
    return (this.getTop() + this.getBottom()) / 2;
  }
}
