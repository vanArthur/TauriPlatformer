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
      true,
      typeof zIndex === "undefined" ? 1 : zIndex
    );
  }

  addFloor(
    pos: Vec2,
    width: number,
    height: number,
    color: string,
    zIndex?: number
  ) {
    this.game.addPlatform(
      `floor_${randomId()}`,
      pos,
      width,
      height,
      color,
      false,
      true,
      typeof zIndex === "undefined" ? 1 : zIndex
    );
  }

  addFlag(pos: Vec2, zIndex: number) {
    const id = `flag_${randomId()}`;
    this.game.addEntity(id, new Flag(id, pos, this.game, zIndex));
  }
}
