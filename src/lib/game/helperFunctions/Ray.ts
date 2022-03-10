import { Line } from "./shapes.js";
import { Vec2 } from "./vector.js";

export class Ray {
    pos: Vec2
    dir: Vec2

    constructor(pos: Vec2, vec: Vec2) {
        this.pos = new Vec2(pos.x, pos.y);
        this.dir = vec.normalize();
    }

    lookAt(x: number, y: number) {
        this.dir.x = x - this.pos.x;
        this.dir.y = y - this.pos.y;
        this.dir.normalize();
    }

    cast(line: Line) {
        //console.log(line)
        //console.log(line.x)
        const x1 = line.x
        const y1 = line.y;
        const x2 = line.tx
        const y2 = line.ty;
        const x3 = this.pos.x;
        const y3 = this.pos.y;
        const x4 = this.pos.x + this.dir.x;
        const y4 = this.pos.y + this.dir.y;
        
        //console.log(x1,y1,x2,y2,x3,y3,x4,y4)

        const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
        if (den == 0) {
            return undefined;
        }
        const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;
        const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
        if (t > 0 && t < 1 && u > 0) {
            const point = new Vec2();
            point.x = x1 + t * (x2 - x1);
            point.y = y1 + t * (y2 - y1);
            return point;
        }
    }
}
