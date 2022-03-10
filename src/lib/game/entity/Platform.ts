import { Rectangle } from "../helperFunctions/shapes.js";
import Entity from "./Entity.js";
import { Vec2 } from "../helperFunctions/vector.js"

export class Platform extends Entity {
    constructor(id: string, pos: Vec2, width: number, height: number, color: string) {
        super(id, pos, new Rectangle(0, 0, width, height, color));
        this.collider = new Rectangle(0, 0, width, height, color);
    }
    export() {
        console.log(
            `game.addPlatform(randomId(),new Vec2(${this.pos.x}, ${this.pos.y}), ${this.shapes[0].width}, ${this.shapes[0].height}, "${this.shapes[0].color}")`
        );
    }
}
