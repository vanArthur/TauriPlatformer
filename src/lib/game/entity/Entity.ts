import { drawShape } from "../helperFunctions/canvas.js";
import { Vec2 } from "../helperFunctions/vector.js";
import { Line, Shape } from "../helperFunctions/shapes.js";
import { distBetweenPoints } from "../helperFunctions/math.js";
import { Game } from "../Game.js";

export default class Entity {
  pos: Vec2;
  vel: Vec2 = new Vec2();
  acc: Vec2 = new Vec2();
  grounded: boolean = false;
  id: string;
  gravity: number = 9.81;
  collider: any = undefined;
  friction: number = 7;
  shapes: any;
  noOverlap: boolean;
  colliders: { [id: string]: Entity } = {};
  game: Game;

  constructor(
    id: string,
    pos: Vec2,
    shape: Shape | Shape[],
    noOverLap: boolean,
    game: Game
  ) {
    this.game = game;
    this.pos = new Vec2(pos.x, pos.y);
    this.id = id;
    this.noOverlap = noOverLap;
    if (Array.isArray(shape)) {
      this.shapes = shape;
    } else {
      this.shapes = [shape];
    }
  }

  setCollider(shape: any) {
    this.collider = shape;
  }
  setOverLap(bool: boolean) {
    this.noOverlap = bool;
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
    const entities = this.game.entities;

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
    this.acc.y = 0;

    let col;
    if (entities != undefined) {
      col = this.rectangleCollision(entities);
    }
    if (Object.keys(this.colliders).length > 0) {
      for (let entity in this.colliders) {
        this.pos.add(this.colliders[entity].vel);
      }
    }

    this.pos.add(this.vel);
    if (col) {
      if (col.vcol) this.vel.y = 0;
      if (col.hcol) this.vel.x = 0;
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

  rectangleCollision(rects: { [id: string]: Entity }): {
    [id: string]: boolean;
  } {
    let vcol = false;
    let hcol = false;
    let currentColliders: { [id: string]: Entity } = {};
    for (var i in rects) {
      let hColEntity;
      let vColEntity;
      let rect: any = rects[i].getCollider();
      if (rect == undefined) continue;

      //hor collision
      if (
        !(
          Math.abs(this.getCenterY() - (rect.pos.y * 2 + rect.height) / 2) >
          this.shapes[0].height / 2 + rect.height / 2
        )
      ) {
        hColEntity = rects[i];
        if (rects[i].noOverlap) {
          hcol = this.stopH(rect, hcol);
        }
      }
      // vert collision
      if (
        !(
          Math.abs(this.getCenterX() - (rect.pos.x * 2 + rect.width) / 2) >
          this.shapes[0].width / 2 + rect.width / 2
        )
      ) {
        vColEntity = rects[i];
        if (rects[i].noOverlap) {
          vcol = this.stopV(rect, vcol);
        }
      }
      if (hColEntity != undefined && hColEntity == vColEntity) {
        if (vColEntity != this) currentColliders[vColEntity.id] = vColEntity;
      }
    }
    this.colliders = currentColliders;
    return { vcol: vcol, hcol: hcol };
  }
  private stopH(rect: any, hcol: boolean) {
    if (this.vel.x >= 0) {
      let xdist = distBetweenPoints(0, this.getRight(), 0, rect.pos.x);
      if (this.vel.x > xdist) {
        this.vel.x = xdist - 0.1;
        hcol = true;
      }
    } else if (this.vel.x < 0) {
      let xdist = distBetweenPoints(
        0,
        this.getLeft(),
        0,
        rect.pos.x + rect.width
      );
      if (-this.vel.x > xdist) {
        this.vel.x = -xdist + 0.1;
        hcol = true;
      }
    }
    return hcol;
  }

  private stopV(rect: any, vcol: boolean) {
    if (this.vel.y >= 0) {
      let ydist = distBetweenPoints(0, this.getBottom(), 0, rect.pos.y);
      if (this.vel.y > ydist) {
        this.vel.y = ydist;
        this.grounded = true;
        vcol = true;
      }
    } else if (this.vel.y < 0) {
      let ydist = distBetweenPoints(
        0,
        this.getTop(),
        0,
        rect.pos.y + rect.height
      );
      if (-this.vel.y > ydist) {
        this.vel.y = -ydist;
        vcol = true;
      }
    }
    return vcol;
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
