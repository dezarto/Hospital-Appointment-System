import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Bir önceki sayfaya yönlendir
  };

  return (
    <div className="not-found-container">
      <h1>404</h1>
      <p>Oops! Gitmeye çalıştığın sayfa bulunamadı!</p>
      <button onClick={handleGoBack} className="home-link">
        Geri dön
      </button>
    </div>
  );
};

export default NotFound;
