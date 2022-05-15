import { randomId } from "../helperFunctions/randomId";
import { Flag } from "../entity/Flag";
import { Player } from "../entity/Player";
import { Game } from "../Game";
import { Vec2 } from "../helperFunctions/vector";
import { Platform } from "../entity/Platform";
import LevelCreator from "./LevelCreator";

export default class LevelLoader {
  currentLevel: number;
  game: Game;
  maxLevel: number = 1;
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
    this.currentLevel += this.currentLevel === this.maxLevel ? 0 : 1;
    this.loadLevel();
  }

  async reset() {
    this.game.entities = {};
  }

  loadLevel(lvl?: number) {
    const level = typeof lvl === "undefined" ? this.currentLevel : lvl;

    console.log("Loading level...", level);
    const levelCreator = this.game.LevelCreator;

    this.reset();
    const screenWidth = this.game.screen.width;
    const screenHeight = this.game.screen.height;

    this.EntitySpawner(level, levelCreator, screenHeight, screenWidth);

    return;
  }

  private EntitySpawner(
    level: number,
    levelCreator: LevelCreator,
    screenHeight: number,
    screenWidth: number
  ) {
    switch (level) {
      case 1: {
        this.game.player = new Player(
          "Player",
          new Vec2(100, 100),
          "#4287f5",
          this.game
        );
        levelCreator.addRect(
          new Vec2(-5, screenHeight - 10),
          screenWidth + 10,
          10,
          true,
          "brown"
        );

        levelCreator.addRect(
          new Vec2(-5, screenHeight - 14),
          screenWidth + 10,
          4,
          true,
          "green"
        );

        levelCreator.addLava(
          new Vec2(
            200,
            screenHeight - 14 - 2 * this.game.player.shapes[0].height
          ),
          100,
          14,
          1
        );

        levelCreator.addDoor(
          new Vec2(screenWidth / 2, screenHeight - 14 - 68),
          27,
          68,
          1.1,
          11
        );

        return;
      }
      case 1.1: {
        this.game.player = new Player(
          "Player",
          new Vec2(1108, 570),
          "#4287f5",
          this.game
        );

        levelCreator.addRect(
          new Vec2(0, 0),
          screenWidth,
          screenHeight,
          false,
          "black",
          0
        );

        levelCreator.addRect(
          new Vec2(0, 0),
          100,
          screenHeight,
          true,
          "#542a01",
          1
        );

        levelCreator.addRect(
          new Vec2(screenWidth - 100, 0),
          100,
          screenHeight,
          true,
          "#542a01",
          1
        );

        levelCreator.addRect(
          new Vec2(0, screenHeight - 100),
          screenWidth,
          100,
          true,
          "#542a01",
          1
        );

        levelCreator.addDoor(
          new Vec2(screenWidth - 150, screenHeight - 170),
          30,
          70,
          1,
          2
        );

        levelCreator.addFlag(
          new Vec2((screenWidth * 2) / 3, (screenHeight * 2) / 3),
          10
        );
      }
    }
  }
}
