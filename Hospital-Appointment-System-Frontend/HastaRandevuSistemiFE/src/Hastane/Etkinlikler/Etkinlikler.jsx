import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getAllSlidersAndEtkinlikAndDuyuruAndHaberByHastaneId } from '../../api/api-hasta';
import { FaTimes } from 'react-icons/fa';
import '../Duyurular/Duyuru.css';
import defaultEventImage from '../../assets/default-etkinlik.png';
import LoadingAnimation from '../../components/LoadingAnimation/LoadingAnimation';

const Etkinlikler = () => {
  const [etkinlikler, setEtkinlikler] = useState([]);
  const [selectedEtkinlik, setSelectedEtkinlik] = useState(null);
  const { hastaneId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllSlidersAndEtkinlikAndDuyuruAndHaberByHastaneId(hastaneId);
        setEtkinlikler(response.etkinlikler);
      } catch (error) {
        console.error("Veri alınamadı:", error);
      }
    };
    fetchData();
  }, [hastaneId]);

  const handleEtkinlikClick = (etkinlik) => {
    setSelectedEtkinlik(etkinlik);
  };

  const closePopup = () => {
    setSelectedEtkinlik(null);
  };

  if (!etkinlikler) {
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
        {etkinlikler.length > 0 ? (
          etkinlikler.map((etkinlik) => (
            <div
              key={etkinlik.id}
              className="duyuru-card"
              onClick={() => handleEtkinlikClick(etkinlik)}
            >
              <div className="duyuru-image">
                <img
                  src={etkinlik.resim}
                  alt="Etkinlik Resmi"
                  onError={(e) => {
                    e.target.src = defaultEventImage;
                  }}
                />
              </div>
              <div className="duyuru-info">
                <h3>{etkinlik.baslik}</h3>
                <span className="duyuru-date">
                  {new Date(etkinlik.tarih).toLocaleDateString('tr-TR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p>Henüz etkinlik eklenmedi.</p>
        )}
      </div>

      {selectedEtkinlik && (
        <div className="popup">
          <div className="popup-content">
            <button className="close-btn" onClick={closePopup}><FaTimes /></button>
            <h2>{selectedEtkinlik.baslik}</h2>
            <span className="popup-date">
              {new Date(selectedEtkinlik.tarih).toLocaleDateString('tr-TR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
            <img
              src={selectedEtkinlik.resim}
              alt="Etkinlik Resmi"
              className="popup-image"
              onError={(e) => {
                e.target.src = defaultEventImage;
              }}
            />
            <p>{selectedEtkinlik.icerik}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Etkinlikler;