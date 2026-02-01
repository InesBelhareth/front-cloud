import React, { useState } from 'react';
import axios from 'axios';
import './FormComponent.css';

function FormComponent({ onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      setErrorMessage('Tous les champs sont obligatoires!');
      return;
    }


    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const form = new FormData();
      form.append('name', formData.name);
      form.append('email', formData.email);
      form.append('message', formData.message);
      form.append('image', image);

    // Utilisation de la variable d'environnement pour l'URL de l'ALB
const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const response = await axios.post(`${apiUrl}/api/submit`, form, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});

if (!response.ok) {
  throw new Error(`Erreur serveur: ${response.status} ${response.statusText}`);
}

const data = await response.json();
console.log('Data returned:', data);
      setSuccessMessage('✅ Formulaire envoyé avec succès!');
      setFormData({ name: '', email: '', message: '' });
      setImage(null);
      setImagePreview(null);
      
      setTimeout(() => {
        setSuccessMessage('');
        onSubmit();
      }, 1500);
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrorMessage('❌ Erreur lors de l\'envoi du formulaire');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Nom:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Entrez votre nom"
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Entrez votre email"
        />
      </div>

      <div className="form-group">
        <label htmlFor="message">Message:</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          placeholder="Entrez votre message"
          rows="4"
        ></textarea>
      </div>

      <div className="form-group">
        <label htmlFor="image">Image:</label>
        <input
          type="file"
          id="image"
          onChange={handleImageChange}
          accept="image/*"
          className="file-input"
        />
      </div>

      {imagePreview && (
        <div className="image-preview">
          <img src={imagePreview} alt="Aperçu" />
        </div>
      )}

      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <button 
        type="submit" 
        className="submit-button"
        disabled={loading}
      >
        {loading ? 'Envoi...' : 'Envoyer'}
      </button>
    </form>
  );
}

export default FormComponent;
