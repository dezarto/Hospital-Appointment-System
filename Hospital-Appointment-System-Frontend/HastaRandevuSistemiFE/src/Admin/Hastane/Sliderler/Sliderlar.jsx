import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getSliderlerByHastaneID,
  getSliderByHastaneIDAndSliderID,
  addSliderByHastaneID,
  deleteSliderByHastaneIDAndSliderID,
  updateSliderByHastaneID,
  getHastaneById
} from '../../../api/api-admin';
import LoadingAnimation from '../../../components/LoadingAnimation/LoadingAnimation';
import ActionButtonsSidebar from '../Home/ActionButtonsSidebar';
import './Sliderlar.css';

const Sliderlar = () => {
  const { hastaneId } = useParams();
  const navigate = useNavigate();
  const [sliderlar, setSliderlar] = useState([]);
  const [selectedSlider, setSelectedSlider] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [hospitalName, setHospitalName] = useState('');
  const [newSlider, setNewSlider] = useState({
    slideBaslik: '',
    resim: ''
  });

  useEffect(() => {
    const fetchSliderlar = async () => {
      try {
        // Fetch hospital name
        const hospitalResponse = await getHastaneById(hastaneId);
        setHospitalName(hospitalResponse.data.hastaneAdi || 'Hastane');

        // Fetch sliders
        const response = await getSliderlerByHastaneID(hastaneId);
        setSliderlar(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        if (error.response?.status === 401) {
          sessionStorage.removeItem('token');
          navigate('/giris');
        } else {
          console.error('Slider verileri alınırken hata oluştu:', error);
        }
      }
    };

    fetchSliderlar();
  }, [hastaneId, navigate]);

  const handleEditClick = async (sliderId) => {
    try {
      const data = await getSliderByHastaneIDAndSliderID(hastaneId, sliderId);
      setNewSlider(data);
      setIsEditing(true);
      setShowModal(true);
    } catch (error) {
      console.error('Slider bilgileri alınırken hata oluştu:', error);
    }
  };

  const handleDeleteClick = (slider) => {
    setSelectedSlider(slider);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (selectedSlider) {
      try {
        await deleteSliderByHastaneIDAndSliderID(hastaneId, selectedSlider.id);
        setSliderlar(prev => prev.filter(s => s.id !== selectedSlider.id));
        setShowDeleteModal(false);
      } catch (error) {
        console.error('Slider silinirken hata oluştu:', error);
      }
    }
  };

  const handleInputChange = (e) => {
    setNewSlider({
      ...newSlider,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    try {
      if (isEditing) {
        await updateSliderByHastaneID(hastaneId, newSlider.id, newSlider);
      } else {
        await addSliderByHastaneID(hastaneId, newSlider);
      }

      const updatedData = await getSliderlerByHastaneID(hastaneId);
      setSliderlar(updatedData.data);
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Slider kaydedilirken hata oluştu:', error);
    }
  };

  const resetForm = () => {
    setNewSlider({
      slideBaslik: '',
      resim: ''
    });
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="sliderlar-checking">
        <div className="sliderlar-loading-alert-wrapper">
          <LoadingAnimation />
        </div>
        <p className="sliderlar-loading-message">Sliderlar yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="sliderlar-main-container">
      <ActionButtonsSidebar
        hospitalId={hastaneId}
        hospitalName={hospitalName}
        noHospitalMessage="Hastane bilgisi yükleniyor..."
      />
      <div className="sliderlar-table-container">
        <button className="sliderlar-add-new-btn" onClick={() => setShowModal(true)}>
          + Yeni Slider Ekle
        </button>

        <table className="sliderlar-hasta-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Başlık</th>
              <th>Resim</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {sliderlar.length > 0 ? (
              sliderlar.map((slider) => (
                <tr key={slider.id}>
                  <td>{slider.id}</td>
                  <td>{slider.slideBaslik}</td>
                  <td><img src={slider.resim} alt={slider.slideBaslik} width="100" /></td>
                  <td className="sliderlar-actions">
                    <button className="sliderlar-edit-btn" onClick={() => handleEditClick(slider.id)}>
                      Düzenle
                    </button>
                    <button className="sliderlar-delete-btn" onClick={() => handleDeleteClick(slider)}>
                      Sil
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
                  Kayıtlı slider bulunmamaktadır
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {showDeleteModal && (
          <div className="sliderlar-modal-overlay">
            <div className="sliderlar-confirmation-modal">
              <div className="sliderlar-modal-header">
                <h3>Silme Onayı</h3>
                <button className="sliderlar-close-btn" onClick={() => setShowDeleteModal(false)}>×</button>
              </div>
              <div className="sliderlar-modal-content">
                <p><b>{selectedSlider?.slideBaslik}</b> başlıklı slider'ı silmek istediğinize emin misiniz?</p>
                <div className="sliderlar-modal-actions">
                  <button className="sliderlar-confirm-btn" onClick={confirmDelete}>Evet</button>
                  <button className="sliderlar-cancel-btn" onClick={() => setShowDeleteModal(false)}>Hayır</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showModal && (
          <div className="sliderlar-modal-overlay">
            <div className="sliderlar-modal">
              <div className="sliderlar-modal-header">
                <h2>{isEditing ? 'Slider Düzenle' : 'Yeni Slider Ekle'}</h2>
                <button className="sliderlar-close-btn" onClick={() => { setShowModal(false); resetForm(); }}>×</button>
              </div>

              <form className="sliderlar-modal-content">
                <div className="sliderlar-form-group">
                  <label>Başlık</label>
                  <input
                    type="text"
                    name="slideBaslik"
                    value={newSlider.slideBaslik}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="sliderlar-form-group">
                  <label>Resim URL</label>
                  <input
                    type="text"
                    name="resim"
                    value={newSlider.resim}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="sliderlar-modal-actions">
                  <button type="button" className="sliderlar-confirm-btn" onClick={handleSave}>
                    {isEditing ? 'Güncelle' : 'Kaydet'}
                  </button>
                  <button type="button" className="sliderlar-cancel-btn" onClick={() => { setShowModal(false); resetForm(); }}>
                    İptal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sliderlar;