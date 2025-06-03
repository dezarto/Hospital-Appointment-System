import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getDuyurularByHastaneID,
  getDuyuruByHastaneIDAndDuyuruID,
  addDuyuruByHastaneID,
  deleteDuyuruByHastaneIDAndDuyuruID,
  updateDuyuruByHastaneID,
  getHastaneById
} from '../../../api/api-admin';
import LoadingAnimation from '../../../components/LoadingAnimation/LoadingAnimation';
import ActionButtonsSidebar from '../Home/ActionButtonsSidebar';
import './Duyuru.css';

const Duyurular = () => {
  const { hastaneId } = useParams();
  const navigate = useNavigate();
  const [duyurular, setDuyurular] = useState([]);
  const [selectedDuyuru, setSelectedDuyuru] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [hospitalName, setHospitalName] = useState('');
  const [newDuyuru, setNewDuyuru] = useState({
    baslik: '',
    icerik: '',
    resim: '',
    tarih: new Date().toISOString().split('T')[0]
  });

  const handleHospitalUpdate = async () => {
    const response = await getHastaneById(hastaneId);
    setHospitalName(response.data.hastaneAdi || 'Hastane');
  };

  useEffect(() => {
    const fetchDuyurular = async () => {
      try {
        const hospitalResponse = await getHastaneById(hastaneId);
        setHospitalName(hospitalResponse.data.hastaneAdi || 'Hastane');
        const response = await getDuyurularByHastaneID(hastaneId);
        setDuyurular(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        if (error.response?.status === 401) {
          sessionStorage.removeItem('token');
          navigate('/giris');
        } else {
          console.error('Duyuru verileri alınırken hata oluştu:', error);
        }
      }
    };

    fetchDuyurular();
  }, [hastaneId, navigate]);

  const handleSort = (column) => {
    let order = 'asc';
    if (sortColumn === column && sortOrder === 'asc') {
      order = 'desc';
    }
    setSortColumn(column);
    setSortOrder(order);

    const sortedDuyurular = [...duyurular].sort((a, b) => {
      if (a[column] < b[column]) return order === 'asc' ? -1 : 1;
      if (a[column] > b[column]) return order === 'asc' ? 1 : -1;
      return 0;
    });
    setDuyurular(sortedDuyurular);
  };

  const renderSortIcon = (column) => {
    if (sortColumn === column) {
      return sortOrder === 'asc' ? ' ▲' : ' ▼';
    }
    return '';
  };

  const handleEditClick = async (duyuruId) => {
    try {
      const data = await getDuyuruByHastaneIDAndDuyuruID(hastaneId, duyuruId);
      setNewDuyuru({
        ...data,
        tarih: data.tarih.split('T')[0]
      });
      setIsEditing(true);
      setShowModal(true);
    } catch (error) {
      console.error('Duyuru bilgileri alınırken hata oluştu:', error);
    }
  };

  const handleDeleteClick = (duyuru) => {
    setSelectedDuyuru(duyuru);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (selectedDuyuru) {
      try {
        await deleteDuyuruByHastaneIDAndDuyuruID(hastaneId, selectedDuyuru.id);
        setDuyurular(prev => prev.filter(d => d.id !== selectedDuyuru.id));
        setShowDeleteModal(false);
      } catch (error) {
        console.error('Duyuru silinirken hata oluştu:', error);
      }
    }
  };

  const handleInputChange = (e) => {
    setNewDuyuru({
      ...newDuyuru,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    try {
      const duyuruData = {
        ...newDuyuru,
        tarih: new Date(newDuyuru.tarih).toISOString()
      };

      if (isEditing) {
        await updateDuyuruByHastaneID(hastaneId, newDuyuru.id, duyuruData);
      } else {
        await addDuyuruByHastaneID(hastaneId, duyuruData);
      }

      const updatedData = await getDuyurularByHastaneID(hastaneId);
      setDuyurular(updatedData.data);
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Duyuru kaydedilirken hata oluştu:', error);
    }
  };

  const resetForm = () => {
    setNewDuyuru({
      baslik: '',
      icerik: '',
      resim: '',
      tarih: new Date().toISOString().split('T')[0]
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
      <div className="duyuru-checking">
        <div className="duyuru-loading-alert-wrapper">
          <LoadingAnimation />
        </div>
        <p className="duyuru-loading-message">Duyurular yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="duyuru-main-container">
      <ActionButtonsSidebar
        hospitalId={hastaneId}
        hospitalName={hospitalName}
        noHospitalMessage="Hastane bilgisi yükleniyor..."
        onHospitalUpdate={handleHospitalUpdate}
      />
      <div className="duyuru-table-container">
        <button className="duyuru-add-new-btn" onClick={() => setShowModal(true)}>
          + Yeni Duyuru Ekle
        </button>

        <table className="duyuru-hasta-table">
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
            {duyurular.length > 0 ? (
              duyurular.map((duyuru) => (
                <tr key={duyuru.id}>
                  <td>{duyuru.id}</td>
                  <td>{duyuru.baslik}</td>
                  <td>{truncateContent(duyuru.icerik)}</td>
                  <td>{new Date(duyuru.tarih).toLocaleDateString('tr-TR')}</td>
                  <td><img src={duyuru.resim} width="100" alt="Duyuru resmi" /></td>
                  <td className="duyuru-actions">
                    <button className="duyuru-edit-btn" onClick={() => handleEditClick(duyuru.id)}>
                      Düzenle
                    </button>
                    <button className="duyuru-delete-btn" onClick={() => handleDeleteClick(duyuru)}>
                      Sil
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                  Kayıtlı duyuru bulunmamaktadır
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {showDeleteModal && (
          <div className="duyuru-modal-overlay">
            <div className="duyuru-confirmation-modal">
              <div className="duyuru-modal-header">
                <h3>Silme Onayı</h3>
                <button className="duyuru-close-btn" onClick={() => setShowDeleteModal(false)}>×</button>
              </div>
              <div className="duyuru-modal-content">
                <p><b>{selectedDuyuru?.baslik}</b> başlıklı duyuruyu silmek istediğinize emin misiniz?</p>
                <div className="duyuru-modal-actions">
                  <button className="duyuru-confirm-btn" onClick={confirmDelete}>Evet</button>
                  <button className="duyuru-cancel-btn" onClick={() => setShowDeleteModal(false)}>Hayır</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showModal && (
          <div className="duyuru-modal-overlay">
            <div className="duyuru-modal">
              <div className="duyuru-modal-header">
                <h2>{isEditing ? 'Duyuru Düzenle' : 'Yeni Duyuru Ekle'}</h2>
                <button className="duyuru-close-btn" onClick={() => { setShowModal(false); resetForm(); }}>×</button>
              </div>

              <form className="duyuru-modal-content">
                <div className="duyuru-form-columns">
                  <div className="duyuru-form-column">
                    <div className="duyuru-form-group">
                      <label>Başlık</label>
                      <input
                        type="text"
                        name="baslik"
                        value={newDuyuru.baslik}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="duyuru-form-group">
                      <label>İçerik</label>
                      <textarea
                        name="icerik"
                        value={newDuyuru.icerik}
                        onChange={handleInputChange}
                        rows="6"
                      />
                    </div>
                  </div>

                  <div className="duyuru-form-column">
                    <div className="duyuru-form-group">
                      <label>Resim URL</label>
                      <input
                        type="text"
                        name="resim"
                        value={newDuyuru.resim}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="duyuru-form-group">
                      <label>Tarih</label>
                      <input
                        type="date"
                        name="tarih"
                        value={newDuyuru.tarih}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="duyuru-modal-actions">
                  <button type="button" className="duyuru-confirm-btn" onClick={handleSave}>
                    {isEditing ? 'Güncelle' : 'Kaydet'}
                  </button>
                  <button type="button" className="duyuru-cancel-btn" onClick={() => { setShowModal(false); resetForm(); }}>
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

export default Duyurular;