import { Controller } from "./Controller.js";
import { Vec2 } from "./helperFunctions/vector.js";
import { Platform } from "./entity/Platform.js";
import { Player } from "./entity/Player.js";
import { randomId } from "./helperFunctions/randomId.js";
import { appWindow } from "@tauri-apps/api/window";
import { text } from "./helperFunctions/canvas.js";
import LevelLoader from "./Level/LevelLoader.js";
import LevelCreator from "./Level/LevelCreator.js";
import Entity from "./entity/Entity.js";
import { HUD } from "./entity/HUD.js";

export class Game {
  controller: Controller;
  player: Player;
  entities: { [id: string]: Entity } = {};
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  deltaTime: number = 0;
  lastTime: number = 0;
  pauzed: boolean = false;
  LevelLoader: LevelLoader = new LevelLoader(this);
  LevelCreator: LevelCreator = new LevelCreator(this);
  screen: { width: number; height: number } = {
    width: 1280,
    height: 720,
  };

  constructor(canvas: HTMLCanvasElement) {
    this.controller = new Controller(document);
    this.controller.addKeys([
      "KeyA",
      "KeyD",
      "Space",
      "KeyF",
      "MetaLeft",
      "Enter",
    ]);
    this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    //player outside the world
    this.player = new Player("Player", new Vec2(0, 0), "black", this);
    this.canvas = canvas;
  }

  async init() {
    appWindow.setTitle("Tauri Platformer");
    this.resizeEvent();
    this.LevelLoader.loadLevel(1);
    this.player.acc = new Vec2(0, 0);
    this.player.vel = new Vec2(0, 0);
    this.startListeners();
    this.gameLoop(0);
  }

  gameLoop(time: number) {
    this.deltaTime = (time - this.lastTime) / 1000;

    if (!this.pauzed) {
      this.ctx.clearRect(0, 0, this.screen.width, this.screen.height);
      this.update();
      this.render(this.ctx);
    } else {
      text(this.ctx, 10, 30, 30, `30px Arial`, "Pauzed", "red");
    }

    requestAnimationFrame((time) => {
      this.gameLoop(time);
    });

    this.lastTime = time;
  }

  update() {
    this.player.update();
    for (let id in this.entities) {
      this.entities[id].update();
    }
    (this.entities["HUD"] as HUD).update_COLLIDERS();
  }

  restart() {
    this.LevelLoader.restart();
  }

  render(ctx: CanvasRenderingContext2D) {
    const currentLevel = this.LevelLoader.getLevel().toString();
    text(ctx, 10, 30, 30, `30px Arial`, currentLevel, "black");
    let shouldRenderPlayer = true;
    for (var id in this.entities) {
      const entity = this.entities[id];

      if (entity.zIndex > this.player.zIndex) {
        if (shouldRenderPlayer) {
          this.player.render(ctx);
          shouldRenderPlayer = false;
        }
      }

      entity.render(ctx);
    }
    if (shouldRenderPlayer) {
      this.player.render(ctx);
    }
  }

  startListeners() {
    window.addEventListener("resize", () => {
      this.resizeEvent();
    });

    this.controller.addDoOn("keydown", (e: KeyboardEvent) => {
      if (this.controller.isPressed("MetaLeft")) {
        if (e.code == "KeyA") {
          appWindow.close();
        }
      }
      if (e.code == "KeyR") {
        this.restart();
      }
      if (e.code == "Escape") {
        this.pauzed = !this.pauzed;
        console.log(this);
      }
    });
  }

  addPlatform(
    id: string,
    pos: Vec2,
    width: number,
    height: number,
    color: string,
    deadly: boolean,
    passThrough: boolean,
    zIndex?: number
  ) {
    this.addEntity(
      id,
      new Platform(
        id,
        pos,
        width === 0 ? 1 : width,
        height === 0 ? 1 : height,
        color,
        this,
        typeof zIndex === "undefined" ? 1 : zIndex
      )
    );
    this.entities[id].deadly = deadly;
    this.entities[id].passThrough = passThrough;

    return this.entities[id];
  }

  removeEntity(id: string) {
    delete this.entities[id];
  }

  addEntity(id: string, entity: any): Entity {
    if (this.entities[id] === undefined) {
      this.entities[id] = entity;
    }
    this.sortEntitiesByZIndex();
    return this.entities[id];
  }

  sortEntitiesByZIndex() {
    let entitiesDict: any[] = Object.keys(this.entities).map((key) => {
      return [key, this.entities[key]];
    });

    entitiesDict.sort((entity1, entity2) => {
      return entity2[1].zIndex - entity1[1].zIndex;
    });

    const keys = entitiesDict.map((e) => {
      return e[0];
    });

    let newDict: { [id: string]: any } = {};
    for (var i = keys.length - 1; i >= 0; i--) {
      newDict[keys[i]] = this.entities[keys[i]];
    }

    this.entities = newDict;
  }

  resizeEvent() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    let scale = window.innerWidth / this.screen.width;

    if (window.innerHeight / scale < this.screen.height) {
      scale = window.innerHeight / this.screen.height;
    }

    this.ctx.scale(scale, scale);
  }
}
