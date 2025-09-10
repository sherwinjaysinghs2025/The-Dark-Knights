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
      <nav>
        <ul>
          {navLinks.map((link) => (
            <li key={link}>
              <button
                className={activeSection === link ? 'active' : ''}
                onClick={() => setActiveSection(link)}
              >
                <span className="sidebar-icon">📋</span> {link}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
