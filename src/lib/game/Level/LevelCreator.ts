import { Door } from "../entity/Door";
import { Flag } from "../entity/Flag";
import { Game } from "../Game";
import { randomId } from "../helperFunctions/randomId";
import { Vec2 } from "../helperFunctions/vector";

export default class LevelCreator {
  game: Game;
  constructor(game: Game) {
    this.game = game;
  }

  addLava(pos: Vec2, width: number, height: number, zIndex?: number) {
    this.game.addPlatform(
      `lava_${randomId()}`,
      pos,
      width,
      height,
      "#cf6010",
      true,
      false,
      typeof zIndex === "undefined" ? 1 : zIndex
    );
  }

  addRect(
    pos: Vec2,
    width: number,
    height: number,
    passThrough: boolean,
    color: string,
    zIndex?: number
  ) {
    return this.game.addPlatform(
      `floor_${randomId()}`,
      pos,
      width,
      height,
      color,
      false,
      passThrough,
      typeof zIndex === "undefined" ? 1 : zIndex
    );
  }

  addFlag(pos: Vec2, zIndex: number) {
    const id = `flag_${randomId()}`;
    this.game.addEntity(id, new Flag(id, pos, this.game, zIndex));
  }

  addDoor(
    pos: Vec2,
    width: number,
    height: number,
    levelToLoad: number,
    zIndex?: number
  ) {
    const id = `door_${randomId()}`;
    this.game.addEntity(
      id,
      new Door(
        id,
        pos,
        width,
        height,
        this.game,
        typeof zIndex === "undefined" ? 1 : zIndex,
        levelToLoad
      )
    );
  }
}
