import { drawShape } from "../helperFunctions/canvas.js";
import { Vec2 } from "../helperFunctions/vector.js";
import {
  cubeCollision,
  CubeRayCollisionLeft,
  CubeRayCollisionRight,
} from "../helperFunctions/collision.js";
import { Line, Shape } from "../helperFunctions/shapes.js";
import { Platform } from "./Platform.js";
import { exit } from "@tauri-apps/api/process";
import { distBetweenPoints } from "../helperFunctions/math.js";
import { platform } from "@tauri-apps/api/os";

export default class Entity {
  pos: Vec2;
  vel: Vec2;
  acc: Vec2;
  grounded: boolean;
  id: string;
  gravity: number;
  collider: any;
  friction: number;
  shapes: any;
  maxLeft: number;
  minRight: number;
  constructor(id: string, pos: Vec2, shape: Shape | Shape[]) {
    this.pos = new Vec2(pos.x, pos.y);
    this.vel = new Vec2();
    this.acc = new Vec2();
    this.grounded = false;
    this.id = id;
    this.gravity = 9.81;
    this.collider = undefined;
    this.friction = 7;
    this.maxLeft = 0;
    this.minRight = 1000000000;
    if (Array.isArray(shape)) {
      this.shapes = shape;
    } else {
      this.shapes = [shape];
    }
  }

  setCollider(shape: Shape) {
    this.collider = shape;
  }

  getCollider(): Shape {
    this.collider.pos = this.pos;
    return this.collider;
  }

  move(deltaTime: number, colliders: any): void {
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
    if (colliders != undefined) {
      col = this.rectangleCollision(colliders);
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

  rectangleCollision(rects: { [id: string]: any }): { [id: string]: boolean } {
    let vcol = false;
    let hcol = false;
    for (var i in rects) {
      let rect: any = rects[i].getCollider();

      //hor collision
      if (
        !(
          Math.abs(this.getCenterY() - (rect.pos.y * 2 + rect.height) / 2) >
          this.shapes[0].height / 2 + rect.height / 2
        )
      ) {
        if (this.vel.x >= 0) {
          let xdist = distBetweenPoints(0, this.getRight(), 0, rect.pos.x);
          if (this.vel.x > xdist) {
            this.vel.x = xdist;
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
            this.vel.x = -xdist;
            hcol = true;
          }
        }
      }
      // vert collision
      if (
        !(
          Math.abs(this.getCenterX() - (rect.pos.x * 2 + rect.width) / 2) >
          this.shapes[0].width / 2 + rect.width / 2
        )
      ) {
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
      }
    }
    return { vcol: vcol, hcol: hcol };
  }
  rectangleCollisionOld(rects: { [id: string]: Platform }) {
    for (var i in rects) {
      const rect: any = rects[i].getCollider();

      if (this.vel.x < 0) {
        this.maxLeft = CubeRayCollisionLeft(this, [rects[i].getRightSide()]);
      } else if (this.vel.x > 0) {
        this.minRight = CubeRayCollisionRight(this, [rects[i].getRightSide()]);
      }

      //vert collision
      let vert = () => {
        return cubeCollision(
          this.pos.copy().add(new Vec2(0, this.vel.y / 4)),
          this.shapes[0].width,
          this.shapes[0].height,
          rect.pos,
          rect.width,
          rect.height
        );
      };
      let res = vert();

      if (this.vel.y > 0 && res) {
        while (vert()) {
          this.pos.y -= 0.1;
        }
        this.grounded = true;
        this.vel.y = 0;
      } else if (this.vel.y < 0 && res) {
        while (vert()) {
          this.pos.y += 0.1;
        }
        this.vel.y = 0;
      }
    }
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
