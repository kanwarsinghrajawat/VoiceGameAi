import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { GridContext } from "./GridContext";
import { TbScoreboard } from "react-icons/tb";
import { FaPlay } from "react-icons/fa";
const Settings = () => {
  const { updateGridSize, updateSpeed } = useContext(GridContext);
  const [selectedGridSize, setSelectedGridSize] = useState("");
  const [selectedSpeed, setSelectedSpeed] = useState("");

  // For updating the grid
  const handleGridSizeChange = (event: any) => {
    const gridSize = event.target.value.split("*");
    const width = parseInt(gridSize[0]);
    const height = parseInt(gridSize[1]);
    setSelectedGridSize(event.target.value);
    updateGridSize(width, height);
  };

  // For updating the speed
  const handleSpeedChange = (event: any) => {
    const newSpeed = parseInt(event.target.value);
    setSelectedSpeed(event.target.value);
    updateSpeed(newSpeed);
  };

  // for clear Button
  const handleClear = () => {
    setSelectedGridSize("");
    setSelectedSpeed("");
  };

  return (
    <>
      <div className="settings__container">
        <div className="settings">
          <h1 id="text3d">SETTINGS</h1>
          <div className="container">
            <div className="controls">
              <select
                className="selectBoxStyles"
                value={selectedGridSize}
                onChange={handleGridSizeChange}
              >
                <option hidden>Set grid size</option>
                <option>4 * 4</option>
                <option>8 * 8</option>
                <option>12 * 12</option>
                <option>16 * 16</option>
              </select>
              <select
                className="selectBoxStyles"
                value={selectedSpeed}
                onChange={handleSpeedChange}
              >
                <option hidden>Set speed (millisecond)</option>
                <option value="100">50</option>
                <option value="200">200</option>
                <option value="500">500</option>
                <option value="1000">1000</option>
              </select>
              <button className="check" onClick={handleClear}>
                Reset
              </button>
              <Link to="/home">
                <button className="check">Save and Play</button>
              </Link>
            </div>
            <div className="sideButtons">
              <Link to="/home">
                <span className="play-icon">
                  <FaPlay size={40} className="play-icon-inner" />
                  <span className="play-text neon">
                    Click here to play the game
                  </span>
                </span>
              </Link>
              <Link to="/highscore">
                <span className="play-icon">
                  <TbScoreboard size={40} className="play-icon-inner" />
                  <span className="play-text neon">
                    Click here for leaderboard
                  </span>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Settings;
