import React, { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import TrackingTable from './components/TrackingTable';
import GetHelpButton from './components/GetHelpButton'; // Import GetHelpButton
// Removed LoginPage and RegisterPage imports

function App() {
  const [medicineName, setMedicineName] = useState('');
  const [medicineData, setMedicineData] = useState(null);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("Ingredients");
  const [showUserInfo, setShowUserInfo] = useState(false); // New state for user info toggle
  // Removed isLoggedIn and currentPage states

  const fetchMedicineData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/medicine/${medicineName}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      setMedicineData(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setMedicineData(null);
    }
  };

  const toggleUserInfo = () => {
    setShowUserInfo(!showUserInfo);
  };

  // Removed handleLoginSuccess, handleNavigateToRegister, handleBackToLogin functions

  return (
    <div className="App">
      <div className="header">
        <div> {/* Group title and search bar */}
          <h1>
            <span className="plus-symbol">+</span>MEDaware
          </h1>
          <div className="input-section">
            <input
              type="text"
              placeholder="Enter medicine name (e.g., Paracetamol)"
              value={medicineName}
              onChange={(e) => setMedicineName(e.target.value)}
            />
            <button onClick={fetchMedicineData}>Get Info</button>
          </div>
        </div>
        {/* Removed logo img tag */}
        {/* Profile display button and dropdown remain absolutely positioned for now */}
        <button className="profile-display" onClick={toggleUserInfo}>Profile</button>
        {showUserInfo && (
          <div className="user-info-dropdown">
            <p>Email: user@example.com</p>
          </div>
        )}
      </div>

      <div className="content-area">
        <Sidebar setActiveSection={setActiveSection} activeSection={activeSection} />
        <div className="main-content-wrapper">
          {activeSection === "Tracking Table" ? (
            <TrackingTable />
          ) : (
            <MainContent activeSection={activeSection} medicineData={medicineData} medicineName={medicineName} />
          )}
        </div>
      </div>

      <footer className="disclaimer">
        <p>This tool is for educational purposes only, not a substitute for professional medical advice.</p>
      </footer>
      <GetHelpButton /> {/* Add GetHelpButton */}
    </div>
  );
}

export default App;
