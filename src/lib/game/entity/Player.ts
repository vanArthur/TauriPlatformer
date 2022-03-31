import { Vec2 } from "../helperFunctions/vector.js";
import Entity from "./Entity.js";
import { Rectangle } from "../helperFunctions/shapes.js";
import { Game } from "../Game.js";

export class Player extends Entity {
  jumping: boolean;
  speed: number;
  constructor(id: string, pos: Vec2, color: string, game: Game) {
    super(id, pos, new Rectangle(0, 0, 20, 50, color), true, game);
    this.jumping = false;
    this.speed = 50;
  }

  update() {
    this.movement();
    this.isCollidingWith("Flag") && this.game.LevelLoader.nextLevel();
  }

  movement() {
    let pressing = false;
    let game = this.game;
    if (game.controller.isPressed("KeyA")) {
      pressing = true;
      this.acc.x = -this.speed * game.deltaTime;
    }
    if (game.controller.isPressed("KeyD")) {
      pressing = true;
      this.acc.x = this.speed * game.deltaTime;
    }
    if (!pressing) {
      this.acc.x = 0;
    }

    if (game.controller.isPressed("Space")) {
      if (this.grounded) {
        this.acc.y -= this.speed * 6 * game.deltaTime;
        this.grounded = false;
      }
    }

    this.move();
  }
}
