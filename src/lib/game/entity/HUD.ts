import { Circle, Rectangle } from "../helperFunctions/shapes.js";
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
      new Rectangle(pos.x, pos.y, width, height, "lightgray"),
      new Rectangle(pos.x, pos.y, width, height, "green"),
    ];

    super("HUD_HEALTH", "HUD", pos, shapes, false, game, zIndex);
    this.setCollider(shapes[0]);
    this.gravity = 0;

    this.props = {
      health: 100,
    };
  }

  updateHUD() {
    this.props.health = this.game.player.props.health;
    this.shapes[1].width = (this.props.health / 100) * this.shapes[0].width;
  }
}
