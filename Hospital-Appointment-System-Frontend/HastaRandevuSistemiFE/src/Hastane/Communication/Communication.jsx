import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Communication.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { getHastaneAllInformationByHastaneId } from '../../api/api-hasta';
import LoadingAnimation from '../../components/LoadingAnimation/LoadingAnimation';

const Communication = () => {
  const { hastaneId } = useParams();
  const [contactInfo, setContactInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fullAddress, setFullAddress] = useState("");

  useEffect(() => {
    const fetchCommunicationData = async () => {
      try {
        const data = await getHastaneAllInformationByHastaneId(hastaneId);
        setContactInfo(data);
      } catch (err) {
        setError('Failed to fetch communication details.');
      } finally {
        setLoading(false);
      }
    };

    fetchCommunicationData();
  }, [hastaneId]);

  useEffect(() => {
    if (!contactInfo) return;

    const address = `${contactInfo?.mahalle}, ${contactInfo?.caddeSokak}, No: ${contactInfo?.disKapiNo}, ${contactInfo?.ilce}, ${contactInfo?.il}, Türkiye`;
    setFullAddress(address);

  }, [contactInfo]);

  if (!contactInfo) {
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
    <div className="contact-container">
      <h1 className="page-title">İletişim</h1>

      {loading ? (
        <div className="loading-spinner"></div>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : contactInfo ? (
        <div className="contact-content">
          {/* Sol Bölüm - İletişim Bilgileri */}
          <div className="contact-info-wrapper">
            <div className="contact-card">
              <h2 className="section-title">
                <span className="icon-wrapper">📍</span>
                Adres Bilgileri
              </h2>
              <div className="address-grid">
                <div className="address-item">
                  <span className="address-label">Tam Adres:</span>
                  <p className="address-text">{fullAddress}</p>
                </div>
                <div className="address-item">
                  <span className="address-label">Kapı No:</span>
                  <p className="address-text">{contactInfo.disKapiNo} {contactInfo.icKapiNo && `- ${contactInfo.icKapiNo}`}</p>
                </div>
              </div>
            </div>

            <div className="contact-card">
              <h2 className="section-title">
                <span className="icon-wrapper">📞</span>
                Telefon & E-Posta
              </h2>
              <div className="contact-details">
                <div className="detail-item">
                  <span className="detail-icon">📞</span>
                  <a href={`tel:${contactInfo.telNo}`} className="detail-link">
                    {contactInfo.telNo}
                  </a>
                </div>
                {contactInfo.telNo2 && (
                  <div className="detail-item">
                    <span className="detail-icon">📞</span>
                    <a href={`tel:${contactInfo.telNo2}`} className="detail-link">
                      {contactInfo.telNo2}
                    </a>
                  </div>
                )}
                <div className="detail-item">
                  <span className="detail-icon">✉️</span>
                  <a href={`mailto:${contactInfo.email}`} className="detail-link">
                    {contactInfo.email}
                  </a>
                </div>
              </div>
            </div>

            <div className="contact-card social-section">
              <h2 className="section-title">
                <span className="icon-wrapper">🌐</span>
                Sosyal Medya
              </h2>
              <div className="social-grid">
                {contactInfo?.facebook ? (
                  <a href={contactInfo.facebook} target="_blank" rel="noreferrer" className="social-link">
                    <FontAwesomeIcon icon={faFacebook} className="social-icon" />
                    <span>Facebook</span>
                  </a>
                ) : null}
                {contactInfo?.twitter ? (
                  <a href={contactInfo.twitter} target="_blank" rel="noreferrer" className="social-link">
                    <FontAwesomeIcon icon={faTwitter} className="social-icon" />
                    <span>Twitter</span>
                  </a>
                ) : null}
                {contactInfo?.instagram ? (
                  <a href={contactInfo.instagram} target="_blank" rel="noreferrer" className="social-link">
                    <FontAwesomeIcon icon={faInstagram} className="social-icon" />
                    <span>Instagram</span>
                  </a>
                ) : null}
                {contactInfo?.linkedin ? (
                  <a href={contactInfo.linkedin} target="_blank" rel="noreferrer" className="social-link">
                    <FontAwesomeIcon icon={faLinkedin} className="social-icon" />
                    <span>LinkedIn</span>
                  </a>
                ) : null}
                {(contactInfo?.facebook || contactInfo?.twitter || contactInfo?.instagram || contactInfo?.linkedin) === null && (
                  <p>Henüz bu bilgiler girilmemiştir.</p>
                )}
              </div>
            </div>
          </div>
          {/* Sağ Bölüm - Harita */}
          <div className="map-wrapper">
            <div className="map-card">
              <h2 className="section-title">
                <span className="icon-wrapper">🗺️</span>
                Konumumuz
              </h2>
              <div className="map-container">
                <iframe
                  title="hospital-location"
                  className="responsive-iframe"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}&output=embed`}>
                </iframe>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="no-data">İletişim bilgileri bulunamadı</p>
      )}
    </div>
  );
};

export default Communication;
