import React from 'react';

function Modal(props) {
  return (
    <>
      <div className={props.showModal ? 'modal active' : 'modal'}>
        <div className="modal-content">{props.children}</div>;
      </div>
    </>
  );
}

export default Modal;
