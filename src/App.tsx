import { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import GameCanvas from "./components/game/GameCanvas";

function App() {
  return (
    <div>
      <GameCanvas></GameCanvas>
    </div>
  );
}

export default App;
