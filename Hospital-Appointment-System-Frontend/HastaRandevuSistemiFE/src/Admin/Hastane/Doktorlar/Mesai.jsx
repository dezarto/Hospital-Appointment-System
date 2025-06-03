import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getMesailerByDoktorTC,
  addDoktorMesai,
  deleteAllMesaiByDoktor,
  deleteMesaiByDoktor,
  getHastaneById
} from '../../../api/api-admin';
import LoadingAnimation from '../../../components/LoadingAnimation/LoadingAnimation';
import ActionButtonsSidebar from '../Home/ActionButtonsSidebar';
import './Mesai.css';

const Mesai = () => {
  const { hastaneId, doktorTC } = useParams();
  const navigate = useNavigate();
  const [mesailer, setMesailer] = useState([]);
  const [selectedMesai, setSelectedMesai] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [loading, setLoading] = useState(true);
  const [hospitalName, setHospitalName] = useState('');
  const [newMesai, setNewMesai] = useState({
    tarih: '',
    baslangicSaati: '',
    bitisSaati: ''
  });

  useEffect(() => {
    const fetchMesailer = async () => {
      try {
        // Fetch hospital name
        const hospitalResponse = await getHastaneById(hastaneId);
        setHospitalName(hospitalResponse.data.hastaneAdi || 'Hastane');

        // Fetch shifts
        const response = await getMesailerByDoktorTC(hastaneId, doktorTC);
        setMesailer(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        if (error.response?.status === 401) {
          sessionStorage.removeItem('token');
          navigate('/giris');
        } else {
          console.error('Mesai verileri alınırken hata oluştu:', error);
        }
      }
    };
    fetchMesailer();
  }, [hastaneId, doktorTC, navigate]);

  const handleSort = (column) => {
    let order = 'asc';
    if (sortColumn === column && sortOrder === 'asc') {
      order = 'desc';
    }
    setSortColumn(column);
    setSortOrder(order);

    const sortedMesailer = [...mesailer].sort((a, b) => {
      if (a[column] < b[column]) return order === 'asc' ? -1 : 1;
      if (a[column] > b[column]) return order === 'asc' ? 1 : -1;
      return 0;
    });
    setMesailer(sortedMesailer);
  };

  const renderSortIcon = (column) => {
    if (sortColumn === column) {
      return sortOrder === 'asc' ? ' ▲' : ' ▼';
    }
    return '';
  };

  const handleDeleteClick = (mesai) => {
    setSelectedMesai(mesai);
    setShowDeleteModal(true);
  };

  const handleDeleteAllClick = () => {
    setShowDeleteAllModal(true);
  };

  const confirmDelete = async () => {
    if (selectedMesai) {
      try {
        await deleteMesaiByDoktor(hastaneId, doktorTC, selectedMesai.mesaiID);
        setMesailer(prev => prev.filter(m => m.mesaiID !== selectedMesai.mesaiID));
        setShowDeleteModal(false);
      } catch (error) {
        console.error('Mesai silinirken hata oluştu:', error);
      }
    }
  };

  const confirmDeleteAll = async () => {
    try {
      await deleteAllMesaiByDoktor(hastaneId, doktorTC);
      setMesailer([]);
      setShowDeleteAllModal(false);
    } catch (error) {
      console.error('Tüm mesailer silinirken hata oluştu:', error);
    }
  };

  const handleInputChange = (e) => {
    setNewMesai({
      ...newMesai,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    try {
      const mesaiData = {
        ...newMesai,
        tarih: new Date(newMesai.tarih).toISOString()
      };

      await addDoktorMesai(doktorTC, mesaiData);
      const updatedData = await getMesailerByDoktorTC(hastaneId, doktorTC);
      setMesailer(updatedData.data);
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Mesai kaydedilirken hata oluştu:', error);
    }
  };

  const resetForm = () => {
    setNewMesai({
      tarih: '',
      baslangicSaati: '',
      bitisSaati: ''
    });
  };

  const formatTime = (time) => {
    if (!time) return '-';
    return time.substring(0, 5); // HH:mm formatına çevir
  };

  if (loading) {
    return (
      <div className="mesai-checking">
        <div className="mesai-loading-alert-wrapper">
          <LoadingAnimation />
        </div>
        <p className="mesai-loading-message">Mesailer yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="mesai-main-container">
      <ActionButtonsSidebar
        hospitalId={hastaneId}
        hospitalName={hospitalName}
        noHospitalMessage="Hastane bilgisi yükleniyor..."
      />
      <div className="mesai-table-container">
        <div className="mesai-button-group">
          <button className="mesai-add-new-btn" onClick={() => setShowModal(true)}>
            + Yeni Mesai Ekle
          </button>
          <button className="mesai-delete-all-btn" onClick={handleDeleteAllClick}>
            Tümünü Temizle
          </button>
        </div>

        <table className="mesai-hasta-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('mesaiID')}>ID {renderSortIcon('mesaiID')}</th>
              <th onClick={() => handleSort('tarih')}>Tarih {renderSortIcon('tarih')}</th>
              <th>Başlangıç Saati</th>
              <th>Bitiş Saati</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {mesailer.length > 0 ? (
              mesailer.map((mesai) => (
                <tr key={mesai.mesaiID}>
                  <td>{mesai.mesaiID}</td>
                  <td>{new Date(mesai.tarih).toLocaleDateString('tr-TR')}</td>
                  <td>{formatTime(mesai.baslangicSaati)}</td>
                  <td>{formatTime(mesai.bitisSaati)}</td>
                  <td className="mesai-actions">
                    <button
                      className="mesai-delete-btn"
                      onClick={() => handleDeleteClick(mesai)}
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                  Kayıtlı mesai bulunmamaktadır
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {showDeleteModal && (
          <div className="mesai-modal-overlay">
            <div className="mesai-confirmation-modal">
              <div className="mesai-modal-header">
                <h3>Silme Onayı</h3>
                <button className="mesai-close-btn" onClick={() => setShowDeleteModal(false)}>×</button>
              </div>
              <div className="mesai-modal-content">
                <p><b>{selectedMesai?.mesaiID}</b> ID'li mesaiyi silmek istediğinize emin misiniz?</p>
                <div className="mesai-modal-actions">
                  <button className="mesai-confirm-btn" onClick={confirmDelete}>Evet</button>
                  <button className="mesai-cancel-btn" onClick={() => setShowDeleteModal(false)}>Hayır</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showDeleteAllModal && (
          <div className="mesai-modal-overlay">
            <div className="mesai-confirmation-modal">
              <div className="mesai-modal-header">
                <h3>Silme Onayı</h3>
                <button className="mesai-close-btn" onClick={() => setShowDeleteAllModal(false)}>×</button>
              </div>
              <div className="mesai-modal-content">
                <p>Tüm mesai kayıtlarını silmek istediğinize emin misiniz?</p>
                <div className="mesai-modal-actions">
                  <button className="mesai-confirm-btn" onClick={confirmDeleteAll}>Evet</button>
                  <button className="mesai-cancel-btn" onClick={() => setShowDeleteAllModal(false)}>Hayır</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showModal && (
          <div className="mesai-modal-overlay">
            <div className="mesai-modal">
              <div className="mesai-modal-header">
                <h2>Yeni Mesai Ekle</h2>
                <button className="mesai-close-btn" onClick={() => { setShowModal(false); resetForm(); }}>×</button>
              </div>

              <form className="mesai-modal-content">
                <div className="mesai-form-columns">
                  <div className="mesai-form-column">
                    <div className="mesai-form-group">
                      <label>Tarih</label>
                      <input
                        type="date"
                        name="tarih"
                        value={newMesai.tarih}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="mesai-form-group">
                      <label>Başlangıç Saati</label>
                      <input
                        type="time"
                        name="baslangicSaati"
                        value={newMesai.baslangicSaati}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="mesai-form-group">
                      <label>Bitiş Saati</label>
                      <input
                        type="time"
                        name="bitisSaati"
                        value={newMesai.bitisSaati}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="mesai-modal-actions">
                  <button type="button" className="mesai-confirm-btn" onClick={handleSave}>
                    Kaydet
                  </button>
                  <button type="button" className="mesai-cancel-btn" onClick={() => { setShowModal(false); resetForm(); }}>
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

export default Mesai;