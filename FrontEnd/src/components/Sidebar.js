import React from 'react';

const Sidebar = ({ setActiveSection, activeSection }) => {
  const navLinks = [
    "Ingredients",
    "Dosage",
    "Side Effects",
    "Who Should Avoid",
    "Severity Dosage",
    "Indications", // Added Indications
    "Tracking Table",
  ];

  return (
    <div className="sidebar">
      <h2>Navigation</h2>
      <ul>
        {navLinks.map((link) => (
          <li
            key={link}
            className={activeSection === link ? 'active' : ''}
            onClick={() => setActiveSection(link)}
          >
            {link}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
