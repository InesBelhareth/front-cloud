import React, { useState, useEffect } from 'react';
import './App.css';
import FormComponent from './components/FormComponent';
import DataDisplay from './components/DataDisplay';

function App() {
  const [submissions, setSubmissions] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fallback important
  const apiUrl =  'http://internal-alb-backend-514255031.us-east-1.elb.amazonaws.com';

  useEffect(() => {
    fetchData();
  }, [refreshTrigger]);

  const fetchData = async () => {
    try {
      const response = await fetch(`http://internal-alb-backend-514255031.us-east-1.elb.amazonaws.com/api/submissions`);

      if (!response.ok) {
        throw new Error(`Server Error: ${response.status}`);
      }

      const data = await response.json();

      // sécurité si backend renvoie autre chose
      if (Array.isArray(data)) {
        setSubmissions(data);
      } else {
        console.warn("Data non valide:", data);
        setSubmissions([]);
      }

    } catch (error) {
      console.error('Erreur récupération données:', error);
      setSubmissions([]);
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

        <DataDisplay 
          submissions={submissions} 
          apiUrl={apiUrl} 
        />
      </div>
    </div>
  );
}

export default App;
