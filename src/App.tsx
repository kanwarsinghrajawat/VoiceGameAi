import { Routes, Route } from "react-router-dom";
import { GridProvider } from "../src/components/GridContext";
import HighScore from "./components/HighScore";
import Settings from "./components/Settings";
import Home from "./components/Home";

const App = () => {
  return (
    <GridProvider>
      <Routes>
        <Route path="/">
          <Route index element={<Settings />} />
          <Route path="highscore" element={<HighScore />} />
          <Route path="home" element={<Home />} />
        </Route>
      </Routes>
    </GridProvider>
  );
};

export default App;
