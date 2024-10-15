import React from 'react'
import Modal from 'react-modal';


const CustomModal = ({ isOpen, closeModal, children }) => {
    Modal.setAppElement('body');

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={closeModal}
            overlayClassName="custom-modal--overlay"
            style={{
                content: {
                    top: '50%',
                    left: '50%',
                    right: 'auto',
                    bottom: 'auto',
                    marginRight: '-50%',
                    transform: 'translate(-50%, -50%)',
                    padding: '0',
                    border: 'none',
                    borderRadius: '6px',
                    background: 'transparent',
                }
            }}
        >
            {children}
        </Modal>
    )
}

export default CustomModal