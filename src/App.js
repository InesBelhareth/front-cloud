import React, { useState, useEffect } from 'react';
import './App.css';
import FormComponent from './components/FormComponent';
import DataDisplay from './components/DataDisplay';

function App() {
  const [submissions, setSubmissions] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchData();
  }, [refreshTrigger]);

  const fetchData = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/submissions`);

      if (!response.ok) {
        throw new Error(`Server Error: ${response.status}`);
      }

      const data = await response.json();
      setSubmissions(data);

    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
    }
  };

  const handleFormSubmit = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="App">
      <div className="container">
        <h1>📋 Formulaire Simple</h1>
        <FormComponent onSubmit={handleFormSubmit} />
        <DataDisplay submissions={submissions} apiUrl={apiUrl} />
      </div>
    </div>
  );
}

export default App;
