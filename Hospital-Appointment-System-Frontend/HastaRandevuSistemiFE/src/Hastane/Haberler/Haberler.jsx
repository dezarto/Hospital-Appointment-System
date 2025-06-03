import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getAllSlidersAndEtkinlikAndDuyuruAndHaberByHastaneId } from '../../api/api-hasta';
import { FaTimes } from 'react-icons/fa';
import '../Duyurular/Duyuru.css';
import defaultNewsImage from '../../assets/default-haber.jpeg';
import LoadingAnimation from '../../components/LoadingAnimation/LoadingAnimation';

const Haberler = () => {
  const [haberler, setHaberler] = useState([]);
  const [selectedHaber, setSelectedHaber] = useState(null);
  const { hastaneId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllSlidersAndEtkinlikAndDuyuruAndHaberByHastaneId(hastaneId);
        setHaberler(response.haberler);
      } catch (error) {
        console.error("Veri alınamadı:", error);
      }
    };
    fetchData();
  }, [hastaneId]);

  const handleHaberClick = (haber) => {
    setSelectedHaber(haber);
  };

  const closePopup = () => {
    setSelectedHaber(null);
  };

  if (!haberler) {
    return (
      <div className="checking">
        <div className="loading-alert-wrapper">
          <LoadingAnimation />
        </div>
        <p className="loading-message">Bilgiler yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="duyuru-container">
      <div className="duyuru-list">
        {haberler.length > 0 ? (
          haberler.map((haber) => (
            <div
              key={haber.id}
              className="duyuru-card"
              onClick={() => handleHaberClick(haber)}
            >
              <div className="duyuru-image">
                <img
                  src={haber.resim}
                  alt="Haber Resmi"
                  onError={(e) => {
                    e.target.src = defaultNewsImage;
                  }}
                />
              </div>
              <div className="duyuru-info">
                <h3>{haber.baslik}</h3>
                <span className="duyuru-date">
                  {new Date(haber.tarih).toLocaleDateString('tr-TR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p>Henüz haber eklenmedi.</p>
        )}
      </div>

      {selectedHaber && (
        <div className="popup">
          <div className="popup-content">
            <button className="close-btn" onClick={closePopup}><FaTimes /></button>
            <h2>{selectedHaber.baslik}</h2>
            <span className="popup-date">
              {new Date(selectedHaber.tarih).toLocaleDateString('tr-TR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
            <img
              src={selectedHaber.resim}
              alt="Haber Resmi"
              className="popup-image"
              onError={(e) => {
                e.target.src = defaultNewsImage;
              }}
            />
            <p>{selectedHaber.icerik}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Haberler;