import { randomId } from "@mantine/hooks";
import { Flag } from "./entity/Flag";
import { Player } from "./entity/Player";
import { Game } from "./Game";
import { Vec2 } from "./helperFunctions/vector";

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
  async loadLevel(level: number = this.currentLevel) {
    this.game.entities = {};
    this.game.player = new Player(
      "Player",
      new Vec2(50, 50),
      "black",
      this.game
    );
    this.game.entities["Flag"] = new Flag(
      "Flag",
      new Vec2(
        Math.random() * this.game.canvas.width * 0.8 + 10,
        Math.random() * this.game.canvas.height * 0.8 + 10
      ),
      this.game
    );

    for (let i = 0; i < Math.random() * 20 + 10; i++) {
      this.game.addPlatform(
        randomId(),
        new Vec2(
          Math.random() * this.game.canvas.width * 0.9,
          Math.random() * this.game.canvas.height * 0.9
        ),
        Math.random() * 100 + 200,
        20,
        "orange"
      );
    }
    for (var id in this.game.entities) {
      this.game.entities[id].rectangleCollision(this.game.entities);
      if (Object.keys(this.game.entities[id].colliders).length > 0)
        this.game.removeEntity(id);
    }

    this.game.addPlatform("GreenPF", new Vec2(200, 500), 150, 10, "green");
    this.game.entities["GreenPF"].friction = 0;
    this.game.entities["GreenPF"].vel.x = 3;
    this.game.entities["GreenPF"].gravity = 0;
    this.game.entities["GreenPF"].update = function () {
      if (this.pos.x > this.game.canvas.width - this.getCollider().width)
        this.vel.x *= -1;
      if (this.pos.x < 1) this.vel.x *= -1;

      this.move();
    };
    this.game.addPlatform(
      "ground",
      new Vec2(0, this.game.canvas.height - 20),
      this.game.canvas.width,
      20,
      "brown"
    );
    setInterval(() => {
      return Promise;
    }, 1000);
    return;
  }
}
