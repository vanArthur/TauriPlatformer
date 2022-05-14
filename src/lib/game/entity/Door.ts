import { Circle, Rectangle } from "../helperFunctions/shapes.js";
import Entity from "./Entity.js";
import { Vec2 } from "../helperFunctions/vector.js";
import { Game } from "../Game.js";

export interface doorProps {
  levelToLoad: number;
}

export class Door extends Entity {
  constructor(
    id: string,
    pos: Vec2,
    width: number,
    height: number,
    game: Game,
    zIndex: number,
    levelToLoad: number
  ) {
    const shapes = [
      new Rectangle(0, 0, width, height, "#452e19"),
      new Circle(
        (1 / 4) * width,
        (1 / 2) * height,
        (1 / 10) * width,
        false,
        "gray"
      ),
    ];

    super(id, "Door", pos, shapes, false, game, zIndex);
    this.setCollider(shapes[0]);
    this.gravity = 0;

    this.props = {
      levelToLoad: levelToLoad,
    };
  }

  enter() {
    this.game.LevelLoader.loadLevel(this.props.levelToLoad);
  }
}
