import { Vec2 } from "./vector";

export class Shape {
    x: number
    y: number
    color: string
    shapeName?: string

    constructor(x: number, y: number, color: string) {
        this.x = x;
        this.y = y;
        this.color = color;
    }
}
export class Rectangle extends Shape {
    width: number
    height: number
    constructor(x: number, y: number, width: number, height: number, color: string) {
        super(x, y, color);
        this.width = width;
        this.height = height;
        this.color = color;
        this.shapeName = "Rectangle";
    }
}
export class Circle extends Shape {
    radius: number
    stroke: boolean
    constructor(x: number, y: number, radius: number, stroke: boolean, color: string) {
        super(x, y, color);
        this.radius = radius;
        this.stroke = stroke;
        this.shapeName = "Circle";
    }
}

export class Line extends Shape {
    width: number
    tx: number
    ty: number
    constructor(x: number, y: number, tx: number, ty: number, color: string) {
        super(x, y, color);
        this.tx = tx;
        this.ty = ty;
        this.width = 3;
        this.shapeName = "Line";
    }
    set(pos1: Vec2, pos2: Vec2) {
        this.x = pos1.x
        this.y = pos1.y
        this.tx = pos2.x
        this.ty = pos2.y
    }
}

export class Text extends Shape {
    text: string
    size: number
    font: string
    constructor(x: number, y: number, color: string, text: string, size: number, font: string) {
        super(x, y, color);
        this.text = text;
        this.size = size;
        this.font = font;
        this.shapeName = "Text";
    }
}
