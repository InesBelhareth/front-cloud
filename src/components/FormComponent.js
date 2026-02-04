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

  const apiUrl =  'http://internal-alb-backend-514255031.us-east-1.elb.amazonaws.com';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
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

      if (image) {
        form.append('image', image);
      }

      const response = await axios.post(
        `${apiUrl}/api/submit`,
        form
      );

      console.log('Data returned:', response.data);

      setSuccessMessage('✅ Formulaire envoyé avec succès!');
      setFormData({ name: '', email: '', message: '' });
      setImage(null);
      setImagePreview(null);

      setTimeout(() => {
        setSuccessMessage('');
        if (onSubmit) onSubmit();
      }, 1500);

    } catch (error) {
      console.error('Error submitting form:', error);

      setErrorMessage(
        error.response?.data?.message ||
        '❌ Erreur lors de l\'envoi du formulaire'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Nom:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Entrez votre nom"
        />
      </div>

      <div className="form-group">
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Entrez votre email"
        />
      </div>

      <div className="form-group">
        <label>Message:</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          placeholder="Entrez votre message"
          rows="4"
        />
      </div>

      <div className="form-group">
        <label>Image:</label>
        <input
          type="file"
          onChange={handleImageChange}
          accept="image/*"
        />
      </div>

      {imagePreview && (
        <div className="image-preview">
          <img src={imagePreview} alt="preview" />
        </div>
      )}

      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <button type="submit" disabled={loading}>
        {loading ? 'Envoi...' : 'Envoyer'}
      </button>
    </form>
  );
}

export default FormComponent;
