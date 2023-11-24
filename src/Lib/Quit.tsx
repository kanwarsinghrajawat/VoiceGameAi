import { Link } from "react-router-dom";

const Quit = ({ onClose }: { onClose: () => void }) => {
  return (
    <>
      {" "}
      <div className="restartModal">
        <h2>Are you sure you want to quit the game ?</h2>
        <div className="modalBtns">
          <Link to="/" onClick={onClose} className="btn yesBtn widtBtn">
            Yes{" "}
          </Link>
          <button onClick={onClose} className="btn saveBtn widtBtn">
            No{" "}
          </button>
        </div>
      </div>
    </>
  );
};

export default Quit;
