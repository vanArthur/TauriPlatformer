import { useState } from "react";
import "./App.css";
import GameCanvas from "./components/game/GameCanvas";
import { appWindow } from "@tauri-apps/api/window";
import { Drawer } from "@mantine/core";

function App() {
  const [inGame, setinGame] = useState(false);
  const [settingsPopUp, setsettingsPopUp] = useState(false);

  return (
    <>
      <Drawer
        opened={settingsPopUp}
        onClose={() => setsettingsPopUp(false)}
        padding="xl"
        size="xl"
      >
        <h1 className="bold">Settings</h1>
      </Drawer>
      <div style={{ display: "grid", placeContent: "center", height: "100vh" }}>
        {inGame && !settingsPopUp && <GameCanvas></GameCanvas>}
        {!inGame && !settingsPopUp && (
          <>
            <button
              style={{
                border: "none",
                backgroundColor: "darkgray",
                borderRadius: "10px",
                padding: "7px 15px 7px 15px",
                margin: "0px 0px 10px 0px",
              }}
              onClick={() => {
                appWindow.setTitle("Loading Tauri Platformer");
                setinGame(!inGame);
              }}
            >
              Start
            </button>
            <button
              style={{
                border: "none",
                backgroundColor: "darkgray",
                borderRadius: "10px",
                padding: "7px 15px 7px 15px",
              }}
              onClick={() => {
                setsettingsPopUp(!settingsPopUp);
              }}
            >
              Settings
            </button>
          </>
        )}
      </div>
    </>
  );
}

export default App;
