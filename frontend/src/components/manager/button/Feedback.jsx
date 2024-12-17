import React, { useState } from "react";
import FeedbackList from "../feedbacklist";
import Modal from "react-modal"; // Use if you installed react-modal

const FeedBackBtn = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <button onClick={openModal}>Feedback</button>
      
      <Modal 
        isOpen={isModalOpen} 
        onRequestClose={closeModal} 
        contentLabel="Feedback Modal"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)"
          },
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            maxHeight: "90%",
            overflowY: "auto"
          }
        }}
      >
        <button onClick={closeModal} style={{ float: "right" }}>Close</button>
        <FeedbackList />
      </Modal>
    </div>
  );
};

export default FeedBackBtn;
