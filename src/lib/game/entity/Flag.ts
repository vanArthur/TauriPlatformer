import { Rectangle } from "../helperFunctions/shapes.js";
import Entity from "./Entity.js";
import { Vec2 } from "../helperFunctions/vector.js";

export class Flag extends Entity {
  constructor(id: string, pos: Vec2) {
    const shapes = [
      new Rectangle(0, 0, 5, 50, "green"),
      new Rectangle(0, 0, 30, 20, "green"),
    ];

    super(id, pos, shapes, false);
    this.setCollider(new Rectangle(0, 0, 30, 50, "green"));
  }
  export() {
    let pf = {
      id: this.id,
      pos: JSON.stringify(this.pos),
      shapes: this.shapes,
    };
    console.log(pf);
  }
}
