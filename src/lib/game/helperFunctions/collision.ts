import { Ray } from "./Ray.js";
import { Vec2 } from "./vector.js";
import Entity from "../entity/Entity.js";
import { Line } from "./shapes.js";

export function cubeCollision(
  pos1: Vec2,
  width1: number,
  height1: number,
  pos2: Vec2,
  width2: number,
  height2: number
) {
  if (
    pos1.x < pos2.x + width2 &&
    pos1.x + width1 > pos2.x &&
    pos1.y < pos2.y + height2 &&
    pos1.y + height1 > pos2.y
  ) {
    return true;
  }
  return false;
}

export function CubeRayCollisionLeft(origin: Entity, colliders: any) {
  let maxLeft = 0;

  let lines: Line[] = colliders;
  let dirLeft: Vec2 = new Vec2().left();

  let TopLeftRay: Ray = new Ray(origin.getTopLeft(), dirLeft);
  let BottomLeftRay: Ray = new Ray(origin.getBottomLeft(), dirLeft);

  lines.forEach((line) => {
    const TopLeftCast = TopLeftRay.cast(line);
    const BottomLeftCast = BottomLeftRay.cast(line);

    if (TopLeftCast != undefined) {
      if (TopLeftCast!.x > maxLeft) {
        maxLeft = TopLeftCast!.x;
      }
    }
    if (BottomLeftCast != undefined) {
      if (BottomLeftCast!.x > maxLeft) {
        maxLeft = BottomLeftCast!.x;
      }
    }
  });
  //not right
  return maxLeft;
}

export function CubeRayCollisionRight(origin: Entity, colliders: any) {
  let minRight = 1000000000;

  let lines: Line[] = colliders;

  let dirRight: Vec2 = new Vec2().right();

  let TopRightRay: Ray = new Ray(origin.getTopRight(), dirRight);
  let BottomRightRay: Ray = new Ray(origin.getBottomRight(), dirRight);

  lines.forEach((line) => {
    const TopRightCast = TopRightRay.cast(line);
    const BottomRightCast = BottomRightRay.cast(line);

    if (TopRightCast != undefined) {
      if (TopRightCast!.x < minRight) {
        minRight = TopRightCast!.x;
      }
    }
    if (BottomRightCast != undefined) {
      if (BottomRightCast!.x < minRight) {
        minRight = BottomRightCast!.x;
      }
    }
  });
  return minRight;
}
