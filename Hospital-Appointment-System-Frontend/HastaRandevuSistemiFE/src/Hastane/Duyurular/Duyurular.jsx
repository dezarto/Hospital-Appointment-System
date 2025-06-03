import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getAllSlidersAndEtkinlikAndDuyuruAndHaberByHastaneId } from '../../api/api-hasta';
import { FaTimes } from 'react-icons/fa';
import './Duyuru.css';
import defaultNewsImage from '../../assets/default-news.jpg';
import LoadingAnimation from '../../components/LoadingAnimation/LoadingAnimation';

const Duyurular = () => {
  const [duyurular, setDuyurular] = useState([]);
  const [selectedDuyuru, setSelectedDuyuru] = useState(null);
  const { hastaneId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllSlidersAndEtkinlikAndDuyuruAndHaberByHastaneId(hastaneId);
        setDuyurular(response.duyurular);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [hastaneId]);

  const handleDuyuruClick = (duyuru) => {
    setSelectedDuyuru(duyuru);
  };

  const closePopup = () => {
    setSelectedDuyuru(null);
  };

  if (!duyurular) {
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
        {duyurular.length > 0 ? (
          duyurular.map((duyuru, index) => (
            <div
              key={duyuru.id}
              className="duyuru-card"
              onClick={() => handleDuyuruClick(duyuru)}
            >
              <div className="duyuru-image">
                <img
                  src={duyuru.resim}
                  alt="Duyuru Resmi"
                  onError={(e) => {
                    e.target.src = defaultNewsImage;
                  }}
                />
              </div>
              <div className="duyuru-info">
                <h3>{duyuru.baslik}</h3>
                <span className="duyuru-date">{new Date(duyuru.tarih).toLocaleDateString('tr-TR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p>Henüz duyuru eklenmedi.</p>
        )}
      </div>

      {selectedDuyuru && (
        <div className="popup">
          <div className="popup-content">
            <button className="close-btn" onClick={closePopup}><FaTimes /></button>
            <h2>{selectedDuyuru.baslik}</h2>
            <span className="popup-date">{new Date(selectedDuyuru.tarih).toLocaleDateString('tr-TR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
            </span>
            <img src={selectedDuyuru.resim} alt="Duyuru Resmi" className="popup-image" onError={(e) => { e.target.src = defaultNewsImage; }} />
            <p>{selectedDuyuru.icerik}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Duyurular;
