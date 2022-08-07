import { Vec2 } from "../helperFunctions/vector.js";
import Entity from "./Entity.js";
import { Rectangle } from "../helperFunctions/shapes.js";
import { Game } from "../Game.js";
import { Door, doorProps } from "./Door.js";
import { HUD } from "./HUD.js";

interface playerProps {
  health: any;
  canEnterDoor: boolean;
  healthRegen: number;
  inCombat: boolean;
  combatCooldown: any;
}

export class Player extends Entity {
  jumping: boolean;
  speed: number;
  lives: number = 3;
  props: playerProps = {
    health: 100,
    canEnterDoor: true,
    healthRegen: 1,
    inCombat: false,
    combatCooldown: undefined,
  };
  constructor(id: string, pos: Vec2, color: string, game: Game) {
    super(id, "Player", pos, new Rectangle(0, 0, 20, 50, color), true, game);
    this.setCollider(new Rectangle(0, 0, 20, 50, color));
    this.jumping = false;
    this.speed = 40;
  }

  update() {
    this.movement();
    for (var id in this.colliders) {
      const entity = this.colliders[id];
      if (entity.type == "Flag") this.game.LevelLoader.nextLevel();
      else if (entity.type == "Door" && this.props.canEnterDoor) {
        const door = entity as Door;
        door.enter();
        this.props.canEnterDoor = false;
        this.vel = new Vec2();
        this.acc = new Vec2();
        setTimeout(() => {
          this.props.canEnterDoor = true;
        }, 1500);
      } else if (entity.deadly) {
        this.takeDamage(entity.damage);
        // player is in combat
        this.props.inCombat = true;
        if (this.props.combatCooldown == undefined) {
          this.props.combatCooldown = setTimeout(() => {
            this.props.inCombat = false;
            this.props.combatCooldown = undefined;
          }, 5000);
        } else {
          clearTimeout(this.props.combatCooldown);
          this.props.combatCooldown = setTimeout(() => {
            this.props.inCombat = false;
            this.props.combatCooldown = undefined;
          }, 5000);
        }
      }
    }

    //slowly regenerate health if not in combat
    if (this.props.health < 100) {
      if (!this.props.inCombat) {
        this.addHealth();
      }
    }
  }

  takeDamage(damage: number) {
    this.props.health -= damage * this.game.deltaTime * 10;
    (this.game.entities["HUD"] as HUD).update_HEALTH();
    if (this.props.health <= 0) {
      this.game.LevelLoader.restart();
    }
  }

  addHealth() {
    this.props.health += this.props.healthRegen * this.game.deltaTime * 10;
    (this.game.entities["HUD"] as HUD).update_HEALTH();
  }

  movement() {
    let pressing = false;
    let game = this.game;
    if (game.controller.isPressed("KeyA")) {
      pressing = true;
      this.acc.x = -this.speed * game.deltaTime;
    }
    if (game.controller.isPressed("KeyD")) {
      pressing = true;
      this.acc.x = this.speed * game.deltaTime;
    }
    if (!pressing) {
      this.acc.x = 0;
    }

    if (game.controller.isPressed("Space")) {
      if (this.grounded) {
        this.acc.y = 0;
        this.acc.y -= this.speed / this.friction / 1.5;
        this.grounded = false;
      }
    }

    if (game.controller.mouseDown) {
      this.pos = game.controller.mousePos;
      this.vel = new Vec2();
      this.acc = new Vec2();
    }

    this.move();
  }
}
