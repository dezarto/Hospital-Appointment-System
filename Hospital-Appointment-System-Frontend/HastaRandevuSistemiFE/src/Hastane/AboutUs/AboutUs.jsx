import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './AboutUs.css';
import { FaEye, FaUsers } from 'react-icons/fa';
import { getHastaneAllInformationByHastaneId, getAllDoktorsByHastaneId } from '../../api/api-hasta';
import LoadingAnimation from '../../components/LoadingAnimation/LoadingAnimation';

const AboutUs = () => {
  const { hastaneId } = useParams();
  const [aboutInfo, setAboutInfo] = useState(null);
  const [doktors, setDoktors] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const data = await getHastaneAllInformationByHastaneId(hastaneId);
        setAboutInfo(data);
      } catch (err) {
        setError('Failed to fetch about details.');
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, [hastaneId]);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const data = await getAllDoktorsByHastaneId(hastaneId);
        setDoktors(data);
        console.log(data);
      } catch (err) {
        setError('Failed to fetch about details.');
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, [hastaneId]);

  if (!aboutInfo) {
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
    <div className="aboutus-container">
      <h1 className="page-title">Hakkımızda</h1>

      {loading ? (
        <div className="loading-spinner"></div>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : aboutInfo ? (
        <div className="aboutus-content">
          {/* Misyon Bölümü */}
          <div className="mission-section">
            <div className="mission-image" />
            <div className="mission-content">
              <h2 className="section-title">Misyonumuz</h2>
              <p className="section-content">{aboutInfo.misyon}</p>
            </div>
          </div>

          {/* Vizyon Bölümü */}
          <div className="vision-section">
            <div className="vision-icon">
              <FaEye size={120} color="rgba(255,255,255,0.2)" />
            </div>
            <div className="vision-content">
              <h2 className="section-title">Vizyonumuz</h2>
              <p className="section-content">{aboutInfo.vizyon}</p>
            </div>
          </div>

          {/* Takım Bölümü */}
          <div className="team-section">
            <h2 className="section-title" style={{ gridColumn: '1/-1' }}>Uzman Kadromuz</h2>
            {doktors?.length > 0 ? (
              doktors.map((member, index) => (
                <div key={index} className="team-card">
                  <h3>{member.isim} {member.soyisim}</h3>
                  <p>Cinsiyet: {member.cinsiyet ? "Kadın" : "Erkek"}</p>
                </div>
              ))
            ) : (
              <p>Henüz bu bilgiler girilmemiştir.</p>
            )}
          </div>

        </div>
      ) : (
        <p className="no-data">Hakkımızda bilgileri bulunamadı</p>
      )}
    </div>
  );
};

export default AboutUs;
