import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Randevu.css";
import { FaHospital, FaUser, FaStethoscope, FaCalendarAlt, FaClock, FaMapMarkerAlt } from "react-icons/fa";
import { getRandevularim } from '../../api/api-hasta';
import LoadingAnimation from '../../components/LoadingAnimation/LoadingAnimation';
import { getUserId } from '../../api/auth';

const Randevu = () => {
  const navigate = useNavigate();
  const [randevular, setRandevular] = useState([]);
  const [loading, setLoading] = useState(true); // Yüklenme durumu takibi
  const hastaTC = getUserId();

  useEffect(() => {
    const fetchRandevular = async () => {
      try {
        const response = await getRandevularim(hastaTC);

        const sortedRandevular = response.data.sort((a, b) => {
          const dateA = new Date(a.randevuTarihi);
          const dateB = new Date(b.randevuTarihi);

          if (dateA.getTime() !== dateB.getTime()) {
            return dateB - dateA;
          } else {
            const [hourA, minA] = a.baslangıcSaati.split(":").map(Number);
            const [hourB, minB] = b.baslangıcSaati.split(":").map(Number);
            return hourA - hourB || minA - minB;
          }
        });

        setRandevular(sortedRandevular);
      } catch (error) {
        if (error.response?.status === 401) {
          // Token'ı sil ve login sayfasına yönlendir
          sessionStorage.removeItem('token');
          navigate('/giris'); // Login sayfasına yönlendir
        } else {
          console.error("Randevu verileri alınamadı:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRandevular();
  }, []);

  const handleClick = () => {
    navigate("/hasta/randevu-ara");
  };

  const getStatusStyle = (date, time) => {
    const now = new Date();
    const [hours, minutes] = time.split(':');
    const appointmentDate = new Date(date);
    appointmentDate.setHours(hours, minutes);

    return appointmentDate < now ? "rdv-completed" : "rdv-upcoming";
  };

  // Eğer veri yükleniyorsa animasyonu göster
  if (loading) {
    return (
      <div className="rdv-checking">
        <div className="rdv-loading-alert-wrapper">
          <LoadingAnimation />
        </div>
        <p className="rdv-loading-message">Bilgiler yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="rdv-randevu-container">
      <div className="rdv-randevu-left">
        <button className="rdv-randevu-button" onClick={handleClick}>
          <FaHospital className="rdv-hospital-icon" />
          <div className="rdv-randevu-text">
            <h3>Hastane Randevusu Al</h3>
            <p>Hastanede bulunan kliniklerden randevu alabilirsiniz</p>
          </div>
        </button>
      </div>
      <div className="rdv-randevu-right">
        <div className="rdv-randevu-table">
          <h3>Tüm Randevularım</h3>
          <div className="rdv-appointments-list">
            {randevular.length > 0 ? (
              randevular.map((randevu) => {
                const status = getStatusStyle(randevu.randevuTarihi, randevu.baslangıcSaati);
                return (
                  <div key={randevu.randevuID} className={`rdv-appointment-card ${status}`}>
                    <div className="rdv-appointment-header">
                      <h4>
                        <FaUser className="rdv-icon" />
                        {randevu.doktorAdiSoyadi}
                      </h4>
                      <span className={`rdv-status-badge ${status}`}>
                        {status === 'rdv-completed' ? 'Tamamlandı' : 'Yaklaşan'}
                      </span>
                    </div>
                    <div className="rdv-appointment-details">
                      <div className="rdv-detail-column">
                        <div className="rdv-detail-item">
                          <FaStethoscope className="rdv-icon" />
                          <span>{randevu.poliklinikAdi}</span>
                        </div>
                        <div className="rdv-detail-item">
                          <FaHospital className="rdv-icon" />
                          <span>{randevu.hastaneAdi}</span>
                        </div>
                        <div className="rdv-detail-item">
                          <FaMapMarkerAlt className="rdv-icon" />
                          <span>{randevu.bolumAdi}</span>
                        </div>
                      </div>
                      <div className="rdv-time-column">
                        <div className="rdv-detail-item">
                          <FaCalendarAlt className="rdv-icon" />
                          <span>{new Date(randevu.randevuTarihi).toLocaleDateString('tr-TR')}</span>
                        </div>
                        <div className="rdv-detail-item">
                          <FaClock className="rdv-icon" />
                          <span>
                            {randevu.baslangıcSaati.substring(0, 5)} - {randevu.bitisSaati.substring(0, 5)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="rdv-no-appointments">
                <p>Randevu kaydınız bulunmamaktadır.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Randevu;