import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getBolumlerByHastaneID,
  addBolumByHastaneID,
  deleteBolumByHastaneIDAndBolumID,
  updateBolumByHastaneID,
  getHastaneById
} from '../../../api/api-admin';
import LoadingAnimation from '../../../components/LoadingAnimation/LoadingAnimation';
import ActionButtonsSidebar from '../Home/ActionButtonsSidebar';
import './Bolumler.css';

const Bolumler = () => {
  const navigate = useNavigate();
  const { hastaneId } = useParams();
  const [bolumler, setBolumler] = useState([]);
  const [selectedBolum, setSelectedBolum] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [hospitalName, setHospitalName] = useState('');
  const [formData, setFormData] = useState({
    bolumBilgisi: {
      bolumAdi: '',
      bolumAciklama: '',
      iletisim_ID: 0,
    },
    iletisimBilgisi: {
      telNo: '',
      telNo2: '',
      email: '',
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: ''
    }
  });

  const handleHospitalUpdate = async () => {
    const response = await getHastaneById(hastaneId);
    setHospitalName(response.data.hastaneAdi || 'Hastane');
  };

  useEffect(() => {
    const fetchBolumler = async () => {
      try {
        const hospitalResponse = await getHastaneById(hastaneId);
        setHospitalName(hospitalResponse.data.hastaneAdi || 'Hastane');
        const response = await getBolumlerByHastaneID(hastaneId);
        setBolumler(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        if (error.response?.status === 401) {
          sessionStorage.removeItem('token');
          navigate('/giris');
        } else {
          console.error('Bölüm verileri alınırken hata oluştu:', error);
        }
      }
    };
    fetchBolumler();
  }, [hastaneId, navigate]);

  const handleSort = (column) => {
    let order = 'asc';
    if (sortColumn === column && sortOrder === 'asc') {
      order = 'desc';
    }
    setSortColumn(column);
    setSortOrder(order);

    const sortedBolumler = [...bolumler].sort((a, b) => {
      const aValue = a.bolumBilgisi[column];
      const bValue = b.bolumBilgisi[column];
      if (aValue < bValue) return order === 'asc' ? -1 : 1;
      if (aValue > bValue) return order === 'asc' ? 1 : -1;
      return 0;
    });
    setBolumler(sortedBolumler);
  };

  const renderSortIcon = (column) => {
    if (sortColumn === column) {
      return sortOrder === 'asc' ? ' ▲' : ' ▼';
    }
    return '';
  };

  const handleEditClick = (bolumID) => {
    const bolumToEdit = bolumler.find(b => b.bolumBilgisi.bolumID === bolumID);
    if (bolumToEdit) {
      setFormData({
        bolumBilgisi: { ...bolumToEdit.bolumBilgisi },
        iletisimBilgisi: { ...bolumToEdit.iletisimBilgisi }
      });
      setIsEditing(true);
      setShowModal(true);
    }
  };

  const handlePolikliniklerClick = (hastaneId, bolumID) => {
    navigate(`poliklinikler/${bolumID}`);
  };

  const handleDeleteClick = (bolum) => {
    setSelectedBolum(bolum);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (selectedBolum) {
      try {
        await deleteBolumByHastaneIDAndBolumID(
          hastaneId,
          selectedBolum.bolumBilgisi.bolumID
        );
        setBolumler(prev => prev.filter(b =>
          b.bolumBilgisi.bolumID !== selectedBolum.bolumBilgisi.bolumID
        ));
        setShowDeleteModal(false);
      } catch (error) {
        console.error('Bölüm silinirken hata oluştu:', error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      bolumBilgisi: {
        ...prev.bolumBilgisi,
        [name]: value
      }
    }));
  };

  const handleIletisimChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      iletisimBilgisi: {
        ...prev.iletisimBilgisi,
        [name]: value
      }
    }));
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...formData,
        bolumBilgisi: {
          ...formData.bolumBilgisi,
        }
      };

      if (isEditing) {
        await updateBolumByHastaneID(
          payload,
          hastaneId,
          formData.bolumBilgisi.bolumID
        );
      } else {
        await addBolumByHastaneID(payload, hastaneId);
      }

      const updatedData = await getBolumlerByHastaneID(hastaneId);
      setBolumler(updatedData.data);
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Bölüm kaydedilirken hata oluştu:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      bolumBilgisi: {
        bolumAdi: '',
        bolumAciklama: '',
        iletisim_ID: 0,
      },
      iletisimBilgisi: {
        telNo: '',
        telNo2: '',
        email: '',
        facebook: '',
        twitter: '',
        instagram: '',
        linkedin: ''
      }
    });
    setIsEditing(false);
  };

  // Function to truncate content to 50 words
  const truncateContent = (content) => {
    const words = content.split(/\s+/);
    if (words.length > 50) {
      return words.slice(0, 50).join(' ') + '...';
    }
    return content;
  };

  if (loading) {
    return (
      <div className="bolumler-checking">
        <div className="bolumler-loading-alert-wrapper">
          <LoadingAnimation />
        </div>
        <p className="bolumler-loading-message">Bölümler yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="bolumler-main-container">
      <ActionButtonsSidebar
        hospitalId={hastaneId}
        hospitalName={hospitalName}
        noHospitalMessage="Hastane bilgisi yükleniyor..."
        onHospitalUpdate={handleHospitalUpdate}
      />
      <div className="bolumler-table-container">
        <button className="bolumler-add-new-btn" onClick={() => setShowModal(true)}>
          + Yeni Bölüm Ekle
        </button>

        <table className="bolumler-hasta-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('bolumID')}>ID {renderSortIcon('bolumID')}</th>
              <th onClick={() => handleSort('bolumAdi')}>Bölüm Adı {renderSortIcon('bolumAdi')}</th>
              <th onClick={() => handleSort('bolumAciklama')}>Açıklama {renderSortIcon('bolumAciklama')}</th>
              <th onClick={() => handleSort('iletisim_ID')}>İletişim ID {renderSortIcon('iletisim_ID')}</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {bolumler.length > 0 ? (
              bolumler.map((bolum) => (
                <tr key={bolum.bolumBilgisi.bolumID}>
                  <td>{bolum.bolumBilgisi.bolumID}</td>
                  <td>{bolum.bolumBilgisi.bolumAdi}</td>
                  <td>{truncateContent(bolum.bolumBilgisi.bolumAciklama)}</td>
                  <td>{bolum.bolumBilgisi.iletisim_ID}</td>
                  <td className="bolumler-actions">
                    <button
                      className="bolumler-new-btn"
                      onClick={() => handlePolikliniklerClick(hastaneId, bolum.bolumBilgisi.bolumID)}
                    >
                      Poliklinikler
                    </button>
                    <button
                      className="bolumler-edit-btn"
                      onClick={() => handleEditClick(bolum.bolumBilgisi.bolumID)}
                    >
                      Düzenle
                    </button>
                    <button
                      className="bolumler-delete-btn"
                      onClick={() => handleDeleteClick(bolum)}
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                  Kayıtlı bölüm bulunmamaktadır
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {showDeleteModal && (
          <div className="bolumler-modal-overlay">
            <div className="bolumler-confirmation-modal">
              <div className="bolumler-modal-header">
                <h3>Silme Onayı</h3>
                <button className="bolumler-close-btn" onClick={() => setShowDeleteModal(false)}>×</button>
              </div>
              <div className="bolumler-modal-content">
                <p>
                  <b>{selectedBolum?.bolumBilgisi.bolumAdi}</b> isimli bölümü silmek istediğinize emin misiniz?
                </p>
                <div className="bolumler-modal-actions">
                  <button className="bolumler-confirm-btn" onClick={confirmDelete}>Evet</button>
                  <button className="bolumler-cancel-btn" onClick={() => setShowDeleteModal(false)}>Hayır</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showModal && (
          <div className="bolumler-modal-overlay">
            <div className="bolumler-modal">
              <div className="bolumler-modal-header">
                <h2>{isEditing ? 'Bölüm Düzenle' : 'Yeni Bölüm Ekle'}</h2>
                <button className="bolumler-close-btn" onClick={() => { setShowModal(false); resetForm(); }}>×</button>
              </div>

              <form className="bolumler-modal-content">
                <div className="bolumler-form-columns">
                  <div className="bolumler-form-column">
                    <div className="bolumler-form-group">
                      <label>Bölüm Adı</label>
                      <input
                        type="text"
                        name="bolumAdi"
                        value={formData.bolumBilgisi.bolumAdi}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="bolumler-form-group">
                      <label>Açıklama</label>
                      <textarea
                        name="bolumAciklama"
                        value={formData.bolumBilgisi.bolumAciklama}
                        onChange={handleInputChange}
                        rows="6"
                      />
                    </div>
                  </div>

                  <div className="bolumler-form-column">
                    <h3>İletişim Bilgileri</h3>
                    <div className="bolumler-form-group">
                      <label>Telefon 1</label>
                      <input
                        type="text"
                        name="telNo"
                        value={formData.iletisimBilgisi.telNo || ''}
                        onChange={handleIletisimChange}
                      />
                    </div>
                    <div className="bolumler-form-group">
                      <label>Telefon 2</label>
                      <input
                        type="text"
                        name="telNo2"
                        value={formData.iletisimBilgisi.telNo2 || ''}
                        onChange={handleIletisimChange}
                      />
                    </div>
                    <div className="bolumler-form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.iletisimBilgisi.email || ''}
                        onChange={handleIletisimChange}
                      />
                    </div>
                    <div className="bolumler-form-group">
                      <label>Facebook</label>
                      <input
                        type="text"
                        name="facebook"
                        value={formData.iletisimBilgisi.facebook || ''}
                        onChange={handleIletisimChange}
                      />
                    </div>
                    <div className="bolumler-form-group">
                      <label>Twitter</label>
                      <input
                        type="text"
                        name="twitter"
                        value={formData.iletisimBilgisi.twitter || ''}
                        onChange={handleIletisimChange}
                      />
                    </div>
                    <div className="bolumler-form-group">
                      <label>Instagram</label>
                      <input
                        type="text"
                        name="instagram"
                        value={formData.iletisimBilgisi.instagram || ''}
                        onChange={handleIletisimChange}
                      />
                    </div>
                    <div className="bolumler-form-group">
                      <label>LinkedIn</label>
                      <input
                        type="text"
                        name="linkedin"
                        value={formData.iletisimBilgisi.linkedin || ''}
                        onChange={handleIletisimChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="bolumler-modal-actions">
                  <button type="button" className="bolumler-confirm-btn" onClick={handleSave}>
                    {isEditing ? 'Güncelle' : 'Kaydet'}
                  </button>
                  <button type="button" className="bolumler-cancel-btn" onClick={() => { setShowModal(false); resetForm(); }}>
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

export default Bolumler;