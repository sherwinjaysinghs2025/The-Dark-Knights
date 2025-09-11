// frontend/src/App.js

import React, { useState, useCallback } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import TrackingTable from './components/TrackingTable';
import GetHelpButton from './components/GetHelpButton'; // Import GetHelpButton

function App() {
  const [medicineName, setMedicineName] = useState('');
  const [medicineData, setMedicineData] = useState(null);
  const [suggestions, setSuggestions] = useState([]); // New state for autocomplete suggestions
  const [showSuggestions, setShowSuggestions] = useState(false); // New state to control suggestion dropdown visibility
  const [chatQuery, setChatQuery] = useState(''); // New state for chatbot input
  const [chatResponse, setChatResponse] = useState(''); // New state for chatbot response
  const [medicineSummary, setMedicineSummary] = useState(null); // New state for LLM medicine summary
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("Ingredients");
  const [showUserInfo, setShowUserInfo] = useState(false); // New state for user info toggle

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

  const debounce = (func, delay) => {
    let timeout;
    return function(...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), delay);
    };
  };

  const debouncedFetchSuggestions = useCallback(debounce(fetchSuggestions, 300), [fetchSuggestions]);

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

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatQuery.trim()) return;

    setChatResponse('Thinking...');
    try {
      const response = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: chatQuery }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setChatResponse(data.response);
    } catch (err) {
      console.error("Error communicating with chatbot:", err);
      setChatResponse('Error: Could not get a response from the chatbot.');
    }
  };

  const fetchMedicineData = async (nameToFetch = medicineName) => {
    if (!nameToFetch) {
      setError("Please enter a medicine name.");
      setMedicineData(null);
      setMedicineSummary(null);
      return;
    }
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/api/medicine/${nameToFetch}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      setMedicineData(data); // This now contains medicineName and summary
      setMedicineSummary(data.summary); // Store the summary explicitly
    } catch (err) {
      setError(err.message);
      setMedicineData(null);
      setMedicineSummary(null);
    }
  };

  const toggleUserInfo = () => {
    setShowUserInfo(!showUserInfo);
  };

  return (
    <div className="App">
      <div className="header">
        <div className="header-title-section">
          <h1>
            <span className="plus-symbol">+</span>MEDaware
          </h1>
          <p className="tagline">Search.Learn.Stay Safe</p>
        </div>
        <div className="search-bar-container">
          <input
            type="text"
            placeholder="Enter medicine name"
            value={medicineName}
            onChange={handleInputChange}
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="suggestions-dropdown">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="suggestion-item"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectSuggestion(suggestion);
                  }}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
          <button onClick={() => fetchMedicineData()}>Get Info</button>
        </div>

        {error && <p className="error-message">Error: {error}</p>}

        <div className="chatbot-container">
          <h3>Chat with MEDaware AI</h3>
          <form onSubmit={handleChatSubmit} className="chatbot-form">
            <input
              type="text"
              placeholder="Ask me about medicines or symptoms..."
              value={chatQuery}
              onChange={(e) => setChatQuery(e.target.value)}
            />
            <button type="submit">Ask</button>
          </form>
          {chatResponse && <p className="chatbot-response">{chatResponse}</p>}
        </div>

        <button className="profile-display" onClick={toggleUserInfo}>
          <span role="img" aria-label="user-icon"></span> Profile
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
            <MainContent
              activeSection={activeSection}
              medicineData={medicineData}
              medicineName={medicineName}
              medicineSummary={medicineSummary}
            />
          )}
        </div>
      </div>

      <footer className="disclaimer">
        <p>This tool is for educational purposes only, not a substitute for professional medical advice.</p>
      </footer>
      <GetHelpButton />
    </div>
  );
}

export default App;
