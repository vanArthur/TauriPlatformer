import { Vec2 } from "../helperFunctions/vector.js";
import Entity from "./Entity.js";
import { Rectangle } from "../helperFunctions/shapes.js";
import { Game } from "../Game.js";
import { Door, doorProps } from "./Door.js";

interface playerProps {
  cantEnterDoors: { [id: string]: Door };
}

export class Player extends Entity {
  jumping: boolean;
  speed: number;
  lives: number = 3;
  props: playerProps = { cantEnterDoors: {} };
  constructor(id: string, pos: Vec2, color: string, game: Game) {
    super(id, "Player", pos, new Rectangle(0, 0, 20, 50, color), true, game);
    this.jumping = false;
    this.speed = 50;
  }

  update() {
    this.movement();
    for (var id in this.colliders) {
      const entity = this.colliders[id];
      if (entity.type == "Flag") this.game.LevelLoader.nextLevel();
      else if (
        entity.type == "Door" &&
        this.props.cantEnterDoors[id] == undefined
      ) {
        const door = entity as Door;
        door.enter();
        this.props.cantEnterDoors[id] = door;
        this.vel = new Vec2();
        this.acc = new Vec2();
        setTimeout(() => {
          delete this.props.cantEnterDoors[id];
        }, 1500);
      } else if (entity.deadly) {
        this.friction *= 5;
        setTimeout(() => {
          this.game.LevelLoader.restart();
        }, 500);
      }
    }
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
        this.acc.y = 0;
        this.acc.y -= this.speed * 5 * game.deltaTime;
        this.grounded = false;
      }
    }

    this.move();
  }
}
