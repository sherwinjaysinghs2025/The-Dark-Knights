import React from 'react';

const MainContent = ({ activeSection, medicineData, medicineName, symptomLLMSuggestions }) => {
  console.log("MainContent - activeSection:", activeSection);
  console.log("MainContent - medicineData:", medicineData);
  console.log("MainContent - symptomLLMSuggestions:", symptomLLMSuggestions);
  // Determine the primary data source. If symptomLLMSuggestions is active, prioritize its summary.
  // If medicineData is active, use its structure directly as it contains both summary and detailed fields.
  const displayData = symptomLLMSuggestions?.summary
    ? { medicineName: symptomLLMSuggestions.query, summary: symptomLLMSuggestions.summary, relevantData: symptomLLMSuggestions.relevantData }
    : medicineData;

  if (!displayData || (!displayData.summary && (!displayData.ingredients && !displayData.relevantData))) {
    return <div className="main-content">Please search for a medicine or symptom to see details.</div>;
  }

  const sectionImages = {
    "Ingredients": "https://via.placeholder.com/150/0000FF/FFFFFF?text=Ingredients",
    "Dosage": "https://via.placeholder.com/150/FF0000/FFFFFF?text=Dosage",
    "Side Effects": "https://via.placeholder.com/150/008000/FFFFFF?text=Side+Effects",
    "Who Should Avoid": "https://via.placeholder.com/150/FFFF00/000000?text=Avoid",
    "Severity Dosage": "https://via.placeholder.com/150/FFA500/FFFFFF?text=Severity",
    "Indications": "https://via.placeholder.com/150/800080/FFFFFF?text=Indications",
    "Tracking Table": "https://via.placeholder.com/150/00FFFF/000000?text=Tracking"
  };

  const renderContent = () => {
    // If symptomLLMSuggestions is active, display its overall summary as the primary content.
    if (symptomLLMSuggestions?.summary) {
      return (
        <div className="info-card">
          <h4>Symptom Information for "{displayData.medicineName}":</h4>
          {sectionImages[activeSection] && <img src={sectionImages[activeSection]} alt={activeSection} className="section-image" />}
          <p>{displayData.summary}</p>
          {/* Optionally, display relevantData here if a more detailed breakdown for symptoms is desired */}
          {/* For now, the overall summary for the symptom seems most appropriate. */}
        </div>
      );
    }

    // If medicineData is active, render specific sections or fall back to summary
    if (medicineData) {
      switch (activeSection) {
        case "Ingredients":
          if (Array.isArray(medicineData.ingredients) && medicineData.ingredients.length > 0) {
            return (
              <div className="info-card">
                <h4>Ingredients:</h4>
                <img src={sectionImages["Ingredients"]} alt="Ingredients" className="section-image" />
                <ul>
                  {medicineData.ingredients.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            );
          } else if (medicineData.summary) {
            return (
              <div className="info-card">
                <h4>Ingredients (Summary):</h4>
                <img src={sectionImages["Ingredients"]} alt="Ingredients" className="section-image" />
                <p>{medicineData.summary}</p>
              </div>
            );
          }
          break;
        case "Dosage":
          if (Array.isArray(medicineData.dosage_and_administration) && medicineData.dosage_and_administration.length > 0) {
            return (
              <div className="info-card">
                <h4>Dosage and Administration:</h4>
                <img src={sectionImages["Dosage"]} alt="Dosage" className="section-image" />
                <ul>
                  {medicineData.dosage_and_administration.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            );
          } else if (medicineData.summary) {
            return (
              <div className="info-card">
                <h4>Dosage (Summary):</h4>
                <img src={sectionImages["Dosage"]} alt="Dosage" className="section-image" />
                <p>{medicineData.summary}</p>
              </div>
            );
          }
          break;
        case "Side Effects":
          if (Array.isArray(medicineData.adverse_reactions) && medicineData.adverse_reactions.length > 0) {
            return (
              <div className="info-card">
                <h4>Adverse Reactions (Side Effects):</h4>
                <img src={sectionImages["Side Effects"]} alt="Side Effects" className="section-image" />
                <ul>
                  {medicineData.adverse_reactions.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            );
          } else if (medicineData.summary) {
            return (
              <div className="info-card">
                <h4>Side Effects (Summary):</h4>
                <img src={sectionImages["Side Effects"]} alt="Side Effects" className="section-image" />
                <p>{medicineData.summary}</p>
              </div>
            );
          }
          break;
        case "Who Should Avoid": // Corresponds to warnings
          if (Array.isArray(medicineData.warnings) && medicineData.warnings.length > 0) {
            return (
              <div className="info-card">
                <h4>Warnings (Who Should Avoid):</h4>
                <img src={sectionImages["Who Should Avoid"]} alt="Who Should Avoid" className="section-image" />
                <ul>
                  {medicineData.warnings.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            );
          } else if (medicineData.summary) {
            return (
              <div className="info-card">
                <h4>Who Should Avoid (Summary):</h4>
                <img src={sectionImages["Who Should Avoid"]} alt="Who Should Avoid" className="section-image" />
                <p>{medicineData.summary}</p>
              </div>
            );
          }
          break;
        case "Indications":
          if (Array.isArray(medicineData.indications_and_usage) && medicineData.indications_and_usage.length > 0) {
            return (
              <div className="info-card">
                <h4>Indications and Usage:</h4>
                <img src={sectionImages["Indications"]} alt="Indications" className="section-image" />
                <ul>
                  {medicineData.indications_and_usage.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            );
          } else if (medicineData.summary) {
            return (
              <div className="info-card">
                <h4>Indications (Summary):</h4>
                <img src={sectionImages["Indications"]} alt="Indications" className="section-image" />
                <p>{medicineData.summary}</p>
              </div>
            );
          }
          break;
        case "Severity Dosage": // This is a custom section, not directly from OpenFDA
          if (medicineData.summary) {
            return (
              <div className="info-card">
                <h4>Severity Dosage (Summary):</h4>
                <img src={sectionImages["Severity Dosage"]} alt="Severity Dosage" className="section-image" />
                <p>{medicineData.summary}</p>
              </div>
            );
          }
          return (
            <div className="info-card">
              <h4>Severity Dosage:</h4>
              <img src={sectionImages["Severity Dosage"]} alt="Severity Dosage" className="section-image" />
              <p>Severity-based dosage information is not directly available from OpenFDA. Please refer to the general dosage information or the medicine summary.</p>
            </div>
          );
        case "Tracking Table":
            return (
                <div className="info-card">
                    <h4>Tracking Table:</h4>
                    <img src={sectionImages["Tracking Table"]} alt="Tracking Table" className="section-image" />
                    <p>This section is for managing your medicine schedule. Functionality to be implemented.</p>
                </div>
            );
        default:
          // For any other active section, or if no specific data, display the overall summary
          if (medicineData.summary) {
            return (
              <div className="info-card">
                <h4>{activeSection} Overview:</h4>
                {sectionImages[activeSection] && <img src={sectionImages[activeSection]} alt={activeSection} className="section-image" />}
                <p>{medicineData.summary}</p>
              </div>
            );
          }
          return <p>Select a section from the sidebar.</p>;
      }
    }

    return <p>Select a section from the sidebar.</p>;
  };

  return (
    <div className="main-content">
      {displayData?.medicineName && <h2>{displayData.medicineName}</h2>}
      {renderContent()}
    </div>
  );
};

export default MainContent;
