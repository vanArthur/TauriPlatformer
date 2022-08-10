import { Player } from "../entity/Player";
import { Game } from "../Game";
import { Vec2 } from "../helperFunctions/vector";
import LevelCreator from "./LevelCreator";
import { HUD } from "../entity/HUD";
import Entity from "../entity/Entity";
import { Rectangle } from "../helperFunctions/shapes";
import {
  distBetweenPoints,
  distBetweenPointsVec,
} from "../helperFunctions/math";
import { Bullet } from "../entity/Bullet";
import { randomId } from "../helperFunctions/randomId";

export default class LevelLoader {
  currentLevel: number;
  game: Game;
  maxLevel: number = 2;
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

  private async reset() {
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
    this.hudLoader(screenHeight, screenWidth);

    return;
  }

  private async hudLoader(screenHeight: number, screenWidth: number) {
    const width = 100;
    const hud = new HUD("HUD", new Vec2(), width, 10, this.game, 100);
    hud.update();
    this.game.addEntity("HUD", hud);
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
          new Vec2(100, screenHeight - 100),
          "#4287f5",
          this.game
        );
        this.game.player.checkCollision = true;
        levelCreator.addRect(
          new Vec2(-5, screenHeight - 10),
          screenWidth + 10,
          10,
          false,
          "brown"
        );

        levelCreator.addRect(
          new Vec2(-5, screenHeight - 14),
          screenWidth + 10,
          4,
          false,
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
        this.game.player.pos = new Vec2(1108, 565);

        levelCreator.addRect(
          new Vec2(0, 0),
          screenWidth,
          screenHeight,
          true,
          "black",
          0
        );

        levelCreator.addRect(
          new Vec2(0, 0),
          100,
          screenHeight,
          false,
          "#542a01",
          1
        );

        levelCreator.addRect(
          new Vec2(screenWidth - 100, 0),
          100,
          screenHeight,
          false,
          "#542a01",
          1
        );

        levelCreator.addRect(
          new Vec2(0, screenHeight - 100),
          screenWidth,
          100,
          false,
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
        return;
      }
      case 2: {
        this.game.player.pos = new Vec2(100, screenHeight - 100);

        levelCreator.addRect(
          new Vec2(-5, screenHeight - 10),
          screenWidth + 10,
          10,
          false,
          "brown"
        );

        levelCreator.addRect(
          new Vec2(-5, screenHeight - 14),
          screenWidth + 10,
          4,
          false,
          "green"
        );

        let moving_platform = levelCreator.addRect(
          new Vec2(500, screenHeight - 200),
          100,
          14,
          false,
          "brown"
        );
        moving_platform.friction = 0;
        moving_platform.gravity = 0;
        moving_platform.props = {
          ...moving_platform.props,
          increasor: 0,
        };
        moving_platform.update = function () {
          moving_platform.props.increasor += 0.01;
          moving_platform.vel.y = Math.sin(moving_platform.props.increasor);
          moving_platform.move();
        };

        const risingdoor: Entity = this.game.addEntity(
          "risedoor",
          new Entity(
            "risedoor",
            "risedoor",
            new Vec2(screenWidth - 150, screenHeight - 114),
            [new Rectangle(0, 0, 30, 100, "brown")],
            false,
            this.game
          )
        );
        risingdoor.gravity = 0;
        risingdoor.checkCollision = false;
        risingdoor.update = function () {
          const dist = distBetweenPointsVec(this.pos, this.game.player.pos);
          if (dist < 150) {
            this.vel.y = -1;
          } else {
            this.vel.y = 1;
          }
          if (this.pos.y < screenHeight - 180) {
            this.pos.y = screenHeight - 180;
            this.vel.y = 0;
          }
          if (this.pos.y > screenHeight - 113) {
            this.pos.y = screenHeight - 113;
            this.vel.y = 0;
          }
          this.move();
        };
        risingdoor.setCollider(new Rectangle(0, 0, 30, 100, "brown"));

        return;
      }
    }
  }
}
