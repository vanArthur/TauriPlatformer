import { Rectangle } from "../helperFunctions/shapes.js";
import Entity from "./Entity.js";
import { Vec2 } from "../helperFunctions/vector.js";
import { Game } from "../Game.js";

export class Flag extends Entity {
  posOffSet: number;
  constructor(id: string, pos: Vec2, game: Game) {
    const shapes = [
      new Rectangle(0, 0, 5, 50, "green"),
      new Rectangle(0, 0, 30, 20, "green"),
    ];

    super(id, pos, shapes, false, game);
    this.setCollider(new Rectangle(0, 0, 30, 50, "green"));
    this.posOffSet = 0;
    this.gravity = 0;
  }

  update() {
    //animate flag up and down
    this.posOffSet += 0.08;
    this.vel.y = Math.sin(this.posOffSet) / 5;
    this.move();
  }
}
