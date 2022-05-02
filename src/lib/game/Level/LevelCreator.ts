import { Game } from "../Game";
import { randomId } from "../helperFunctions/randomId";
import { Vec2 } from "../helperFunctions/vector";

export default class LevelCreator {
  game: Game;
  constructor(game: Game) {
    this.game = game;
  }

  addLava(pos: Vec2, width: number, height: number) {
    this.game.addPlatform(
      `lava_${randomId()}`,
      pos,
      width,
      height,
      "#cf6010",
      true,
      true
    );
  }

  addFloor(pos: Vec2, width: number, height: number, color: string) {
    this.game.addPlatform(
      `floor_${randomId()}`,
      pos,
      width,
      height,
      color,
      false,
      true
    );
  }
}
