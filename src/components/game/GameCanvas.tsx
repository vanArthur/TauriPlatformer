import { useEffect } from "react";
import { Game } from "../../lib/game/Game";

const GameCanvas = () => {
  useEffect(() => {
    let canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
    let game = new Game(canvas);
    game.init();
  });

  return <canvas id="gameCanvas"></canvas>;
};

export default GameCanvas;
