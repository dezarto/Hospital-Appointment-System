import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getHaberlerByHastaneID,
  getHaberByHastaneIDAndHaberID,
  addHaberByHastaneID,
  deleteHaberByHastaneIDAndHaberID,
  updateHaberByHastaneID,
  getHastaneById
} from '../../../api/api-admin';
import LoadingAnimation from '../../../components/LoadingAnimation/LoadingAnimation';
import ActionButtonsSidebar from '../Home/ActionButtonsSidebar';
import './Haber.css';

const Haberler = () => {
  const { hastaneId } = useParams();
  const navigate = useNavigate();
  const [haberler, setHaberler] = useState([]);
  const [selectedHaber, setSelectedHaber] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [hospitalName, setHospitalName] = useState('');
  const [newHaber, setNewHaber] = useState({
    baslik: '',
    icerik: '',
    resim: '',
    tarih: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const hospitalResponse = await getHastaneById(hastaneId);
        setHospitalName(hospitalResponse.data.hastaneAdi || 'Hastane');
        const haberlerResponse = await getHaberlerByHastaneID(hastaneId);
        setHaberler(haberlerResponse.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        if (error.response?.status === 401) {
          sessionStorage.removeItem('token');
          navigate('/giris');
        } else {
          console.error('Veriler alınırken hata oluştu:', error);
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

    const sortedHaberler = [...haberler].sort((a, b) => {
      if (a[column] < b[column]) return order === 'asc' ? -1 : 1;
      if (a[column] > b[column]) return order === 'asc' ? 1 : -1;
      return 0;
    });
    setHaberler(sortedHaberler);
  };

  const renderSortIcon = (column) => {
    if (sortColumn === column) {
      return sortOrder === 'asc' ? ' ▲' : ' ▼';
    }
    return '';
  };

  const handleEditClick = async (haberId) => {
    try {
      const data = await getHaberByHastaneIDAndHaberID(hastaneId, haberId);
      setNewHaber({
        ...data,
        tarih: data.tarih.split('T')[0]
      });
      setIsEditing(true);
      setShowModal(true);
    } catch (error) {
      console.error('Haber bilgileri alınırken hata oluştu:', error);
    }
  };

  const handleDeleteClick = (haber) => {
    setSelectedHaber(haber);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (selectedHaber) {
      try {
        await deleteHaberByHastaneIDAndHaberID(hastaneId, selectedHaber.id);
        setHaberler(prev => prev.filter(h => h.id !== selectedHaber.id));
        setShowDeleteModal(false);
      } catch (error) {
        console.error('Haber silinirken hata oluştu:', error);
      }
    }
  };

  const handleInputChange = (e) => {
    setNewHaber({
      ...newHaber,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    try {
      const haberData = {
        ...newHaber,
        tarih: new Date(newHaber.tarih).toISOString()
      };

      if (isEditing) {
        await updateHaberByHastaneID(hastaneId, newHaber.id, haberData);
      } else {
        await addHaberByHastaneID(hastaneId, haberData);
      }

      const updatedData = await getHaberlerByHastaneID(hastaneId);
      setHaberler(updatedData.data);
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Haber kaydedilirken hata oluştu:', error);
    }
  };

  const resetForm = () => {
    setNewHaber({
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
      <div className="haberler-checking">
        <div className="haberler-loading-alert-wrapper">
          <LoadingAnimation />
        </div>
        <p className="haberler-loading-message">Haberler yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="haberler-main-container">
      <ActionButtonsSidebar
        hospitalId={hastaneId}
        hospitalName={hospitalName}
        noHospitalMessage="Hastane bilgisi yükleniyor..."
      />
      <div className="haberler-table-container">
        <button className="haberler-add-new-btn" onClick={() => setShowModal(true)}>
          + Yeni Haber Ekle
        </button>

        <table className="haberler-hasta-table">
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
            {haberler.length > 0 ? (
              haberler.map((haber) => (
                <tr key={haber.id}>
                  <td>{haber.id}</td>
                  <td>{haber.baslik}</td>
                  <td>{truncateContent(haber.icerik)}</td>
                  <td>{new Date(haber.tarih).toLocaleDateString('tr-TR')}</td>
                  <td><img src={haber.resim} width="100" alt="Haber resmi" /></td>
                  <td className="haberler-actions">
                    <button className="haberler-edit-btn" onClick={() => handleEditClick(haber.id)}>
                      Düzenle
                    </button>
                    <button className="haberler-delete-btn" onClick={() => handleDeleteClick(haber)}>
                      Sil
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                  Kayıtlı haber bulunmamaktadır
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {showDeleteModal && (
          <div className="haberler-modal-overlay">
            <div className="haberler-confirmation-modal">
              <div className="haberler-modal-header">
                <h3>Silme Onayı</h3>
                <button className="haberler-close-btn" onClick={() => setShowDeleteModal(false)}>×</button>
              </div>
              <div className="haberler-modal-content">
                <p><b>{selectedHaber?.baslik}</b> başlıklı haberi silmek istediğinize emin misiniz?</p>
                <div className="haberler-modal-actions">
                  <button className="haberler-confirm-btn" onClick={confirmDelete}>Evet</button>
                  <button className="haberler-cancel-btn" onClick={() => setShowDeleteModal(false)}>Hayır</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showModal && (
          <div className="haberler-modal-overlay">
            <div className="haberler-modal">
              <div className="haberler-modal-header">
                <h2>{isEditing ? 'Haber Düzenle' : 'Yeni Haber Ekle'}</h2>
                <button className="haberler-close-btn" onClick={() => { setShowModal(false); resetForm(); }}>×</button>
              </div>

              <form className="haberler-modal-content">
                <div className="haberler-form-columns">
                  <div className="haberler-form-column">
                    <div className="haberler-form-group">
                      <label>Başlık</label>
                      <input
                        type="text"
                        name="baslik"
                        value={newHaber.baslik}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="haberler-form-group">
                      <label>İçerik</label>
                      <textarea
                        name="icerik"
                        value={newHaber.icerik}
                        onChange={handleInputChange}
                        rows="6"
                      />
                    </div>
                  </div>

                  <div className="haberler-form-column">
                    <div className="haberler-form-group">
                      <label>Resim URL</label>
                      <input
                        type="text"
                        name="resim"
                        value={newHaber.resim}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="haberler-form-group">
                      <label>Tarih</label>
                      <input
                        type="date"
                        name="tarih"
                        value={newHaber.tarih}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="haberler-modal-actions">
                  <button type="button" className="haberler-confirm-btn" onClick={handleSave}>
                    {isEditing ? 'Güncelle' : 'Kaydet'}
                  </button>
                  <button type="button" className="haberler-cancel-btn" onClick={() => { setShowModal(false); resetForm(); }}>
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

export default Haberler;