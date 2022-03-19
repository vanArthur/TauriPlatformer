import { Rectangle } from "../helperFunctions/shapes.js";
import Entity from "./Entity.js";
import { Vec2 } from "../helperFunctions/vector.js";

export class Platform extends Entity {
  constructor(
    id: string,
    pos: Vec2,
    width: number,
    height: number,
    color: string
  ) {
    super(id, pos, new Rectangle(0, 0, width, height, color), true);
    this.collider = new Rectangle(0, 0, width, height, color);
  }
  export() {
    let pf = {
      id: this.id,
      pos: this.pos,
      shapes: this.shapes,
    };
    console.log(pf);
  }
}
