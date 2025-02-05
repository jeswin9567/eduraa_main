import React, { useState } from 'react';
import PaymentOptionsModal from '../paymentop';
import './BuyPremiumButton.css'; // Import custom styles
import Swal from 'sweetalert2';

const BuyPremiumButton = ({ entranceField }) => {
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => {
    if (!entranceField) {
      Swal.fire({
        title: 'Error!',
        text: 'Please select your entrance field before purchasing premium.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
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
