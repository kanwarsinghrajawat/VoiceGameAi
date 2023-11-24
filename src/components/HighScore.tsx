import { useEffect, useState } from "react";
import { FcSettings } from "react-icons/fc";
import { FaPlay } from "react-icons/fa";
import { Link } from "react-router-dom";
import { formatTime } from "../Utils/functions";
interface GameData {
  id: number;
  gridSize: { width: number; height: number };
  time: string;
}
const HighScore = () => {
  const [gameData, setGameData] = useState<GameData[]>([]);
  useEffect(() => {
    // Retrieve the game data from local storage
    const storedData = localStorage.getItem("gameData");
    // Set the retrieved game data in state
    if (storedData) {
      const parsedData: GameData[] = JSON.parse(storedData);
      setGameData(parsedData.reverse());
    }
  }, []);
  return (
    <>
      <div className="highScoreContainer">
        <div className="highScore">
          <h1 id="text3d">Leader Board</h1>
          <div className="playButton">
            <Link to="/home">
              <span className="play-icon">
                <FaPlay size={40} className="play-icon-inner" />
                <span className="play-text neon ">
                  Click here to play the game
                </span>
              </span>
            </Link>
            <Link to="/">
              <span className="play-icon">
                <FcSettings size={40} className="play-icon-inner" />
                <span className=" play-text neon">Click here for settings</span>
              </span>
            </Link>
          </div>
          <div className="tableBox">
            <div className="tableContainer">
              <table border={2}>
                <thead>
                  <tr>
                    <th>Sl. No.</th>
                    <th>Grid Size</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {gameData.map((data, index) => (
                    <tr key={data.id}>
                      <td>{index + 1}</td>
                      <td>
                        {data.gridSize.width}x{data.gridSize.height}
                      </td>
                      <td>{formatTime(data.time)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HighScore;
