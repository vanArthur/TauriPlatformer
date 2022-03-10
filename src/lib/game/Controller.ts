import { Vec2 } from "./helperFunctions/vector";

export class Controller {
  states: { [key: string]: { [state: string]: boolean } };
  doOns: { [key: string]: any[] };
  mousePos: Vec2;
  mouseDown: boolean | undefined;
  mouseDownPos: Vec2;
  mouseUpPos: Vec2;
  parent: HTMLElement | Document;
  constructor(element: HTMLElement | Document) {
    this.states = {
      // Space: {}, KeyA: {}, KeyD: {}
    };
    this.doOns = {};
    this.parent = element;
    this.mousePos = new Vec2();
    this.mouseDown = undefined;
    this.mouseDownPos = new Vec2();
    this.mouseUpPos = new Vec2();

    element.addEventListener("keyup", (e) => {
      this.keyup(e as KeyboardEvent);
    });
    element.addEventListener("keydown", (e) => {
      this.keydown(e as KeyboardEvent);
    });
    element.addEventListener("mousemove", (e) => {
      this.mousemove(e as MouseEvent);
    });
    element.addEventListener("mouseup", (e) => {
      this.mouseup(e as MouseEvent);
    });
    element.addEventListener("mousedown", (e) => {
      this.mousedown(e as MouseEvent);
    });
  }

  addKey(keycode: string) {
    if (this.states[keycode] == undefined) this.states[keycode] = {};
  }
  addKeys(keycodes: string[]) {
    keycodes.forEach((keycode) => {
      if (this.states[keycode] == undefined) this.states[keycode] = {};
    });
  }

  addDoOn(event: string, fn: any) {
    if (this.doOns[event] != undefined) this.doOns[event].push(fn);
    this.doOns[event] = [fn];
  }

  removeKey(keycode: string) {
    delete this.states[keycode];
  }

  keyup(e: KeyboardEvent): void {
    this.doOns["keyup"]?.forEach((fn) => {
      fn(e);
    });
    if (this.states[e.code] == undefined) return;
    this.states[e.code] = { state: false };
    e.preventDefault();
  }

  keydown(e: KeyboardEvent): boolean {
    this.doOns["keydown"]?.forEach((fn) => {
      fn(e);
    });

    if (this.states[e.code] == undefined) {
      return false;
    }
    this.states[e.code] = { state: true };
    e.preventDefault();
    return true;
  }

  mouseup(e: MouseEvent): void {
    this.mouseDown = false;
    this.mouseUpPos = this.mousePos;
    this.doOns["mouseup"]?.forEach((fn) => {
      fn(e);
    });
  }

  mousedown(e: MouseEvent): void {
    this.mouseDown = true;
    this.mouseDownPos = this.mousePos;
    this.mouseUpPos = this.mousePos;
    this.doOns["mousedown"]?.forEach((fn) => {
      fn(e);
    });
  }

  mousemove(e: MouseEvent): void {
    const pos: Vec2 = this.getMousePos(e as MouseEvent);
    this.mousePos = new Vec2(pos.x, pos.y);
    this.doOns["mousemove"]?.forEach((fn) => {
      fn(e);
    });
  }

  isPressed(key: string): boolean {
    if (this.states[key] == undefined) {
      return false;
    }
    return this.states[key].state;
  }

  getMousePos(evt: MouseEvent) {
    let rect: any;
    let el = this.parent as HTMLElement;
    try {
      rect = el.getBoundingClientRect();
    } catch {
      rect = {
        left: 0,
        top: 0,
      };
    }
    return new Vec2(evt.clientX - rect.left, evt.clientY - rect.top);
  }
}
