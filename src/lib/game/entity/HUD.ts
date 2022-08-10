import { Circle, Rectangle, Text } from "../helperFunctions/shapes.js";
import Entity from "./Entity.js";
import { Vec2 } from "../helperFunctions/vector.js";
import { Game } from "../Game.js";
import { Player } from "./Player.js";

export interface hudProps {
  health: number;
}

export class HUD extends Entity {
  constructor(
    id: string,
    pos: Vec2,
    width: number,
    height: number,
    game: Game,
    zIndex: number
  ) {
    const shapes = [
      new Rectangle(
        game.canvas.width - width - 10,
        10,
        width,
        height,
        "lightgray"
      ),
      new Rectangle(game.canvas.width - width - 10, 10, width, height, "green"),
      new Rectangle(8, 30, 500, 30, "lightgray"),
      new Text(10, 50, "black", "Colliders: ", 10, "20px Arial"),
    ];

    super("HUD_HEALTH", "HUD", pos, shapes, false, game, zIndex);
    this.setCollider(shapes[0]);
    this.gravity = 0;

    this.props = {
      health: 100,
    };
  }

  update_HEALTH() {
    this.props.health = this.game.player.props.health;
    this.shapes[1].width = (this.props.health / 100) * this.shapes[0].width;
  }

  update_COLLIDERS() {
    let colliders = [];
    for (var id in this.game.player.colliders) {
      const entity = this.game.player.colliders[id];
      colliders.push(entity.type);
    }

    let new_text = "";
    for (var i = 0; i < colliders.length; i++) {
      new_text += colliders[i] + "\n";
    }

    this.shapes[3].text = `Colliders: ${new_text}`;
  }

  update_all() {
    this.update_HEALTH();
    this.update_COLLIDERS();
  }
}
