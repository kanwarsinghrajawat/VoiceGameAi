// Generating Random Rows And columns for collector and object and checking that while generating they will not collide
export const generateCells = ({ width, height }: any) => {
  const randomRow = Math.floor(Math.random() * height);
  const randomCol = Math.floor(Math.random() * width);
  const collectorObject = { row: randomRow, col: randomCol };
  const sweetIconCount = (width * height) / 8;
  const sweetPositions: any = [];
  while (sweetPositions.length < sweetIconCount) {
    const sweetRow = Math.floor(Math.random() * height);
    const sweetCol = Math.floor(Math.random() * width);
    if (
      (sweetRow !== randomRow || sweetCol !== randomCol) &&
      !sweetPositions.some(
        (pos: any) => pos.row === sweetRow && pos.col === sweetCol
      )
    ) {
      sweetPositions.push({ row: sweetRow, col: sweetCol });
    }
  }
  return { collectorObject, sweetCells: sweetPositions };
};

// calculate size of the icon and cell
export const calculateSizes = (width: any, height: any) => {
  let cellSize, iconSize;
  if (width === 4 && height === 4) {
    cellSize = "5.5rem";
    iconSize = 85;
  } else if (width === 8 && height === 8) {
    cellSize = "4.5rem";
    iconSize = 70;
  } else if (width === 12 && height === 12) {
    cellSize = "3.5rem";
    iconSize = 55;
  } else if (width === 16 && height === 16) {
    cellSize = "2.5rem";
    iconSize = 40;
  }
  return { cellSize, iconSize };
};

// // For rotating the arrow
export const getRotationAngle = (direction: string) => {
  switch (direction) {
    case "up":
      return -90;
    case "down":
      return 90;
    case "left":
      return 180;
    default:
      return 0;
  }
};

// // format time for Game timer and // // Format High Score Time
export const formatTime = (time: any, isHighScore: boolean = false) => {
  const date = new Date(time * 1000);
  const hours = isHighScore ? date.getUTCHours() : Math.floor(time / 3600);
  const minutes = isHighScore
    ? date.getUTCMinutes()
    : Math.floor((time % 3600) / 60);
  const seconds = isHighScore ? date.getUTCSeconds() : time % 60;
  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};

// This function  will continue the movement of the collector  once a direction command is issued
export function movePersonCell({
  prevCell,
  direction,
  width,
  height,

}: any) {
  let newRow = prevCell.row;
  let newCol = prevCell.col;
  // Update the position based on the current direction
  switch (direction) {
    case "up":
      newRow = Math.max(prevCell.row - 1, 0);
      break;
    case "down":
      newRow = Math.min(prevCell.row + 1, height - 1);
      break;
    case "left":
      newCol = Math.max(prevCell.col - 1, 0);
      break;
    case "right":
      newCol = Math.min(prevCell.col + 1, width - 1);
      break;
    default:
      break;
  }
  return { row: newRow, col: newCol };
}

// Function to handle storing game data and returning the updated game data
export const handleStoreGameData = (gameData: any) => {
  const { isGameFinished, time, gridSize } = gameData;
  if (isGameFinished && time && gridSize) {
    // Save the time and grid size in local storage
    localStorage.setItem("time", time.toString());
    localStorage.setItem("gridSize", JSON.stringify(gridSize));
    // Retrieve the existing game data from local storage
    const existingData = JSON.parse(localStorage.getItem("gameData") || "[]");
    // Add the current game data to the existing data
    const newData = {
      id: existingData.length + 1,
      gridSize: { ...gridSize },
      time: time.toString(),
    };
    // Update the game data array with the new data
    const updatedData = [...existingData, newData];
    // Store the updated game data in local storage
    localStorage.setItem("gameData", JSON.stringify(updatedData));
    // Return the updated game data
    return updatedData;
  }
  // Return null if the conditions are not met
  return null;
};
