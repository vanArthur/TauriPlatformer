import { Game } from "../Game";
import { Rectangle } from "../helperFunctions/shapes";
import { Vec2 } from "../helperFunctions/vector";
import Entity from "./Entity";
import { Player } from "./Player";

export class Bullet extends Entity {
  removed: any;
  shooter_id: string;
  constructor(
    id: string,
    shooter_id: string,
    velocity: Vec2,
    position: Vec2,
    game: Game
  ) {
    super(
      id,
      "Bullet",
      new Vec2(0, 0),
      new Rectangle(0, 0, 5, 5, "black"),
      true,
      game
    );
    this.vel = velocity;
    this.pos = position;
    this.pos.y += this.game.player.getCollider().height / 2;
    this.game = game;
    this.checkCollision = true;
    this.gravity = 0;
    this.friction = 0;
    this.setCollider(this.shapes);
    this.removed = false;
    this.shooter_id = shooter_id;
  }

  update(): void {
    if (!this.removed) {
      this.move();
      const colliderCount = Object.keys(this.colliders).length;
      if (
        colliderCount > 0 ||
        this.pos.x > this.game.screen.width ||
        this.pos.x < 0
      ) {
        //only if target is not shooter
        if (colliderCount == 1) {
          if (this.colliders.hasOwnProperty(this.shooter_id)) {
            (this.colliders[this.shooter_id] as Player).takeDamage(this.damage);
            return;
          }
        }
        //for every entity that is colliding with bullet
        for (const key in this.colliders) {
          const entity = this.colliders[key];
          if (entity instanceof Player) {
            entity.takeDamage(this.damage);
          }
        }
        this.removed = true;
        this.game.removeEntity(this.id);
      }
    }
  }
}
