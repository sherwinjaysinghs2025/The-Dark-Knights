import React, { useState } from 'react';
import '../App.css';

const GetHelpButton = () => {
  const [showContact, setShowContact] = useState(false);

  const toggleContact = () => {
    setShowContact(!showContact);
  };

  return (
    <div className="get-help-container">
      <button className="get-help-button" onClick={toggleContact}>
        <span>GET</span>
        <span>HELP</span>
      </button>
      {showContact && (
        <div className="help-contact-info">
          <p>Contact us at:</p>
          <p><strong>MEDaware@helpdesk.com</strong></p>
        </div>
      )}
    </div>
  );
};

export default GetHelpButton;
