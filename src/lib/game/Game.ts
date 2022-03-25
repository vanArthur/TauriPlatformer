import { Controller } from "./Controller.js";
import { Vec2 } from "./helperFunctions/vector.js";
import { Platform } from "./entity/Platform.js";
import { Player } from "./entity/Player.js";
import { randomId } from "./helperFunctions/randomId.js";
import { Flag } from "./entity/Flag";
import { appWindow } from "@tauri-apps/api/window";

export class Game {
  currentLevel: number = 1;
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
    this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    this.player = new Player(
      "Player",
      new Vec2(50, 50),
      "black",
      this.controller
    );
    this.entities = {};
    this.canvas = canvas;
    this.deltaTime = 0;
    this.lastTime = 0;
  }

  async init() {
    appWindow.setTitle("Tauri Platformer");
    this.resizeEvent();
    await this.loadLevel(1);
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

  update(deltaTime: number) {
    this.player.movement(deltaTime, this.entities);

    if (this.player.colliders["Flag"]) {
      this.currentLevel += 1;
      this.loadLevel(this.currentLevel);
    }

    let greenPF = this.entities["GreenPF"];

    if (greenPF.pos.x > this.canvas.width - greenPF.getCollider().width)
      greenPF.vel.x *= -1;
    if (greenPF.pos.x < 1) greenPF.vel.x *= -1;

    greenPF.move(deltaTime, this.entities);
  }

  restart() {
    this.currentLevel = 1;
    this.loadLevel(this.currentLevel);
  }

  render(ctx: CanvasRenderingContext2D) {
    if (this.controller.isPressed("KeyF")) {
      ctx.fillStyle = "gray";
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    this.player.render(ctx);
    let cl = this.currentLevel.toString();
    ctx.font = ctx.font = "30px Arial";
    ctx.fillText(cl, 10, 30);
    for (var id in this.entities) {
      id != "Flag" && this.entities[id].render(ctx);
    }
    this.entities["Flag"] && this.entities["Flag"].render(ctx);
  }

  async loadLevel(level: number) {
    this.entities = {};
    this.player = new Player(
      "Player",
      new Vec2(50, 50),
      "black",
      this.controller
    );
    this.entities["Flag"] = new Flag(
      "Flag",
      new Vec2(
        Math.random() * this.canvas.width * 0.8 + 10,
        Math.random() * this.canvas.height * 0.8 + 10
      )
    );

    for (let i = 0; i < Math.random() * 20 + 10; i++) {
      this.addPlatform(
        randomId(),
        new Vec2(
          Math.random() * this.canvas.width * 0.9,
          Math.random() * this.canvas.height * 0.9
        ),
        Math.random() * 100 + 200,
        20,
        "orange"
      );
    }
    for (var id in this.entities) {
      this.entities[id].rectangleCollision(this.entities);
      if (Object.keys(this.entities[id].colliders).length > 0)
        delete this.entities[id];
    }

    this.addPlatform("GreenPF", new Vec2(200, 500), 150, 10, "green");
    this.entities["GreenPF"].friction = 0;
    this.entities["GreenPF"].vel.x = 3;
    this.entities["GreenPF"].gravity = 0;
    this.addPlatform(
      "ground",
      new Vec2(0, this.canvas.height - 20),
      this.canvas.width,
      20,
      "brown"
    );
    setInterval(() => {
      return Promise;
    }, 1000);
    return;
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
      if (e.code == "KeyR") {
        this.restart();
      }
    });
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

  removeEntity(id: string) {
    delete this.entities[id];
  }

  resizeEvent() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
}
