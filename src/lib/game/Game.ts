import { Controller } from "./Controller.js";
import { Vec2 } from "./helperFunctions/vector.js";
import { Platform } from "./entity/Platform.js";
import { Player } from "./entity/Player.js";
import { randomId } from "./helperFunctions/randomId.js";
import { event } from "@tauri-apps/api";
import { Flag } from "./entity/Flag";
import { appWindow } from "@tauri-apps/api/window";

export class Game {
  controller: Controller;
  player: Player;
  entities: { [id: string]: Platform };
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  deltaTime: number;
  lastTime: number;

  constructor(canvas: HTMLCanvasElement) {
    this.controller = new Controller(document);
    this.controller.addKeys(["KeyA", "KeyD", "Space", "KeyF", "MetaLeft"]);
    this.player = new Player(new Vec2(50, 50), "black", this.controller);
    this.entities = {};
    this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    this.canvas = canvas;
    this.deltaTime = 0;
    this.lastTime = 0;
  }

  init() {
    appWindow.setTitle("Tauri Platformer");
    this.resizeEvent();
    this.loadLevel();
    this.startListeners();
    this.gameLoop(0);
  }

  gameLoop(time: number) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.deltaTime = (time - this.lastTime) / 1000;

    this.update(this.deltaTime);
    this.render(this.ctx);

    requestAnimationFrame((time) => {
      this.gameLoop(time);
    });

    this.lastTime = time;
  }

  loadLevel() {
    this.addPlatform(randomId(), new Vec2(0, 600), 200, 20, "green");
    this.addPlatform(randomId(), new Vec2(200, 500), 150, 10, "green");
    this.addPlatform(randomId(), new Vec2(144, 542), 140, 25, "red");
    this.addPlatform(
      "ground",
      new Vec2(0, this.canvas.height - 20),
      this.canvas.width,
      20,
      "brown"
    );
    this.entities["flag"] = new Flag("flag", new Vec2(200, 200));
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
        "red"
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
      this.removePlatform("temp");
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
      this.addPlatform(randId, pfPos, pfW, pfH, "green");
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
    });
  }

  update(deltaTime: number) {
    this.player.movement(deltaTime, this.entities);
    this.controller.mousePos;
  }

  render(ctx: CanvasRenderingContext2D) {
    this.player.render(ctx);
    for (var id in this.entities) {
      this.entities[id].render(ctx);
    }
    if (this.controller.isPressed("KeyF")) {
      ctx.fillStyle = "gray";
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  addPlatform(
    id: string,
    pos: Vec2,
    width: number,
    height: number,
    color: string
  ) {
    this.entities[id] = new Platform(
      id,
      pos,
      width == 0 ? 1 : width,
      height == 0 ? 1 : height,
      color
    );
  }

  removePlatform(id: string) {
    delete this.entities[id];
  }

  resizeEvent() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
}
