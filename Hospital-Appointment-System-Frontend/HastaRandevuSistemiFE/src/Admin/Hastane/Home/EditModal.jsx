import React, { useEffect, useState } from 'react';
import { getHastaneById, updateHastane } from '../../../api/api-admin';
import './EditModal.css';
import LoadingAnimation from '../../../components/LoadingAnimation/LoadingAnimation';

const EditModal = ({ hospitalId, onClose, onSave }) => {
  const [loading, setLoading] = useState(true);
  const [hospital, setHospital] = useState({
    hastaneAdi: '',
    yatakKapasitesi: 0,
    aciklama: '',
    iletisim_ID: 0,
    adres_ID: 0,
    about_ID: 0,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchHospital = async () => {
      try {
        const response = await getHastaneById(hospitalId);
        setHospital(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        if (error.response?.status === 401) {
          sessionStorage.removeItem('token');
          onClose();
          alert('Oturum süresi doldu, lütfen tekrar giriş yapın.');
        } else {
          console.error('Hastane bilgileri alınırken hata oluştu:', error);
          alert('Bilgiler yüklenirken hata oluştu.');
        }
      }
    };

    fetchHospital();
  }, [hospitalId, onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHospital({ ...hospital, [name]: name === 'yatakKapasitesi' ? parseInt(value) || 0 : value });
    setErrors({ ...errors, [name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!hospital.hastaneAdi.trim()) newErrors.hastaneAdi = 'Hastane adı zorunlu.';
    if (hospital.yatakKapasitesi < 0) newErrors.yatakKapasitesi = 'Yatak kapasitesi negatif olamaz.';
    if (!hospital.aciklama.trim()) newErrors.aciklama = 'Açıklama zorunlu.';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const isUpdated = await updateHastane(hospitalId, hospital);
      if (isUpdated) {
        alert('Hastane başarıyla güncellendi.');
        onSave();
      }
    } catch (error) {
      console.error('Güncelleme hatası:', error);
      alert(`Güncelleme başarısız: ${error.response?.data?.message || error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="edit-modal-checking">
        <div className="edit-modal-loading-alert-wrapper">
          <LoadingAnimation />
        </div>
        <p className="edit-modal-loading-message">Bilgileri yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="edit-modal-overlay">
      <div className="edit-modal">
        <div className="edit-modal-header">
          <h2>Hastane Düzenle</h2>
          <button className="edit-modal-close-btn" onClick={onClose}>×</button>
        </div>
        <form className="edit-modal-content" onSubmit={handleSubmit}>
          <div className="edit-modal-form-group">
            <label>Hastane Adı:</label>
            <input
              type="text"
              name="hastaneAdi"
              value={hospital.hastaneAdi}
              onChange={handleChange}
              className={errors.hastaneAdi ? 'edit-modal-input-error' : ''}
            />
            {errors.hastaneAdi && <div className="edit-modal-error-message">{errors.hastaneAdi}</div>}
          </div>
          <div className="edit-modal-form-group">
            <label>Yatak Kapasitesi:</label>
            <input
              type="number"
              name="yatakKapasitesi"
              value={hospital.yatakKapasitesi}
              onChange={handleChange}
              className={errors.yatakKapasitesi ? 'edit-modal-input-error' : ''}
            />
            {errors.yatakKapasitesi && <div className="edit-modal-error-message">{errors.yatakKapasitesi}</div>}
          </div>
          <div className="edit-modal-form-group">
            <label>Açıklama:</label>
            <input
              type="text"
              name="aciklama"
              value={hospital.aciklama}
              onChange={handleChange}
              className={errors.aciklama ? 'edit-modal-input-error' : ''}
            />
            {errors.aciklama && <div className="edit-modal-error-message">{errors.aciklama}</div>}
          </div>
          <div className="edit-modal-actions">
            <button type="submit" className="edit-modal-confirm-btn">Güncelle</button>
            <button type="button" className="edit-modal-cancel-btn" onClick={onClose}>İptal</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;