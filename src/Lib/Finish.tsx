import { Link } from "react-router-dom";
import { formatTime } from "../Utils/functions";

const Finish = ({
  onClose,
  scoreSent,
}: {
  onClose: () => void;
  scoreSent: any;
}) => {
  const handlePlayAgainClick = () => {
    onClose();
    window.location.reload(); // Refresh the page
  };
  return (
    <>
      <div className="restartModal">
        <h2>Yay!! You completed the game in {formatTime(scoreSent)} time </h2>
        <div className="modalBtns">
          <Link
            to="/home"
            onClick={handlePlayAgainClick}
            className="btn yesBtn widtBtn"
          >
            Play again
          </Link>
          <Link to="/" onClick={onClose} className="btn yesBtn widtBtn">
            Quit
          </Link>
        </div>
      </div>
    </>
  );
};

export default Finish;
