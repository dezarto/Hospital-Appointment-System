import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getEtkinliklerByHastaneID,
  getEtkinlikByHastaneIDAndEtkinlikID,
  addEtkinlikByHastaneID,
  deleteEtkinlikByHastaneIDAndEtkinlikID,
  updateEtkinlikByHastaneID,
  getHastaneById
} from '../../../api/api-admin';
import LoadingAnimation from '../../../components/LoadingAnimation/LoadingAnimation';
import ActionButtonsSidebar from '../Home/ActionButtonsSidebar';
import './Etkinlik.css';

const Etkinlikler = () => {
  const { hastaneId } = useParams();
  const navigate = useNavigate();
  const [etkinlikler, setEtkinlikler] = useState([]);
  const [selectedEtkinlik, setSelectedEtkinlik] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [hospitalName, setHospitalName] = useState('');
  const [newEtkinlik, setNewEtkinlik] = useState({
    baslik: '',
    icerik: '',
    resim: '',
    tarih: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hospitalResponse, etkinlikResponse] = await Promise.all([
          getHastaneById(hastaneId),
          getEtkinliklerByHastaneID(hastaneId)
        ]);
        setHospitalName(hospitalResponse.data.hastaneAdi || 'Hastane');
        setEtkinlikler(etkinlikResponse.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        if (error.response?.status === 401) {
          sessionStorage.removeItem('token');
          navigate('/giris');
        } else {
          console.error('Etkinlik verileri alınırken hata oluştu:', error);
        }
      }
    };

    fetchData();
  }, [hastaneId, navigate]);

  const handleSort = (column) => {
    let order = 'asc';
    if (sortColumn === column && sortOrder === 'asc') {
      order = 'desc';
    }
    setSortColumn(column);
    setSortOrder(order);

    const sortedEtkinlikler = [...etkinlikler].sort((a, b) => {
      if (a[column] < b[column]) return order === 'asc' ? -1 : 1;
      if (a[column] > b[column]) return order === 'asc' ? 1 : -1;
      return 0;
    });
    setEtkinlikler(sortedEtkinlikler);
  };

  const renderSortIcon = (column) => {
    if (sortColumn === column) {
      return sortOrder === 'asc' ? ' ▲' : ' ▼';
    }
    return '';
  };

  const handleEditClick = async (etkinlikId) => {
    try {
      const data = await getEtkinlikByHastaneIDAndEtkinlikID(hastaneId, etkinlikId);
      setNewEtkinlik({
        ...data,
        tarih: data.tarih.split('T')[0]
      });
      setIsEditing(true);
      setShowModal(true);
    } catch (error) {
      console.error('Etkinlik bilgileri alınırken hata oluştu:', error);
    }
  };

  const handleDeleteClick = (etkinlik) => {
    setSelectedEtkinlik(etkinlik);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (selectedEtkinlik) {
      try {
        await deleteEtkinlikByHastaneIDAndEtkinlikID(hastaneId, selectedEtkinlik.id);
        setEtkinlikler(prev => prev.filter(e => e.id !== selectedEtkinlik.id));
        setShowDeleteModal(false);
      } catch (error) {
        console.error('Etkinlik silinirken hata oluştu:', error);
      }
    }
  };

  const handleInputChange = (e) => {
    setNewEtkinlik({
      ...newEtkinlik,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    try {
      const etkinlikData = {
        ...newEtkinlik,
        tarih: new Date(newEtkinlik.tarih).toISOString()
      };

      if (isEditing) {
        await updateEtkinlikByHastaneID(hastaneId, newEtkinlik.id, etkinlikData);
      } else {
        await addEtkinlikByHastaneID(hastaneId, etkinlikData);
      }

      const updatedData = await getEtkinliklerByHastaneID(hastaneId);
      setEtkinlikler(updatedData.data);
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Etkinlik kaydedilirken hata oluştu:', error);
    }
  };

  const resetForm = () => {
    setNewEtkinlik({
      baslik: '',
      icerik: '',
      resim: '',
      tarih: new Date().toISOString().split('T')[0]
    });
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="etkinlik-checking">
        <div className="etkinlik-loading-alert-wrapper">
          <LoadingAnimation />
        </div>
        <p className="etkinlik-loading-message">Etkinlikler yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="etkinlik-main-container">
      <ActionButtonsSidebar
        hospitalId={hastaneId}
        hospitalName={hospitalName}
        noHospitalMessage="Hastane bilgisi yükleniyor..."
      />
      <div className="etkinlik-table-container">
        <button className="etkinlik-add-new-btn" onClick={() => setShowModal(true)}>
          + Yeni Etkinlik Ekle
        </button>

        <table className="etkinlik-hasta-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('id')}>ID {renderSortIcon('id')}</th>
              <th onClick={() => handleSort('baslik')}>Başlık {renderSortIcon('baslik')}</th>
              <th onClick={() => handleSort('icerik')}>İçerik {renderSortIcon('icerik')}</th>
              <th onClick={() => handleSort('tarih')}>Tarih {renderSortIcon('tarih')}</th>
              <th>Resim</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {etkinlikler.length > 0 ? (
              etkinlikler.map((etkinlik) => (
                <tr key={etkinlik.id}>
                  <td>{etkinlik.id}</td>
                  <td>{etkinlik.baslik}</td>
                  <td className="etkinlik-content-truncated">{etkinlik.icerik}</td>
                  <td>{new Date(etkinlik.tarih).toLocaleDateString('tr-TR')}</td>
                  <td><img src={etkinlik.resim} width="100" alt="Etkinlik resmi" /></td>
                  <td className="etkinlik-actions">
                    <button className="etkinlik-edit-btn" onClick={() => handleEditClick(etkinlik.id)}>
                      Düzenle
                    </button>
                    <button className="etkinlik-delete-btn" onClick={() => handleDeleteClick(etkinlik)}>
                      Sil
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                  Kayıtlı etkinlik bulunmamaktadır
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {showDeleteModal && (
          <div className="etkinlik-modal-overlay">
            <div className="etkinlik-confirmation-modal">
              <div className="etkinlik-modal-header">
                <h3>Silme Onayı</h3>
                <button className="etkinlik-close-btn" onClick={() => setShowDeleteModal(false)}>×</button>
              </div>
              <div className="etkinlik-modal-content">
                <p><b>{selectedEtkinlik?.baslik}</b> başlıklı etkinliği silmek istediğinize emin misiniz?</p>
                <div className="etkinlik-modal-actions">
                  <button className="etkinlik-confirm-btn" onClick={confirmDelete}>Evet</button>
                  <button className="etkinlik-cancel-btn" onClick={() => setShowDeleteModal(false)}>Hayır</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showModal && (
          <div className="etkinlik-modal-overlay">
            <div className="etkinlik-modal">
              <div className="etkinlik-modal-header">
                <h2>{isEditing ? 'Etkinlik Düzenle' : 'Yeni Etkinlik Ekle'}</h2>
                <button className="etkinlik-close-btn" onClick={() => { setShowModal(false); resetForm(); }}>×</button>
              </div>

              <form className="etkinlik-modal-content">
                <div className="etkinlik-form-columns">
                  <div className="etkinlik-form-column">
                    <div className="etkinlik-form-group">
                      <label>Başlık</label>
                      <input
                        type="text"
                        name="baslik"
                        value={newEtkinlik.baslik}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="etkinlik-form-group">
                      <label>İçerik</label>
                      <textarea
                        name="icerik"
                        value={newEtkinlik.icerik}
                        onChange={handleInputChange}
                        rows="4"
                      />
                    </div>
                  </div>

                  <div className="etkinlik-form-column">
                    <div className="etkinlik-form-group">
                      <label>Resim URL</label>
                      <input
                        type="text"
                        name="resim"
                        value={newEtkinlik.resim}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="etkinlik-form-group">
                      <label>Tarih</label>
                      <input
                        type="date"
                        name="tarih"
                        value={newEtkinlik.tarih}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="etkinlik-modal-actions">
                  <button type="button" className="etkinlik-confirm-btn" onClick={handleSave}>
                    {isEditing ? 'Güncelle' : 'Kaydet'}
                  </button>
                  <button type="button" className="etkinlik-cancel-btn" onClick={() => { setShowModal(false); resetForm(); }}>
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

export default Etkinlikler;