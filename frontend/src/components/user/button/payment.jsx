import React, { useState } from 'react';
import PaymentOptionsModal from '../paymentop';
import './BuyPremiumButton.css'; // Import custom styles

const BuyPremiumButton = () => {
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => {
    setShowModal(true);
  };

  return (
    <div className="buy-premium-container">
      <button className="buy-premium-button" onClick={handleShowModal}>
        Buy Premium
      </button>
      {showModal && <PaymentOptionsModal closeModal={() => setShowModal(false)} />}
    </div>
  );
};

export default BuyPremiumButton;
