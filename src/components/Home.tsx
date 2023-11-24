import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FcSettings } from "react-icons/fc";
import { MdOutlineRestartAlt } from "react-icons/md";
import { IoMdArrowRoundBack } from "react-icons/io";
import { AiFillApple } from "react-icons/ai";
import { FiArrowRight } from "react-icons/fi";
import { TbScoreboard } from "react-icons/tb";
import Modal from "../Lib/Modal";
import Restart from "../Lib/Restart";
import Quit from "../Lib/Quit";
import Finish from "../Lib/Finish";
import { GridContext } from "./GridContext";
import {
  connectWebsocket,
  stopMicrophoneCapture,
  getData,
} from "../Utils/microphone-capture";
import {
  getRotationAngle,
  formatTime,
  calculateSizes,
  generateCells,
  movePersonCell,
  handleStoreGameData,
} from "../Utils/functions";
const Home = () => {
  const [restartModal, setRestartModal] = useState(false);
  const [quitModal, setQuitModal] = useState(false);
  const [finishModal, setFinishModal] = useState(true);
  const [personCell, setPersonCell] = useState({ row: 0, col: 0 });
  const [sweetCells, setSweetCells] = useState([]);
  const [time, setTime] = useState(0);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [direction, setDirection] = useState("right");
  const [isGameStarted, setIsGameStarted] = useState(false); // New state variable
  const [isGameStopped, setIsGameStopped] = useState(false); // New state variable
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState(""); // Add a new state variable for the last command
  const [hasReceivedCommand, setHasReceivedCommand] = useState(false); // Track if a command has been received
  const { gridSize, speed } = useContext(GridContext);
  const { width, height } = gridSize;
  console.log(hasReceivedCommand);
  // Generating Rows And columns for collector and object and checking that while generating they will not collide
  useEffect(() => {
    const { collectorObject, sweetCells } = generateCells({ width, height });
    console.log(collectorObject);
    setPersonCell(personCell);
    setSweetCells(sweetCells);
  }, [width, height, setPersonCell, setSweetCells]);

  // Calculate cell Size And Icon Size
  const { cellSize, iconSize } = calculateSizes(width, height);

  // collector consuming the Objects
  // it creates a new array and check whether object and collector are not on
  // the same row and column and show only those who are not on the same row and column
  const consumingObjects = () => {
    setSweetCells((prevSweetCells) =>
      prevSweetCells.filter(
        (sweetCell: any) =>
          sweetCell.row !== personCell.row || sweetCell.col !== personCell.col
      )
    );
    // Check if all sweet cells are eaten
    if (sweetCells.length === 0) {
      setIsGameFinished(true);
    }
  };
  // useEffect for collectors consuming the Objects
  useEffect(() => {
    consumingObjects();
  }, [personCell, setSweetCells]);

  // Game clock (Required time to complete the game)
  useEffect(() => {
    // Start the timer
    const timer = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);
    // Stop the timer when the game is finished
    if (isGameFinished || isGameStopped) {
      clearInterval(timer);
    }
    // Cleanup the timer on component unmount
    return () => clearInterval(timer);
  }, [isGameFinished, isGameStopped]);

  // Connection Through WebSocket
  useEffect(() => {
    connectWebsocket();
    const getDataTimer = setInterval(() => {
      const spokenValue = getData();
      if (spokenValue.length > 0 && spokenValue !== lastCommand) {
        setLastCommand(spokenValue); // Update the last command state with the spoken value
        setHasReceivedCommand(true); // Set the flag to indicate a new command has been received
      }
      if (spokenValue.length > 0) {
        if (spokenValue == "Go" || spokenValue == "go") {
          startGame();
        } else if (spokenValue == "Stop" || spokenValue == "stop") {
          stopGame();
        } else {
          setDirection(spokenValue);
        }
      }
    }, 1000);
    // getDataTimer();
    const handleKeyPress = (event: any) => {
      // Check arrow key pressed and update direction accordingly
      switch (event.key) {
        case "ArrowUp":
          setDirection("up");
          break;
        case "ArrowDown":
          setDirection("down");
          break;
        case "ArrowLeft":
          setDirection("left");
          break;
        case "ArrowRight":
          setDirection("right");
          break;
        default:
          break;
      }
    };
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
      stopMicrophoneCapture();
      clearInterval(getDataTimer);
    };
  }, [lastCommand]);

  // This useEffect will continue the direction of the collector
  useEffect(() => {
    const moveIcon = setInterval(() => {
      if (isGameStarted && !isGameFinished && !isGameStopped) {
        setPersonCell((prevCell) =>
          movePersonCell({
            prevCell,
            direction,
            width,
            height,
            isGameStarted,
            isGameFinished,
            isGameStopped,
            speed,
          })
        );
      }
    }, speed);

    return () => clearInterval(moveIcon);
  }, [
    direction,
    width,
    height,
    isGameStarted,
    isGameFinished,
    isGameStopped,
    speed,
  ]);

  // Stores the High Scores
  useEffect(() => {
    const gameData = {
      isGameFinished,
      time,
      gridSize,
    };
    const updatedGameData = handleStoreGameData(gameData);
    console.log(updatedGameData);
  }, [isGameFinished, time, gridSize]);
  // to start the game
  const startGame = () => {
    console.log("Game Started....");
    setIsListening(true);
    setIsGameStarted(true);
    setIsGameFinished(false);
    setTime(0);
  };

  // to stop the game
  const stopGame = () => {
    setIsGameStarted((prevValue) => !prevValue);
    setIsGameStopped((prevValue) => !prevValue);
  };

  return (
    <>
      <div className="mainContainer">
        <h1 id="text3d">Game On!</h1>
        <div className="header">
          <div className="tablehead">
            <h2>
              {isListening
                ? "Listening..."
                : "Start: Say 'Go' or press 'Start'"}
            </h2>
            {/* Remove the "Start" button when the game is started */}
            {!isGameStarted && !isGameStopped && (
              <button className="start--button" onClick={startGame}>
                Start
              </button>
            )}
            {!isGameStarted && isGameStopped && (
              <button className="start--button" onClick={stopGame}>
                Resume
              </button>
            )}
            {isGameStarted && !isGameStopped && (
              <button className="start--button" onClick={stopGame}>
                Pause
              </button>
            )}

            <div>
              <div className="timing">
                <p>{formatTime(time)}</p>
              </div>
            </div>
            <div>
              <div className="score">
                <p>Last Command : {lastCommand}</p>
              </div>
            </div>
          </div>
          <div className="grid-container">
            {Array.from({ length: height }, (_, row) => (
              <div className="grid-row" key={row}>
                {Array.from({ length: width }, (_, col) => {
                  const isPersonCell =
                    personCell.row === row && personCell.col === col;
                  const isSweetCell = sweetCells.some(
                    (pos: any) => pos.row === row && pos.col === col
                  );
                  return (
                    <div
                      className={`grid-cell${
                        isPersonCell ? " with-person" : ""
                      }${isSweetCell ? " with-sweet" : ""}`}
                      style={{ width: cellSize, height: cellSize }}
                      key={col}
                    >
                      {isPersonCell && (
                        <div className="person-icon">
                          <FiArrowRight
                            size={iconSize}
                            className={`arrow-icon ${direction}`} // Add the direction as a class
                            style={{
                              backgroundColor: "red",
                              transform: `rotate(${getRotationAngle(
                                direction
                              )}deg)`,
                            }} // Apply rotation based on direction
                          />
                        </div>
                      )}
                      {isSweetCell && (
                        <AiFillApple
                          size={iconSize}
                          className="sweet-icon"
                          style={{
                            color: "black",
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          <div className="settingLogo">
            {sweetCells.length === 0 && isGameStarted && !isGameStopped && (
              <Modal
                width="40rem"
                isOpen={finishModal}
                onClose={() => setFinishModal(false)}
              >
                <Finish
                  scoreSent={time}
                  onClose={() => setFinishModal(false)}
                />
              </Modal>
            )}
            <button className="restartIcon" onClick={() => setQuitModal(true)}>
              <span className="play-icon">
                <IoMdArrowRoundBack size={50} style={{ color: "white" }} />
                <span className="play-text">Click here to quit</span>
              </span>
            </button>
            <Modal
              width="40rem"
              isOpen={quitModal}
              onClose={() => setQuitModal(false)}
            >
              <Quit onClose={() => setQuitModal(false)} />
            </Modal>
            <button
              className="restartIcon"
              onClick={() => setRestartModal(true)}
            >
              <span className="play-icon">
                <MdOutlineRestartAlt size={50} style={{ color: "white" }} />
                <span className="play-text">Click here to restart</span>
              </span>
            </button>
            <Modal
              width="40rem"
              isOpen={restartModal}
              onClose={() => setRestartModal(false)}
            >
              <Restart onClose={() => setRestartModal(false)} />
            </Modal>
            <Link to="/">
              <span className="play-icon">
                <FcSettings size={40} className="play-icon-inner" />
                <span className=" play-text">Click here for settings</span>
              </span>
            </Link>
            <Link to="/highscore">
              <span className="play-icon">
                <TbScoreboard size={40} className="play-icon-inner" />
                <span className=" play-text">Click here for leaderboard</span>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
export default Home;
