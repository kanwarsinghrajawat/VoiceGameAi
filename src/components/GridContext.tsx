import { createContext, useState } from "react";
export const GridContext = createContext({
  gridSize: { width: 16, height: 16 },
  updateGridSize: (width: number, height: number) => {
    console.log(width, height);
  },
  speed: 500,
  updateSpeed: (newSpeed: number) => {
    console.log(newSpeed);
  },
  spokenValue: "",
});
export const GridProvider = ({ children }: any) => {
  const [gridSize, setGridSize] = useState({ width: 16, height: 16 });
  const [speed, setSpeed] = useState(200); // Default speed value
  const [spokenValue, setSpokenValue] = useState("");
  console.log(setSpokenValue);

  const updateGridSize = (width: number, height: number) => {
    setGridSize({ width, height });
  };
  const updateSpeed = (newSpeed: any) => {
    setSpeed(newSpeed);
  };
  return (
    <GridContext.Provider
      value={{ gridSize, updateGridSize, speed, updateSpeed, spokenValue }}
    >
      {children}
    </GridContext.Provider>
  );
};
