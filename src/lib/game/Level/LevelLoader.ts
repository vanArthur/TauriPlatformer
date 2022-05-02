import { randomId } from "../helperFunctions/randomId";
import { Flag } from "../entity/Flag";
import { Player } from "../entity/Player";
import { Game } from "../Game";
import { Vec2 } from "../helperFunctions/vector";
import { Platform } from "../entity/Platform";

export default class LevelLoader {
  currentLevel: number;
  game: Game;
  constructor(game: Game) {
    this.currentLevel = 1;
    this.game = game;
  }

  getLevel() {
    return this.currentLevel;
  }

  async restart() {
    this.currentLevel = 1;
    this.loadLevel();
  }

  async nextLevel() {
    this.currentLevel += 1;
    this.loadLevel();
  }

  async reset() {
    this.game.entities = {};
  }

  async loadLevel(level: number = this.currentLevel) {
    const levelCreator = this.game.LevelCreator;

    this.reset();
    const screenWidth = this.game.canvas.width;
    const screenHeight = this.game.canvas.height;

    this.game.player = new Player(
      "Player",
      new Vec2(100, 100),
      "black",
      this.game
    );
    levelCreator.addFloor(
      new Vec2(-5, screenHeight - 10),
      screenWidth + 10,
      10,
      "brown"
    );

    levelCreator.addFloor(
      new Vec2(-5, screenHeight - 14),
      screenWidth + 10,
      4,
      "green"
    );

    levelCreator.addLava(
      new Vec2(200, screenHeight - 14 - 2 * this.game.player.shapes[0].height),
      100,
      14
    );

    setInterval(() => {
      return Promise;
    }, 1000);
    return;
  }
}
