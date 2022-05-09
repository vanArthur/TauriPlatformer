import { Controller } from "./Controller.js";
import { Vec2 } from "./helperFunctions/vector.js";
import { Platform } from "./entity/Platform.js";
import { Player } from "./entity/Player.js";
import { randomId } from "./helperFunctions/randomId.js";
import { appWindow } from "@tauri-apps/api/window";
import { text } from "./helperFunctions/canvas.js";
import LevelLoader from "./Level/LevelLoader.js";
import LevelCreator from "./Level/LevelCreator.js";

export class Game {
  controller: Controller;
  player: Player;
  entities: { [id: string]: any } = {};
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  deltaTime: number = 0;
  lastTime: number = 0;
  pauzed: boolean = false;
  LevelLoader: LevelLoader = new LevelLoader(this);
  LevelCreator: LevelCreator = new LevelCreator(this);

  constructor(canvas: HTMLCanvasElement) {
    this.controller = new Controller(document);
    this.controller.addKeys(["KeyA", "KeyD", "Space", "KeyF", "MetaLeft"]);
    this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    this.player = new Player("Player", new Vec2(50, 50), "black", this);
    this.canvas = canvas;
  }

  async init() {
    appWindow.setTitle("Tauri Platformer");
    this.resizeEvent();
    this.LevelLoader.loadLevel(1);
    this.startListeners();
    this.gameLoop(0);
  }

  gameLoop(time: number) {
    this.deltaTime = (time - this.lastTime) / 1000;

    if (!this.pauzed) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
  }

  restart() {
    this.LevelLoader.restart();
  }

  render(ctx: CanvasRenderingContext2D) {
    this.player.render(ctx);
    const fps = (1000 / this.deltaTime).toString();
    const currentLevel = this.LevelLoader.getLevel().toString();
    text(ctx, this.canvas.width - 50, 30, 30, `30px Arial`, fps, "black");
    text(ctx, 10, 30, 30, `30px Arial`, currentLevel, "black");
    for (var id in this.entities) {
      this.entities[id].render(ctx);
    }
  }

  startListeners() {
    window.addEventListener("resize", () => {
      this.resizeEvent();
    });

    const onDown = (() => {
      this.addPlatform(
        "temp",
        this.controller.mouseDownPos!,
        this.controller.mouseUpPos!.x - this.controller.mouseDownPos!.x,
        this.controller.mouseUpPos!.y - this.controller.mouseDownPos!.y,
        "red",
        false,
        false
      );
    }).bind(this);

    const onMove = (() => {
      if (this.entities["temp"] != undefined) {
        this.entities["temp"].shapes[0].width =
          this.controller.mousePos!.x - this.controller.mouseDownPos!.x;
        this.entities["temp"].shapes[0].height =
          this.controller.mousePos!.y - this.controller.mouseDownPos!.y;
      }
    }).bind(this);

    const onUp = (() => {
      this.removeEntity("temp");
      let pfPos = this.controller.mouseDownPos!;
      let pfW = this.controller.mouseUpPos!.x - this.controller.mouseDownPos!.x;
      let pfH = this.controller.mouseUpPos!.y - this.controller.mouseDownPos!.y;

      if (pfW < 0) {
        pfPos.x += pfW;
        pfW = -pfW;
      }
      if (pfH < 0) {
        pfPos.y += pfH;
        pfH = -pfH;
      }

      const randId = randomId();
      this.addPlatform(randId, pfPos, pfW, pfH, "green", false, true);
    }).bind(this);

    this.controller.addDoOn("mousedown", onDown);
    this.controller.addDoOn("mousemove", onMove);
    this.controller.addDoOn("mouseup", onUp);
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
    collision: boolean,
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
    this.entities[id].noOverlap = collision;

    return this.entities[id];
  }

  removeEntity(id: string) {
    delete this.entities[id];
  }

  addEntity(id: string, entity: any) {
    if (this.entities[id] === undefined) {
      this.entities[id] = entity;
    }
    this.sortEntitiesByZIndex();
  }

  sortEntitiesByZIndex() {
    let entitiesDict = Object.keys(this.entities).map((key) => {
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
  }
}
