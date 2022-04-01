import { Rectangle } from "../helperFunctions/shapes.js";
import Entity from "./Entity.js";
import { Vec2 } from "../helperFunctions/vector.js";
import { Game } from "../Game.js";

export class Platform extends Entity {
  constructor(
    id: string,
    pos: Vec2,
    width: number,
    height: number,
    color: string,
    game: Game
  ) {
    super(id, pos, new Rectangle(0, 0, width, height, color), true, game);
    this.collider = new Rectangle(0, 0, width, height, color);
  }
}
