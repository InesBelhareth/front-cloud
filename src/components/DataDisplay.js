import React from 'react';
import './DataDisplay.css';

function DataDisplay({ submissions }) {
  return (
    <div className="data-display">
      <h2>📊 Données Reçues</h2>
      {submissions.length === 0 ? (
        <p className="no-data">Aucune donnée reçue pour le moment</p>
      ) : (
        <div className="submissions-list">
          {submissions.map((submission, index) => (
            <div key={index} className="submission-card">
              <div className="submission-header">
                <h3>{submission.name}</h3>
                <span className="submission-date">
                  {new Date(submission.created_at).toLocaleDateString('fr-FR')}
                </span>
              </div>
              <p><strong>Email:</strong> {submission.email}</p>
              <p><strong>Message:</strong> {submission.message}</p>
              {submission.image && (
                <div className="submission-image">
                  <img 
                    src={`http://localhost:5000/${submission.image}`} 
                    alt="Uploaded" 
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DataDisplay;
