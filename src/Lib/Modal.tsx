import React from "react";
import { CSSTransition } from "react-transition-group";
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: string;
}
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, width }) => {
  const nodeRef = React.useRef(null);
  return (
    <CSSTransition
      in={isOpen}
      nodeRef={nodeRef}
      classNames="modal"
      timeout={300}
      unmountOnExit
    >
      <div onClick={onClose} className="modal__overlay">
        <div
          style={{ width: width }}
          className="model__content"
          onClick={(e) => e.stopPropagation()}
          ref={nodeRef}
        >
          {children}
        </div>
      </div>
    </CSSTransition>
  );
};
export default Modal;
