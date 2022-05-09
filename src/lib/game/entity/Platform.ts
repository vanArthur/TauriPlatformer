import { Rectangle } from "../helperFunctions/shapes.js";
import Entity from "./Entity.js";
import { Vec2 } from "../helperFunctions/vector.js";
import { Game } from "../Game.js";

export class Platform extends Entity {
  deadly: boolean = false;
  constructor(
    id: string,
    pos: Vec2,
    width: number,
    height: number,
    color: string,
    game: Game,
    zIndex: number
  ) {
    super(
      id,
      pos,
      new Rectangle(0, 0, width, height, color),
      true,
      game,
      zIndex
    );
    this.collider = new Rectangle(0, 0, width, height, color);
  }
}
