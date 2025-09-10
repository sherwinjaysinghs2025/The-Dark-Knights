import React, { useState, useCallback } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import TrackingTable from './components/TrackingTable';
import GetHelpButton from './components/GetHelpButton'; // Import GetHelpButton
// Removed LoginPage and RegisterPage imports

function App() {
  const [medicineName, setMedicineName] = useState('');
  const [medicineData, setMedicineData] = useState(null);
  const [suggestions, setSuggestions] = useState([]); // New state for autocomplete suggestions
  const [showSuggestions, setShowSuggestions] = useState(false); // New state to control suggestion dropdown visibility
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("Ingredients");
  const [showUserInfo, setShowUserInfo] = useState(false); // New state for user info toggle
  // Removed isLoggedIn and currentPage states

  const fetchSuggestions = async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/medicines/search?query=${query}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setSuggestions(data);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Debounce function (simple implementation for demonstration)
  const debounce = (func, delay) => {
    let timeout;
    return function(...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), delay);
    };
  };

  const debouncedFetchSuggestions = useCallback(debounce(fetchSuggestions, 300), []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setMedicineName(value);
    debouncedFetchSuggestions(value);
  };

  const handleSelectSuggestion = (suggestion) => {
    setMedicineName(suggestion);
    setSuggestions([]);
    setShowSuggestions(false);
    fetchMedicineData(suggestion); // Fetch full data for selected suggestion
  };

  const fetchMedicineData = async (nameToFetch = medicineName) => {
    if (!nameToFetch) {
      setError("Please enter a medicine name.");
      setMedicineData(null);
      return;
    }
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/api/medicine/${nameToFetch}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      setMedicineData(data);
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
        <div className="header-title-section"> {/* New container for title and tagline */}
          <h1>
            <span className="plus-symbol">+</span>MEDaware
          </h1>
          <p className="tagline">Search.Learn.Stay Safe</p>
        </div>
        <div className="search-bar-container">
          <input
            type="text"
            placeholder="Enter medicine name (e.g., Paracetamol)"
            value={medicineName}
            onChange={handleInputChange}
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="suggestions-dropdown">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="suggestion-item"
                  onClick={() => handleSelectSuggestion(suggestion)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
          <button onClick={() => fetchMedicineData()}>Get Info</button>
        </div>
        {/* Removed logo img tag */}
        {/* Profile display button and dropdown remain absolutely positioned for now */}
        <button className="profile-display" onClick={toggleUserInfo}>
          <span role="img" aria-label="user-icon">👤</span> Profile
        </button>
        {showUserInfo && (
          <div className="user-info-dropdown">
            <div className="dropdown-item">View Profile</div>
            <div className="dropdown-item">Settings</div>
            <div className="dropdown-item">Log Out</div>
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
