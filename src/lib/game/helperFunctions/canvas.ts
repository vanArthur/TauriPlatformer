import { Vec2 } from "./vector.js"

export function Rect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string, stroke: boolean) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h); // (x, y, width, height)
  if (stroke) {
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.strokeRect(x, y, w, h);
  }
}

export function circle(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, stroke: boolean, color: string) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI); //(x, y, radius, magic, path)
  if (stroke) {
    ctx.stroke();
  } else {
    ctx.fill();
  }
}

// function multiLine(ctx, fromx, fromy, to, width, color) {
//   ctx.fillStyle = color;
//   ctx.strokeStyle = color;
//   ctx.beginPath();
//   ctx.lineWidth = width;
//   ctx.moveTo(fromx, fromy);
//   to.forEach((co) => {
//     ctx.lineTo(co[0], co[1]);
//   });
//   ctx.stroke();
// }

export function line(ctx: CanvasRenderingContext2D, fromx: number, fromy: number, tox: number, toy: number, width: number, color: string) {
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.lineWidth = width;
  ctx.moveTo(fromx, fromy);
  ctx.lineTo(tox, toy);
  ctx.stroke();
}

export function text(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, font: string, text: string, color: string) {
  ctx.fillStyle = color;
  ctx.font = `${size} ${font}`;
  ctx.fillText(text, x, y);
}

export function drawShape(ctx: CanvasRenderingContext2D, pos: Vec2, shape: any) {
  if (shape.shapeName === "Circle") {
    circle(
      ctx,
      pos.x + shape.x,
      pos.y + shape.y,
      shape.radius,
      shape.stroke,
      shape.color
    );
  } else if (shape.shapeName === "Rectangle") {
    Rect(
      ctx,
      pos.x + shape.x,
      pos.y + shape.y,
      shape.width,
      shape.height,
      shape.color,
      shape.stroke
    );
  } else if (shape.shapeName === "Line") {
    line(
      ctx,
      pos.x + shape.x,
      pos.y + shape.y,
      shape.tox,
      shape.toy,
      shape.width,
      shape.color
    );
  } else if (shape.shapeName === "Text") {
    text(
      ctx,
      pos.x + shape.x,
      pos.y + shape.y,
      shape.size,
      shape.font,
      shape.text,
      shape.color
    );
  }
}
