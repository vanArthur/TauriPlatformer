import { Vec2 } from "../helperFunctions/vector.js";
import Entity from "./Entity.js";
import { Rectangle } from "../helperFunctions/shapes.js";
import { Controller } from "../Controller.js";
import { Platform } from "./Platform.js";

export class Player extends Entity {
  controller: Controller;
  jumping: boolean;
  speed: number;
  constructor(id: string, pos: Vec2, color: string, controller: Controller) {
    super(id, pos, new Rectangle(0, 0, 20, 50, color), true);
    this.controller = controller;
    this.jumping = false;
    this.speed = 50;
  }

  movement(deltaTime: number, entities: any) {
    let pressing = false;
    if (this.controller.isPressed("KeyA")) {
      pressing = true;
      this.acc.x = -this.speed * deltaTime;
    }
    if (this.controller.isPressed("KeyD")) {
      pressing = true;
      this.acc.x = this.speed * deltaTime;
    }
    if (!pressing) {
      this.acc.x = 0;
    }

    if (this.controller.isPressed("Space")) {
      if (this.grounded) {
        this.acc.y -= this.speed * 6 * deltaTime;
        this.grounded = false;
      }
    }

    this.move(deltaTime, entities);
  }
}
