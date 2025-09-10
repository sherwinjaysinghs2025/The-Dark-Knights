import React from 'react';

const MainContent = ({ activeSection, medicineData, medicineName }) => {
  if (!medicineData) {
    return <div className="main-content">Please search for a medicine to see details.</div>;
  }

  const sectionImages = {
    "Ingredients": "https://via.placeholder.com/150/0000FF/FFFFFF?text=Ingredients",
    "Dosage": "https://via.placeholder.com/150/FF0000/FFFFFF?text=Dosage",
    "Side Effects": "https://via.placeholder.com/150/008000/FFFFFF?text=Side+Effects",
    "Who Should Avoid": "https://via.placeholder.com/150/FFFF00/000000?text=Avoid",
    "Severity Dosage": "https://via.placeholder.com/150/FFA500/FFFFFF?text=Severity",
    "Indications": "https://via.placeholder.com/150/800080/FFFFFF?text=Indications",
  };

  const renderContent = () => {
    switch (activeSection) {
      case "Ingredients":
        return (
          <div className="info-card">
            <h4>Ingredients:</h4>
            <img src={sectionImages["Ingredients"]} alt="Ingredients" className="section-image" />
            <ul>
              {Array.isArray(medicineData.ingredients) && medicineData.ingredients.length > 0 ? (
                medicineData.ingredients.map((item, index) => (
                  <li key={index}>{item}</li>
                ))
              ) : (
                <li>{medicineData.ingredients}</li>
              )}
            </ul>
          </div>
        );
      case "Dosage":
        return (
          <div className="info-card">
            <h4>Dosage:</h4>
            <img src={sectionImages["Dosage"]} alt="Dosage" className="section-image" />
            <ul>
              <li>Normal: {medicineData.dosage.normal}</li>
            </ul>
          </div>
        );
      case "Side Effects":
        return (
          <div className="info-card">
            <h4>Side Effects:</h4>
            <img src={sectionImages["Side Effects"]} alt="Side Effects" className="section-image" />
            <ul>
              {Array.isArray(medicineData.side_effects) && medicineData.side_effects.length > 0 ? (
                medicineData.side_effects.map((item, index) => (
                  <li key={index}>{item}</li>
                ))
              ) : (
                <li>{medicineData.side_effects}</li>
              )}
            </ul>
            <h4>How to Tackle Side Effects:</h4>
            <ul>
              <li>{medicineData.how_to_tackle_side_effects.info}</li>
            </ul>
          </div>
        );
      case "Who Should Avoid":
        return (
          <div className="info-card">
            <h4>Who Should Avoid:</h4>
            <img src={sectionImages["Who Should Avoid"]} alt="Who Should Avoid" className="section-image" />
            <ul>
              {Array.isArray(medicineData.who_should_avoid) && medicineData.who_should_avoid.length > 0 ? (
                medicineData.who_should_avoid.map((item, index) => (
                  <li key={index}>{item}</li>
                ))
              ) : (
                <li>{medicineData.who_should_avoid}</li>
              )}
            </ul>
          </div>
        );
      case "Severity Dosage":
        return (
          <div className="info-card">
            <h4>Severity-based Dosage:</h4>
            <img src={sectionImages["Severity Dosage"]} alt="Severity Dosage" className="section-image" />
            <ul>
              <li>{medicineData.dosage.severity_based.info}</li>
            </ul>
          </div>
        );
      case "Indications": // New case for Indications
        return (
          <div className="info-card">
            <h4>Indications and Usage:</h4>
            <img src={sectionImages["Indications"]} alt="Indications" className="section-image" />
            <ul>
              {Array.isArray(medicineData.indications) && medicineData.indications.length > 0 ? (
                medicineData.indications.map((item, index) => (
                  <li key={index}>{item}</li>
                ))
              ) : (
                <li>{medicineData.indications}</li>
              )}
            </ul>
          </div>
        );
      default:
        return <p>Select a section from the sidebar.</p>;
    }
  };

  return (
    <div className="main-content">
      {medicineData.medicineName && <h2>{medicineData.medicineName}</h2>}
      {renderContent()}
    </div>
  );
};

export default MainContent;
