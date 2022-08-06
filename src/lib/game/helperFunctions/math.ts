import { Vec2 } from "./vector";

export function distBetweenPoints(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

export function distBetweenPointsVec(vec1: Vec2, vec2: Vec2): number {
  return Math.sqrt((vec2.x - vec1.x) ** 2 + (vec2.y - vec1.y) ** 2);
}
