import React, { useState } from 'react';

const TrackingTable = () => {
  const [meds, setMeds] = useState([]);
  const [medicineName, setMedicineName] = useState('');
  const [time, setTime] = useState('');

  const addMedicine = () => {
    if (medicineName && time) {
      setMeds([...meds, { name: medicineName, time }]);
      setMedicineName('');
      setTime('');
    }
  };

  return (
    <div className="tracking-table">
      <h2>Medicine Tracking Table</h2>
      <div>
        <input
          type="text"
          placeholder="Medicine Name"
          value={medicineName}
          onChange={(e) => setMedicineName(e.target.value)}
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
        <button onClick={addMedicine}>Add Medicine</button>
      </div>

      {meds.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Medicine Name</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {meds.map((med, index) => (
              <tr key={index}>
                <td>{med.name}</td>
                <td>{med.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No medicines added yet.</p>
      )}
    </div>
  );
};

export default TrackingTable;
