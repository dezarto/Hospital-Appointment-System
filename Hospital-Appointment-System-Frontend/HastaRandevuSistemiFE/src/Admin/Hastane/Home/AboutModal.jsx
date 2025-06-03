import React, { useEffect, useState } from 'react';
import { getAboutUsByHastaneId, updateAboutUsByHastaneId } from '../../../api/api-admin';
import './AboutModal.css';
import LoadingAnimation from '../../../components/LoadingAnimation/LoadingAnimation';

const AboutModal = ({ hospitalId, onClose }) => {
  const [misyon, setMisyon] = useState('');
  const [vizyon, setVizyon] = useState('');
  const [misyonSabit, setMisyonSabit] = useState('');
  const [vizyonSabit, setVizyonSabit] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAboutUsByHastaneId(hospitalId);
        setMisyon(response.data.misyon || '');
        setVizyon(response.data.vizyon || '');
        setMisyonSabit(response.data.misyon || '');
        setVizyonSabit(response.data.vizyon || '');
        setHospitalName(response.data.hastaneAdi || 'Hastane');
        setLoading(false);
      } catch (error) {
        setLoading(false);
        if (error.response?.status === 401) {
          sessionStorage.removeItem('token');
          onClose();
          alert('Oturum süresi doldu, lütfen tekrar giriş yapın.');
        } else {
          console.error('Veri alınırken hata oluştu:', error);
          alert('Bilgiler yüklenirken hata oluştu.');
        }
      }
    };
    fetchData();
  }, [hospitalId, onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'misyon') setMisyon(value);
    if (name === 'vizyon') setVizyon(value);
    setErrors({ ...errors, [name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!misyon.trim()) newErrors.misyon = 'Misyon zorunlu.';
    if (!vizyon.trim()) newErrors.vizyon = 'Vizyon zorunlu.';
    return newErrors;
  };

  const handleSave = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const updatedData = { misyon, vizyon };
      await updateAboutUsByHastaneId(hospitalId, updatedData);
      setMisyonSabit(misyon);
      setVizyonSabit(vizyon);
      alert('Misyon ve vizyon başarıyla güncellendi.');
      onClose();
    } catch (error) {
      console.error('Güncelleme hatası:', error);
      alert(`Güncelleme başarısız: ${error.response?.data?.message || error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="about-modal-checking">
        <div className="about-modal-loading-alert-wrapper">
          <LoadingAnimation />
        </div>
        <p className="about-modal-loading-message">Bilgileri yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="about-modal-overlay">
      <div className="about-modal">
        <div className="about-modal-header">
          <h2>{hospitalName} Hakkında</h2>
          <button className="about-modal-close-btn" onClick={onClose}>×</button>
        </div>
        <div className="about-modal-content">
          <div className="about-modal-form-columns">
            <div className="about-modal-form-column about-modal-left-box">
              <h3>Misyon</h3>
              <p>{misyonSabit || 'Belirtilmemiş'}</p>
              <h3>Vizyon</h3>
              <p>{vizyonSabit || 'Belirtilmemiş'}</p>
            </div>
            <div className="about-modal-form-column about-modal-right-box">
              <div className="about-modal-form-group">
                <label htmlFor="misyon">Misyon</label>
                <textarea
                  id="misyon"
                  name="misyon"
                  value={misyon}
                  onChange={handleChange}
                  rows="7"
                  className={errors.misyon ? 'about-modal-input-error' : ''}
                />
                {errors.misyon && <div className="about-modal-error-message">{errors.misyon}</div>}
              </div>
              <div className="about-modal-form-group">
                <label htmlFor="vizyon">Vizyon</label>
                <textarea
                  id="vizyon"
                  name="vizyon"
                  value={vizyon}
                  onChange={handleChange}
                  rows="7"
                  className={errors.vizyon ? 'about-modal-input-error' : ''}
                />
                {errors.vizyon && <div className="about-modal-error-message">{errors.vizyon}</div>}
              </div>
            </div>
          </div>
          <div className="about-modal-actions">
            <button className="about-modal-confirm-btn" onClick={handleSave}>Kaydet</button>
            <button className="about-modal-cancel-btn" onClick={onClose}>İptal</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;