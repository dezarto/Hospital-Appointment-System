import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getPolikliniklerByHastaneAndBolumID,
  addPoliklinikByHastaneID,
  deletePoliklinikByHastaneIDAndPoliklinikID,
  updatePoliklinikByHastaneID,
  getIlveIlceDatas,
  getHastaneById
} from '../../../../api/api-admin';
import LoadingAnimation from '../../../../components/LoadingAnimation/LoadingAnimation';
import ActionButtonsSidebar from '../../Home/ActionButtonsSidebar';
import './Poliklinikler.css';

const Poliklinikler = () => {
  const { hastaneId, bolumID } = useParams();
  const navigate = useNavigate();
  const [poliklinikler, setPoliklinikler] = useState([]);
  const [selectedPoliklinik, setSelectedPoliklinik] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [hospitalName, setHospitalName] = useState('');

  // İl ve ilçe verileri için durumlar
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedIl, setSelectedIl] = useState('');
  const [selectedIlce, setSelectedIlce] = useState('');

  const [formData, setFormData] = useState({
    poliklinikBilgisi: {
      poliklinikAdi: '',
      iletisim_ID: 0,
      adres_ID: 0
    },
    adresBilgisi: {
      ulke: '',
      mahalle: '',
      caddeSokak: '',
      disKapiNo: '',
      icKapiNo: '',
      il_ID: 0,
      ilce_ID: 0
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

  // İl ve ilçe verilerini çekme
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

  // İl seçildiğinde ilçeleri güncelle
  useEffect(() => {
    if (selectedIl) {
      const selectedProvince = provinces.find(prov => prov.ilId === parseInt(selectedIl));
      const newDistricts = selectedProvince ? selectedProvince.ilceBilgisi : [];
      setDistricts(newDistricts);
      if (isEditing && formData.adresBilgisi.ilce_ID) {
        setSelectedIlce(formData.adresBilgisi.ilce_ID.toString());
      } else {
        setSelectedIlce('');
      }
    } else {
      setDistricts([]);
      setSelectedIlce('');
    }
  }, [selectedIl, provinces, isEditing, formData.adresBilgisi.ilce_ID]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch hospital name
        const hospitalResponse = await getHastaneById(hastaneId);
        setHospitalName(hospitalResponse.data.hastaneAdi || 'Hastane');

        // Fetch poliklinikler
        const response = await getPolikliniklerByHastaneAndBolumID(hastaneId, bolumID);
        setPoliklinikler(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        if (error.response?.status === 401) {
          sessionStorage.removeItem('token');
          navigate('/giris');
        } else {
          console.error('Poliklinik verileri alınırken hata oluştu:', error);
        }
      }
    };
    fetchData();
  }, [hastaneId, bolumID, navigate]);

  const handleSort = (column) => {
    let order = 'asc';
    if (sortColumn === column && sortOrder === 'asc') {
      order = 'desc';
    }
    setSortColumn(column);
    setSortOrder(order);

    const sortedPoliklinikler = [...poliklinikler].sort((a, b) => {
      const aValue = a.poliklinikBilgisi[column];
      const bValue = b.poliklinikBilgisi[column];
      if (aValue < bValue) return order === 'asc' ? -1 : 1;
      if (aValue > bValue) return order === 'asc' ? 1 : -1;
      return 0;
    });
    setPoliklinikler(sortedPoliklinikler);
  };

  const renderSortIcon = (column) => {
    if (sortColumn === column) {
      return sortOrder === 'asc' ? ' ▲' : ' ▼';
    }
    return '';
  };

  const handleEditClick = (poliklinikID) => {
    const poliklinikToEdit = poliklinikler.find(p => p.poliklinikBilgisi.poliklinikID === poliklinikID);
    if (poliklinikToEdit) {
      setFormData({
        poliklinikBilgisi: { ...poliklinikToEdit.poliklinikBilgisi },
        adresBilgisi: { ...poliklinikToEdit.adresBilgisi },
        iletisimBilgisi: { ...poliklinikToEdit.iletisimBilgisi }
      });
      setSelectedIl(poliklinikToEdit.adresBilgisi.il_ID.toString());
      setIsEditing(true);
      setShowModal(true);
    }
  };

  const handleDoktorlarClick = (poliklinikID) => {
    navigate(`doktorlar/${poliklinikID}`);
  };

  const handleDeleteClick = (poliklinik) => {
    setSelectedPoliklinik(poliklinik);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (selectedPoliklinik) {
      try {
        await deletePoliklinikByHastaneIDAndPoliklinikID(
          hastaneId,
          selectedPoliklinik.poliklinikBilgisi.poliklinikID,
          bolumID
        );
        setPoliklinikler(prev => prev.filter(p =>
          p.poliklinikBilgisi.poliklinikID !== selectedPoliklinik.poliklinikBilgisi.poliklinikID
        ));
        setShowDeleteModal(false);
      } catch (error) {
        console.error('Poliklinik silinirken hata oluştu:', error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      poliklinikBilgisi: {
        ...prev.poliklinikBilgisi,
        [name]: value
      }
    }));
  };

  const handleAdresChange = (e) => {
    const { name, value } = e.target;
    if (name === 'il_ID') {
      setSelectedIl(value);
      setFormData(prev => ({
        ...prev,
        adresBilgisi: {
          ...prev.adresBilgisi,
          il_ID: parseInt(value) || 0,
          ilce_ID: 0
        }
      }));
    } else if (name === 'ilce_ID') {
      setSelectedIlce(value);
      setFormData(prev => ({
        ...prev,
        adresBilgisi: {
          ...prev.adresBilgisi,
          ilce_ID: parseInt(value) || 0
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        adresBilgisi: {
          ...prev.adresBilgisi,
          [name]: value
        }
      }));
    }
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
        poliklinikBilgisi: {
          ...formData.poliklinikBilgisi,
          iletisim_ID: formData.iletisimBilgisi.id || 0,
          adres_ID: formData.adresBilgisi.id || 0
        }
      };

      if (isEditing) {
        await updatePoliklinikByHastaneID(
          payload,
          hastaneId,
          formData.poliklinikBilgisi.poliklinikID
        );
      } else {
        await addPoliklinikByHastaneID(payload, hastaneId, bolumID);
      }

      const updatedData = await getPolikliniklerByHastaneAndBolumID(hastaneId, bolumID);
      setPoliklinikler(updatedData.data);
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Poliklinik kaydedilirken hata oluştu:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      poliklinikBilgisi: {
        poliklinikAdi: '',
        iletisim_ID: 0,
        adres_ID: 0
      },
      adresBilgisi: {
        ulke: '',
        mahalle: '',
        caddeSokak: '',
        disKapiNo: '',
        icKapiNo: '',
        il_ID: 0,
        ilce_ID: 0
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
    setSelectedIl('');
    setSelectedIlce('');
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="poliklinikler-checking">
        <div className="poliklinikler-loading-alert-wrapper">
          <LoadingAnimation />
        </div>
        <p className="poliklinikler-loading-message">Poliklinikler yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="poliklinikler-main-container">
      <ActionButtonsSidebar
        hospitalId={hastaneId}
        hospitalName={hospitalName}
        noHospitalMessage="Hastane bilgisi yükleniyor..."
      />
      <div className="poliklinikler-table-container">
        <button
          className="poliklinikler-add-new-btn"
          onClick={() => {
            setShowModal(true);
            setIsEditing(false);
            resetForm();
            setSelectedIl('');
            setSelectedIlce('');
          }}
        >
          + Yeni Poliklinik Ekle
        </button>

        <table className="poliklinikler-hasta-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('poliklinikID')}>ID {renderSortIcon('poliklinikID')}</th>
              <th onClick={() => handleSort('poliklinikAdi')}>Poliklinik Adı {renderSortIcon('poliklinikAdi')}</th>
              <th onClick={() => handleSort('iletisim_ID')}>İletişim ID {renderSortIcon('iletisim_ID')}</th>
              <th onClick={() => handleSort('adres_ID')}>Adres ID {renderSortIcon('adres_ID')}</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {poliklinikler.length > 0 ? (
              poliklinikler.map((poliklinik) => (
                <tr key={poliklinik.poliklinikBilgisi.poliklinikID}>
                  <td>{poliklinik.poliklinikBilgisi.poliklinikID}</td>
                  <td>{poliklinik.poliklinikBilgisi.poliklinikAdi}</td>
                  <td>{poliklinik.poliklinikBilgisi.iletisim_ID}</td>
                  <td>{poliklinik.poliklinikBilgisi.adres_ID}</td>
                  <td className="poliklinikler-actions">
                    <button
                      className="poliklinikler-edit-btn"
                      onClick={() => handleEditClick(poliklinik.poliklinikBilgisi.poliklinikID)}
                    >
                      Düzenle
                    </button>
                    <button
                      className="poliklinikler-news-btn"
                      onClick={() => handleDoktorlarClick(poliklinik.poliklinikBilgisi.poliklinikID)}
                    >
                      Doktorlar
                    </button>
                    <button
                      className="poliklinikler-delete-btn"
                      onClick={() => handleDeleteClick(poliklinik)}
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                  Kayıtlı poliklinik bulunmamaktadır
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {showDeleteModal && (
          <div className="poliklinikler-modal-overlay">
            <div className="poliklinikler-confirmation-modal">
              <div className="poliklinikler-modal-header">
                <h3>Silme Onayı</h3>
                <button className="poliklinikler-close-btn" onClick={() => setShowDeleteModal(false)}>×</button>
              </div>
              <div className="poliklinikler-modal-content">
                <p>
                  <b>{selectedPoliklinik?.poliklinikBilgisi.poliklinikAdi}</b> isimli poliklinik silmek istediğinize emin misiniz?
                </p>
                <div className="poliklinikler-modal-actions">
                  <button className="poliklinikler-confirm-btn" onClick={confirmDelete}>Evet</button>
                  <button className="poliklinikler-cancel-btn" onClick={() => setShowDeleteModal(false)}>Hayır</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showModal && (
          <div className="poliklinikler-modal-overlay">
            <div className="poliklinikler-modal">
              <div className="poliklinikler-modal-header">
                <h2>{isEditing ? 'Poliklinik Düzenle' : 'Yeni Poliklinik Ekle'}</h2>
                <button className="poliklinikler-close-btn" onClick={() => { setShowModal(false); resetForm(); }}>×</button>
              </div>

              <form className="poliklinikler-modal-content">
                <div className="poliklinikler-form-columns">
                  <div className="poliklinikler-form-column">
                    <div className="poliklinikler-form-group">
                      <label>Poliklinik Adı</label>
                      <input
                        type="text"
                        name="poliklinikAdi"
                        value={formData.poliklinikBilgisi.poliklinikAdi}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="poliklinikler-form-group">
                      <h3>Adres Bilgileri</h3>
                      <div className="poliklinikler-form-group">
                        <label>Ülke</label>
                        <input
                          type="text"
                          name="ulke"
                          value={formData.adresBilgisi.ulke || ''}
                          onChange={handleAdresChange}
                        />
                      </div>
                      <div className="poliklinikler-form-group">
                        <label>İl</label>
                        <select
                          name="il_ID"
                          value={selectedIl}
                          onChange={handleAdresChange}
                        >
                          <option value="">İl Seçiniz</option>
                          {provinces.map((province) => (
                            <option key={province.ilId} value={province.ilId}>
                              {province.ilAdi}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="poliklinikler-form-group">
                        <label>İlçe</label>
                        <select
                          name="ilce_ID"
                          value={selectedIlce}
                          onChange={handleAdresChange}
                          disabled={!selectedIl}
                        >
                          <option value="">İlçe Seçiniz</option>
                          {districts.map((district) => (
                            <option key={district.id} value={district.id}>
                              {district.ilceAdi}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="poliklinikler-form-group">
                        <label>Mahalle</label>
                        <input
                          type="text"
                          name="mahalle"
                          value={formData.adresBilgisi.mahalle || ''}
                          onChange={handleAdresChange}
                        />
                      </div>
                      <div className="poliklinikler-form-group">
                        <label>Cadde/Sokak</label>
                        <input
                          type="text"
                          name="caddeSokak"
                          value={formData.adresBilgisi.caddeSokak || ''}
                          onChange={handleAdresChange}
                        />
                      </div>
                      <div className="poliklinikler-form-group">
                        <label>Dış Kapı No</label>
                        <input
                          type="text"
                          name="disKapiNo"
                          value={formData.adresBilgisi.disKapiNo || ''}
                          onChange={handleAdresChange}
                        />
                      </div>
                      <div className="poliklinikler-form-group">
                        <label>İç Kapı No</label>
                        <input
                          type="text"
                          name="icKapiNo"
                          value={formData.adresBilgisi.icKapiNo || ''}
                          onChange={handleAdresChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="poliklinikler-form-column">
                    <h3>İletişim Bilgileri</h3>
                    <div className="poliklinikler-form-group">
                      <label>Telefon 1</label>
                      <input
                        type="text"
                        name="telNo"
                        value={formData.iletisimBilgisi.telNo || ''}
                        onChange={handleIletisimChange}
                      />
                    </div>
                    <div className="poliklinikler-form-group">
                      <label>Telefon 2</label>
                      <input
                        type="text"
                        name="telNo2"
                        value={formData.iletisimBilgisi.telNo2 || ''}
                        onChange={handleIletisimChange}
                      />
                    </div>
                    <div className="poliklinikler-form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.iletisimBilgisi.email || ''}
                        onChange={handleIletisimChange}
                      />
                    </div>
                    <div className="poliklinikler-form-group">
                      <label>Facebook</label>
                      <input
                        type="text"
                        name="facebook"
                        value={formData.iletisimBilgisi.facebook || ''}
                        onChange={handleIletisimChange}
                      />
                    </div>
                    <div className="poliklinikler-form-group">
                      <label>Twitter</label>
                      <input
                        type="text"
                        name="twitter"
                        value={formData.iletisimBilgisi.twitter || ''}
                        onChange={handleIletisimChange}
                      />
                    </div>
                    <div className="poliklinikler-form-group">
                      <label>Instagram</label>
                      <input
                        type="text"
                        name="instagram"
                        value={formData.iletisimBilgisi.instagram || ''}
                        onChange={handleIletisimChange}
                      />
                    </div>
                    <div className="poliklinikler-form-group">
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

                <div className="poliklinikler-modal-actions">
                  <button type="button" className="poliklinikler-confirm-btn" onClick={handleSave}>
                    {isEditing ? 'Güncelle' : 'Kaydet'}
                  </button>
                  <button type="button" className="poliklinikler-cancel-btn" onClick={() => { setShowModal(false); resetForm(); }}>
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

export default Poliklinikler;