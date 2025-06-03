import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomeHastane.css';
import { hastaneler, deleteHastane, addHastane, getIlveIlceDatas } from '../../../api/api-admin';
import LoadingAnimation from '../../../components/LoadingAnimation/LoadingAnimation';
import ActionButtonsSidebar from './ActionButtonsSidebar';

const HomeHastane = () => {
  const navigate = useNavigate();
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [loading, setLoading] = useState(true);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedIl, setSelectedIl] = useState('');
  const [selectedIlce, setSelectedIlce] = useState('');

  const [newHospital, setNewHospital] = useState({
    hastaneAdi: '',
    yatakKapasitesi: 0,
    aciklama: '',
    telNo: '',
    telNo2: '',
    email: '',
    ulke: '',
    mahalle: '',
    caddeSokak: '',
    disKapiNo: '',
    icKapiNo: '',
    il_ID: null,
    ilce_ID: null,
    misyon: '',
    vizyon: ''
  });

  const handleHospitalUpdate = async () => {
    const response = await hastaneler();
    setHospitals(response.data);
  };

  useEffect(() => {
    const fetchIlveIlceDatas = async () => {
      try {
        const response = await getIlveIlceDatas();
        setProvinces(response);
      } catch (error) {
        console.error('İl ve ilçe bilgileri yüklenemedi:', error);
      }
    };
    fetchIlveIlceDatas();
  }, []);

  useEffect(() => {
    if (selectedIl) {
      const selectedProvince = provinces.find(prov => prov.ilId === parseInt(selectedIl));
      setDistricts(selectedProvince ? selectedProvince.ilceBilgisi : []);
      setSelectedIlce('');
    } else {
      setDistricts([]);
      setSelectedIlce('');
    }
  }, [selectedIl, provinces]);

  const handleIlChange = (e) => {
    const ilId = e.target.value;
    setSelectedIl(ilId);
    setNewHospital(prev => ({ ...prev, il_ID: ilId ? parseInt(ilId) : null, ilce_ID: null }));
  };

  const handleIlceChange = (e) => {
    const ilceId = e.target.value;
    setSelectedIlce(ilceId);
    setNewHospital(prev => ({ ...prev, ilce_ID: ilceId ? parseInt(ilceId) : null }));
  };

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await hastaneler();
        setHospitals(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        if (error.response?.status === 401) {
          sessionStorage.removeItem('token');
          navigate('/giris');
        } else {
          console.error('Hastane verileri alınırken hata oluştu:', error);
        }
      }
    };
    fetchHospitals();
  }, [navigate]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (selectedHospital && params.has('delete')) {
      setShowDeleteModal(true);
    }
  }, [selectedHospital]);

  const handleHospitalClick = (hospital) => {
    setSelectedHospital(hospital);
  };

  const handleDeleteClick = (hospital, e) => {
    e.stopPropagation(); // Prevent row click from triggering
    setSelectedHospital(hospital);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (selectedHospital) {
      try {
        await deleteHastane(selectedHospital.id); // Pass hospitalId directly
        setHospitals((prev) => prev.filter((h) => h.id !== selectedHospital.id));
        setSelectedHospital(null);
        setShowDeleteModal(false);
      } catch (error) {
        console.error('Hastane silinirken hata oluştu:', error);
        alert('Hastane silinirken bir hata oluştu.');
      }
    }
  };

  const handleNewHospitalChange = (e) => {
    const { name, value } = e.target;
    setNewHospital({ ...newHospital, [name]: name === 'yatakKapasitesi' ? parseInt(value) || 0 : value });
  };

  const handleSaveNewHospital = async (e) => {
    e.preventDefault();
    try {
      if (!newHospital.hastaneAdi.trim()) {
        alert('Hastane adı zorunlu.');
        return;
      }
      if (!newHospital.il_ID || !newHospital.ilce_ID) {
        alert('Lütfen il ve ilçe seçin.');
        return;
      }

      await addHastane(newHospital);
      alert('Yeni hastane başarıyla eklendi!');
      setShowModal(false);
      setNewHospital({
        hastaneAdi: '',
        yatakKapasitesi: '',
        aciklama: '',
        telNo: '',
        telNo2: '',
        email: '',
        ulke: '',
        mahalle: '',
        caddeSokak: '',
        disKapiNo: '',
        icKapiNo: '',
        il_ID: null,
        ilce_ID: null,
        misyon: '',
        vizyon: ''
      });
      setSelectedIl('');
      setSelectedIlce('');
      const response = await hastaneler();
      setHospitals(response.data);
    } catch (error) {
      console.error('Yeni hastane eklenirken hata oluştu:', error);
      alert(`Hata: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleSort = (column) => {
    let order = 'asc';
    if (sortColumn === column && sortOrder === 'asc') {
      order = 'desc';
    }
    setSortColumn(column);
    setSortOrder(order);

    const sortedHospitals = [...hospitals].sort((a, b) => {
      if (a[column] < b[column]) return order === 'asc' ? -1 : 1;
      if (a[column] > b[column]) return order === 'asc' ? 1 : -1;
      return 0;
    });
    setHospitals(sortedHospitals);
  };

  const renderSortIcon = (column) => {
    if (sortColumn === column) {
      return sortOrder === 'asc' ? ' ▲' : ' ▼';
    }
    return '';
  };

  if (loading) {
    return (
      <div className="home-hastane-loading">
        <div className="home-hastane-loading-overlay">
          <LoadingAnimation />
        </div>
        <p className="home-hastane-loading-message">Bilgiler yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="home-hastane-main-container">
      <ActionButtonsSidebar
        hospitalId={selectedHospital?.id}
        hospitalName={selectedHospital?.hastaneAdi}
        noHospitalMessage="Lütfen bir hastane seçin"
        onHospitalUpdate={handleHospitalUpdate}
      />
      <div className="home-hastane-table-container">
        <button className="home-hastane-add-button" onClick={() => setShowModal(true)}>
          + Yeni Hastane Ekle
        </button>

        <table className="home-hastane-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('id')}>ID {renderSortIcon('id')}</th>
              <th onClick={() => handleSort('hastaneAdi')}>Hastane Adı {renderSortIcon('hastaneAdi')}</th>
              <th onClick={() => handleSort('yatakKapasitesi')}>Yatak Kapasitesi {renderSortIcon('yatakKapasitesi')}</th>
              <th onClick={() => handleSort('aciklama')}>Açıklama {renderSortIcon('aciklama')}</th>
              <th>İşlemler</th> {/* New Actions column */}
            </tr>
          </thead>
          <tbody>
            {hospitals.length > 0 ? (
              hospitals.map((hospital) => (
                <tr
                  key={hospital.id}
                  onClick={() => handleHospitalClick(hospital)}
                  className={selectedHospital?.id === hospital.id ? 'home-hastane-selected' : ''}
                >
                  <td>{hospital.id}</td>
                  <td>{hospital.hastaneAdi}</td>
                  <td>{hospital.yatakKapasitesi}</td>
                  <td>{hospital.aciklama}</td>
                  <td>
                    <button
                      className="home-hastane-delete-btn"
                      onClick={(e) => handleDeleteClick(hospital, e)}
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">Hastane bulunamadı.</td> {/* Updated colSpan for new column */}
              </tr>
            )}
          </tbody>
        </table>

        {showDeleteModal && (
          <div className="home-hastane-modal-overlay">
            <div className="home-hastane-modal">
              <div className="home-hastane-modal-header">
                <h3>Silme Onayı</h3>
                <button className="home-hastane-modal-close" onClick={() => setShowDeleteModal(false)}>×</button>
              </div>
              <div className="home-hastane-modal-content">
                <p><b>{selectedHospital?.hastaneAdi}</b> hastanesini silmek istediğinize emin misiniz?</p>
                <div className="home-hastane-modal-actions">
                  <button className="home-hastane-modal-confirm" onClick={confirmDelete}>Evet</button>
                  <button className="home-hastane-modal-cancel" onClick={() => setShowDeleteModal(false)}>Hayır</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showModal && (
          <div className="home-hastane-modal-overlay">
            <div className="home-hastane-modal">
              <div className="home-hastane-modal-header">
                <h2>Yeni Hastane Ekle</h2>
                <button className="home-hastane-modal-close" onClick={() => setShowModal(false)}>×</button>
              </div>

              <form className="home-hastane-modal-content" onSubmit={handleSaveNewHospital}>
                <div className="home-hastane-form-columns">
                  <div className="home-hastane-form-column">
                    <div className="home-hastane-form-group">
                      <label>Hastane Adı</label>
                      <input
                        type="text"
                        name="hastaneAdi"
                        placeholder="Hastane Adı"
                        value={newHospital.hastaneAdi}
                        onChange={handleNewHospitalChange}
                        required
                      />
                    </div>

                    <div className="home-hastane-form-group">
                      <label>Yatak Kapasitesi</label>
                      <input
                        type="number"
                        name="yatakKapasitesi"
                        placeholder="Yatak kapasitesi"
                        value={newHospital.yatakKapasitesi}
                        onChange={handleNewHospitalChange}
                        min="0"
                      />
                    </div>

                    <div className="home-hastane-form-group">
                      <label>İletişim Bilgileri</label>
                      <input
                        type="text"
                        name="telNo"
                        placeholder="Telefon"
                        value={newHospital.telNo}
                        onChange={handleNewHospitalChange}
                      />
                      <input
                        type="text"
                        name="telNo2"
                        placeholder="Diğer Telefon"
                        value={newHospital.telNo2}
                        onChange={handleNewHospitalChange}
                      />
                      <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={newHospital.email}
                        onChange={handleNewHospitalChange}
                      />
                    </div>

                    <div className="home-hastane-form-group">
                      <label>Adres Bilgileri</label>
                      <input
                        type="text"
                        name="ulke"
                        placeholder="Ülke"
                        value={newHospital.ulke}
                        onChange={handleNewHospitalChange}
                      />
                      <div className="home-hastane-form-group">
                        <label>İl</label>
                        <select
                          value={selectedIl}
                          onChange={handleIlChange}
                          required
                        >
                          <option value="">İl Seçin</option>
                          {provinces.map(province => (
                            <option key={province.ilId} value={province.ilId}>
                              {province.ilAdi}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="home-hastane-form-group">
                        <label>İlçe</label>
                        <select
                          value={selectedIlce}
                          onChange={handleIlceChange}
                          disabled={!selectedIl}
                          required
                        >
                          <option value="">İlçe Seçin</option>
                          {districts.map(district => (
                            <option key={district.id} value={district.id}>
                              {district.ilceAdi}
                            </option>
                          ))}
                        </select>
                      </div>
                      <input
                        type="text"
                        name="mahalle"
                        placeholder="Mahalle"
                        value={newHospital.mahalle}
                        onChange={handleNewHospitalChange}
                      />
                      <input
                        type="text"
                        name="caddeSokak"
                        placeholder="Cadde/Sokak"
                        value={newHospital.caddeSokak}
                        onChange={handleNewHospitalChange}
                      />
                      <div className="home-hastane-input-group">
                        <input
                          type="text"
                          name="disKapiNo"
                          placeholder="Dış Kapı No"
                          value={newHospital.disKapiNo}
                          onChange={handleNewHospitalChange}
                        />
                        <input
                          type="text"
                          name="icKapiNo"
                          placeholder="İç Kapı No"
                          value={newHospital.icKapiNo}
                          onChange={handleNewHospitalChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="home-hastane-form-column">
                    <div className="home-hastane-form-group">
                      <label>Açıklama</label>
                      <textarea
                        name="aciklama"
                        placeholder="Açıklama girin..."
                        value={newHospital.aciklama}
                        onChange={handleNewHospitalChange}
                        rows="3"
                      />
                    </div>

                    <div className="home-hastane-form-group">
                      <label>Misyon</label>
                      <textarea
                        name="misyon"
                        placeholder="Misyonunuzu girin..."
                        value={newHospital.misyon}
                        onChange={handleNewHospitalChange}
                        rows="3"
                      />
                    </div>

                    <div className="home-hastane-form-group">
                      <label>Vizyon</label>
                      <textarea
                        name="vizyon"
                        placeholder="Vizyonunuzu girin..."
                        value={newHospital.vizyon}
                        onChange={handleNewHospitalChange}
                        rows="3"
                      />
                    </div>
                  </div>
                </div>

                <div className="home-hastane-modal-actions">
                  <button type="submit" className="home-hastane-modal-confirm">Ekle</button>
                  <button type="button" className="home-hastane-modal-cancel" onClick={() => setShowModal(false)}>İptal</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeHastane;