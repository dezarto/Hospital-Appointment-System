import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getTumRandevular,
  deleteRandevu,
  getHastaneById
} from '../../../api/api-admin';
import LoadingAnimation from '../../../components/LoadingAnimation/LoadingAnimation';
import ActionButtonsSidebar from '../Home/ActionButtonsSidebar';
import './Randevu.css';

const Randevu = () => {
  const navigate = useNavigate();
  const { hastaneId } = useParams();
  const [randevular, setRandevular] = useState([]);
  const [selectedRandevu, setSelectedRandevu] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [loading, setLoading] = useState(true);
  const [hospitalName, setHospitalName] = useState('');

  useEffect(() => {
    const fetchRandevular = async () => {
      try {
        // Fetch hospital name
        const hospitalResponse = await getHastaneById(hastaneId);
        setHospitalName(hospitalResponse.data.hastaneAdi || 'Hastane');

        // Fetch appointments
        const response = await getTumRandevular(hastaneId);
        setRandevular(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        if (error.response?.status === 401) {
          sessionStorage.removeItem('token');
          navigate('/giris');
        } else {
          console.error('Randevu verileri alınırken hata oluştu:', error);
        }
      }
    };
    fetchRandevular();
  }, [hastaneId, navigate]);

  const handleSort = (column) => {
    let order = 'asc';
    if (sortColumn === column && sortOrder === 'asc') {
      order = 'desc';
    }
    setSortColumn(column);
    setSortOrder(order);

    const sortedRandevular = [...randevular].sort((a, b) => {
      const aValue = a.randevuDetay[column];
      const bValue = b.randevuDetay[column];
      if (aValue < bValue) return order === 'asc' ? -1 : 1;
      if (aValue > bValue) return order === 'asc' ? 1 : -1;
      return 0;
    });
    setRandevular(sortedRandevular);
  };

  const renderSortIcon = (column) => {
    if (sortColumn === column) {
      return sortOrder === 'asc' ? ' ▲' : ' ▼';
    }
    return '';
  };

  const handleDeleteClick = (randevu) => {
    setSelectedRandevu(randevu);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (selectedRandevu) {
      try {
        await deleteRandevu(selectedRandevu.randevuID);
        const updatedData = await getTumRandevular(hastaneId);
        setRandevular(updatedData.data);
        setShowDeleteModal(false);
      } catch (error) {
        console.error('Randevu silinirken hata oluştu:', error);
      }
    }
  };

  const formatTime = (time) => {
    if (!time) return '-';
    const date = new Date(`1970-01-01T${time}`);
    return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="randevu-checking">
        <div className="randevu-loading-alert-wrapper">
          <LoadingAnimation />
        </div>
        <p className="randevu-loading-message">Randevular yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="randevu-main-container">
      <ActionButtonsSidebar
        hospitalId={hastaneId}
        hospitalName={hospitalName}
        noHospitalMessage="Hastane bilgisi yükleniyor..."
      />
      <div className="randevu-table-container">
        <table className="randevu-hasta-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('RandevuID')}>ID {renderSortIcon('RandevuID')}</th>
              <th>Doktor</th>
              <th>Hasta</th>
              <th onClick={() => handleSort('Poliklinik_ID')}>Poliklinik {renderSortIcon('Poliklinik_ID')}</th>
              <th onClick={() => handleSort('RandevuTarihi')}>Tarih {renderSortIcon('RandevuTarihi')}</th>
              <th>Saat</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {randevular.length > 0 ? (
              randevular.map((randevu) => (
                <tr key={randevu.randevuID}>
                  <td>{randevu.randevuID}</td>
                  <td>
                    {randevu.doktor?.isim} {randevu.doktor?.soyisim}
                    <br /><small>TC: {randevu.doktor?.doktor_TC}</small>
                  </td>
                  <td>
                    {randevu.Hasta?.Isim} {randevu.Hasta?.Soyisim}
                    <br /><small>TC: {randevu.hasta?.hasta_TC}</small>
                  </td>
                  <td>{randevu.randevuDetay.poliklinik_ID}</td>
                  <td>
                    {randevu.randevuDetay.randevuTarihi ?
                      new Date(randevu.randevuDetay.randevuTarihi).toLocaleDateString('tr-TR') : '-'}
                  </td>
                  <td>
                    {formatTime(randevu.randevuDetay.baslangıcSaati)} -
                    {formatTime(randevu.randevuDetay.bitisSaati)}
                  </td>
                  <td className="randevu-actions">
                    <button
                      className="randevu-delete-btn"
                      onClick={() => handleDeleteClick(randevu)}
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                  Kayıtlı randevu bulunmamaktadır
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {showDeleteModal && (
          <div className="randevu-modal-overlay">
            <div className="randevu-confirmation-modal">
              <div className="randevu-modal-header">
                <h3>Silme Onayı</h3>
                <button className="randevu-close-btn" onClick={() => setShowDeleteModal(false)}>×</button>
              </div>
              <div className="randevu-modal-content">
                <p>
                  <b>{selectedRandevu?.randevuID}</b> ID'li randevuyu silmek istediğinize emin misiniz?
                </p>
                <div className="randevu-modal-actions">
                  <button className="randevu-confirm-btn" onClick={confirmDelete}>Evet</button>
                  <button className="randevu-cancel-btn" onClick={() => setShowDeleteModal(false)}>Hayır</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Randevu;