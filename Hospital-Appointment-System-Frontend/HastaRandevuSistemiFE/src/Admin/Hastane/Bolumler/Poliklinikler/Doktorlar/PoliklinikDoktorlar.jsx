import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getDoktorlarByPoliklinikID,
  addDoktorByPoliklinikID,
  deleteDoktorByPoliklinikID,
  updateDoktorByPoliklinikID,
  getIlveIlceDatas,
  getUzmanlikDatas,
  getHastaneById
} from '../../../../../api/api-admin';
import LoadingAnimation from '../../../../../components/LoadingAnimation/LoadingAnimation';
import ActionButtonsSidebar from '../../../Home/ActionButtonsSidebar';
import './PoliklinikDoktorlar.css';

const PoliklinikDoktorlar = () => {
  const { hastaneId, poliklinikID } = useParams();
  const navigate = useNavigate();
  const [doktorlar, setDoktorlar] = useState([]);
  const [selectedDoktor, setSelectedDoktor] = useState(null);
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
  const [uzmanliklar, setUzmanliklar] = useState([]);
  const [selectedUzmanlik, setSelectedUzmanlik] = useState('');

  const [formData, setFormData] = useState({
    doktorBilgisi: {
      doktor_TC: '',
      isim: '',
      soyisim: '',
      cinsiyet: true,
      sifre: '',
      poliklinik_ID: parseInt(poliklinikID),
      uzmanlik_ID: 0,
      iletisim_ID: 0,
      adres_ID: 0
    },
    adresBilgisi: {
      id: 0,
      ulke: '',
      mahalle: '',
      caddeSokak: '',
      disKapiNo: '',
      icKapiNo: '',
      il_ID: 0,
      ilce_ID: 0
    },
    iletisimBilgisi: {
      id: 0,
      telNo: '',
      telNo2: '',
      email: '',
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: ''
    }
  });

  useEffect(() => {
    const fetchUzmanlikDatas = async () => {
      try {
        const response = await getUzmanlikDatas();
        setUzmanliklar(response);
      } catch (error) {
        console.error('Uzmanlık bilgileri yüklenemedi:', error);
      }
    };
    fetchUzmanlikDatas();
  }, []);

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
    const fetchData = async () => {
      try {
        // Fetch hospital name
        const hospitalResponse = await getHastaneById(hastaneId);
        setHospitalName(hospitalResponse.data.hastaneAdi || 'Hastane');

        // Fetch doctors
        const response = await getDoktorlarByPoliklinikID(poliklinikID);
        setDoktorlar(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        if (error.response?.status === 401) {
          sessionStorage.removeItem('token');
          navigate('/giris');
        } else {
          console.error('Doktor verileri alınırken hata oluştu:', error);
        }
      }
    };
    fetchData();
  }, [poliklinikID, hastaneId, navigate]);

  useEffect(() => {
    if (selectedIl) {
      const selectedProvince = provinces.find(prov => prov.ilId === parseInt(selectedIl));
      setDistricts(selectedProvince ? selectedProvince.ilceBilgisi : []);
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

  const handleUzmanlikChange = (e) => {
    const uzmanlikId = e.target.value;
    setSelectedUzmanlik(uzmanlikId);
    setFormData(prev => ({
      ...prev,
      doktorBilgisi: {
        ...prev.doktorBilgisi,
        uzmanlik_ID: parseInt(uzmanlikId) || 0
      }
    }));
  };

  const handleIlChange = (e) => {
    const ilId = e.target.value;
    setSelectedIl(ilId);
    setFormData(prev => ({
      ...prev,
      adresBilgisi: {
        ...prev.adresBilgisi,
        il_ID: parseInt(ilId) || 0,
        ilce_ID: 0
      }
    }));
  };

  const handleIlceChange = (e) => {
    const ilceId = e.target.value;
    setSelectedIlce(ilceId);
    setFormData(prev => ({
      ...prev,
      adresBilgisi: {
        ...prev.adresBilgisi,
        ilce_ID: parseInt(ilceId) || 0
      }
    }));
  };

  const handleSort = (column) => {
    let order = 'asc';
    if (sortColumn === column && sortOrder === 'asc') {
      order = 'desc';
    }
    setSortColumn(column);
    setSortOrder(order);

    const sortedDoktorlar = [...doktorlar].sort((a, b) => {
      const aValue = a.doktorBilgisi[column];
      const bValue = b.doktorBilgisi[column];
      if (aValue < bValue) return order === 'asc' ? -1 : 1;
      if (aValue > bValue) return order === 'asc' ? 1 : -1;
      return 0;
    });
    setDoktorlar(sortedDoktorlar);
  };

  const renderSortIcon = (column) => {
    if (sortColumn === column) {
      return sortOrder === 'asc' ? ' ▲' : ' ▼';
    }
    return '';
  };

  const handleEditClick = (doktorTC) => {
    const doktorToEdit = doktorlar.find(d => d.doktorBilgisi.doktor_TC === doktorTC);
    if (doktorToEdit) {
      setFormData({
        doktorBilgisi: {
          ...doktorToEdit.doktorBilgisi,
          poliklinik_ID: parseInt(poliklinikID)
        },
        adresBilgisi: { ...doktorToEdit.adresBilgisi },
        iletisimBilgisi: { ...doktorToEdit.iletisimBilgisi }
      });
      setSelectedIl(doktorToEdit.adresBilgisi.il_ID.toString());
      setSelectedUzmanlik(doktorToEdit.doktorBilgisi.uzmanlik_ID.toString());
      setIsEditing(true);
      setShowModal(true);
    }
  };

  const handleDeleteClick = (doktor) => {
    setSelectedDoktor(doktor);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (selectedDoktor) {
      try {
        await deleteDoktorByPoliklinikID(selectedDoktor.doktorBilgisi.doktor_TC);
        setDoktorlar(prev => prev.filter(d =>
          d.doktorBilgisi.doktor_TC !== selectedDoktor.doktorBilgisi.doktor_TC
        ));
        setShowDeleteModal(false);
      } catch (error) {
        console.error('Doktor silinirken hata oluştu:', error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      doktorBilgisi: {
        ...prev.doktorBilgisi,
        [name]: name === 'cinsiyet' ? value === 'true' : (name === 'uzmanlik_ID' ? parseInt(value) || 0 : value)
      }
    }));
  };

  const handleAdresChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      adresBilgisi: {
        ...prev.adresBilgisi,
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
        doktorBilgisi: {
          ...formData.doktorBilgisi,
          iletisim_ID: formData.iletisimBilgisi.id || 0,
          adres_ID: formData.adresBilgisi.id || 0,
          uzmanlik_ID: parseInt(formData.doktorBilgisi.uzmanlik_ID) || 0,
          poliklinik_ID: parseInt(poliklinikID),
          cinsiyet: formData.doktorBilgisi.cinsiyet
        }
      };

      if (isEditing) {
        await updateDoktorByPoliklinikID(payload, formData.doktorBilgisi.doktor_TC);
      } else {
        await addDoktorByPoliklinikID(payload, hastaneId, poliklinikID);
      }

      const updatedData = await getDoktorlarByPoliklinikID(poliklinikID);
      setDoktorlar(updatedData.data);
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Doktor kaydedilirken hata oluştu:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      doktorBilgisi: {
        doktor_TC: '',
        isim: '',
        soyisim: '',
        cinsiyet: true,
        sifre: '',
        poliklinik_ID: parseInt(poliklinikID),
        uzmanlik_ID: 0,
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
    setSelectedUzmanlik('');
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="doktorlar-checking">
        <div className="doktorlar-loading-alert-wrapper">
          <LoadingAnimation />
        </div>
        <p className="doktorlar-loading-message">Doktorlar yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="doktorlar-main-container">
      <ActionButtonsSidebar
        hospitalId={hastaneId}
        hospitalName={hospitalName}
        noHospitalMessage="Hastane bilgisi yükleniyor..."
      />
      <div className="doktorlar-table-container">
        <button className="doktorlar-add-new-btn" onClick={() => {
          setShowModal(true);
          setIsEditing(false);
          resetForm();
          setSelectedIl('');
          setSelectedIlce('');
        }}>
          + Yeni Doktor Ekle
        </button>

        <table className="doktorlar-hasta-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('doktor_TC')}>TC {renderSortIcon('doktor_TC')}</th>
              <th onClick={() => handleSort('isim')}>İsim {renderSortIcon('isim')}</th>
              <th onClick={() => handleSort('soyisim')}>Soyisim {renderSortIcon('soyisim')}</th>
              <th onClick={() => handleSort('cinsiyet')}>Cinsiyet {renderSortIcon('cinsiyet')}</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {doktorlar.length > 0 ? (
              doktorlar.map((doktor) => (
                <tr key={doktor.doktorBilgisi.doktor_TC}>
                  <td>{doktor.doktorBilgisi.doktor_TC}</td>
                  <td>{doktor.doktorBilgisi.isim}</td>
                  <td>{doktor.doktorBilgisi.soyisim}</td>
                  <td>{doktor.doktorBilgisi.cinsiyet ? 'Kadın' : 'Erkek'}</td>
                  <td className="doktorlar-actions">
                    <button
                      className="doktorlar-edit-btn"
                      onClick={() => handleEditClick(doktor.doktorBilgisi.doktor_TC)}
                    >
                      Düzenle
                    </button>
                    <button
                      className="doktorlar-delete-btn"
                      onClick={() => handleDeleteClick(doktor)}
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                  Kayıtlı doktor bulunmamaktadır
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {showDeleteModal && (
          <div className="doktorlar-modal-overlay">
            <div className="doktorlar-confirmation-modal">
              <div className="doktorlar-modal-header">
                <h3>Silme Onayı</h3>
                <button className="doktorlar-close-btn" onClick={() => setShowDeleteModal(false)}>×</button>
              </div>
              <div className="doktorlar-modal-content">
                <p>
                  <b>{selectedDoktor?.doktorBilgisi.isim} {selectedDoktor?.doktorBilgisi.soyisim}</b> isimli doktoru silmek istediğinize emin misiniz?
                </p>
                <div className="doktorlar-modal-actions">
                  <button className="doktorlar-confirm-btn" onClick={confirmDelete}>Evet</button>
                  <button className="doktorlar-cancel-btn" onClick={() => setShowDeleteModal(false)}>Hayır</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showModal && (
          <div className="doktorlar-modal-overlay">
            <div className="doktorlar-modal">
              <div className="doktorlar-modal-header">
                <h2>{isEditing ? 'Doktor Düzenle' : 'Yeni Doktor Ekle'}</h2>
                <button className="doktorlar-close-btn" onClick={() => { setShowModal(false); resetForm(); }}>×</button>
              </div>

              <form className="doktorlar-modal-content">
                <div className="doktorlar-form-columns">
                  <div className="doktorlar-form-column">
                    <div className="doktorlar-form-group">
                      <label>TC Kimlik No</label>
                      <input
                        type="text"
                        name="doktor_TC"
                        value={formData.doktorBilgisi.doktor_TC}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="doktorlar-form-group">
                      <label>İsim</label>
                      <input
                        type="text"
                        name="isim"
                        value={formData.doktorBilgisi.isim}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="doktorlar-form-group">
                      <label>Soyisim</label>
                      <input
                        type="text"
                        name="soyisim"
                        value={formData.doktorBilgisi.soyisim}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="doktorlar-form-group">
                      <label>Cinsiyet</label>
                      <select
                        name="cinsiyet"
                        value={formData.doktorBilgisi.cinsiyet.toString()}
                        onChange={handleInputChange}
                      >
                        <option value="true">Kadın</option>
                        <option value="false">Erkek</option>
                      </select>
                    </div>
                    <div className="doktorlar-form-group">
                      <label>Şifre</label>
                      <input
                        type="password"
                        name="sifre"
                        value={formData.doktorBilgisi.sifre || ''}
                        onChange={handleInputChange}
                        placeholder={formData.doktorBilgisi.sifre ? '' : 'Yeni şifre giriniz'}
                      />
                    </div>
                    <div className="doktorlar-form-group">
                      <label>Uzmanlık</label>
                      <select
                        value={selectedUzmanlik}
                        onChange={handleUzmanlikChange}
                      >
                        <option value="">Uzmanlık Seçiniz</option>
                        {uzmanliklar.map(uzmanlik => (
                          <option key={uzmanlik.uzmanlikID} value={uzmanlik.uzmanlikID}>
                            {uzmanlik.uzmanlikAdi}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="doktorlar-form-column">
                    <h3>Adres Bilgileri</h3>
                    <div className="doktorlar-form-group">
                      <label>Ülke</label>
                      <input
                        type="text"
                        name="ulke"
                        value={formData.adresBilgisi.ulke}
                        onChange={handleAdresChange}
                      />
                    </div>
                    <div className="doktorlar-form-group">
                      <label>İl</label>
                      <select
                        value={selectedIl}
                        onChange={handleIlChange}
                      >
                        <option value="">İl Seçiniz</option>
                        {provinces.map(province => (
                          <option key={province.ilId} value={province.ilId}>
                            {province.ilAdi}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="doktorlar-form-group">
                      <label>İlçe</label>
                      <select
                        value={selectedIlce}
                        onChange={handleIlceChange}
                        disabled={!selectedIl}
                      >
                        <option value="">İlçe Seçiniz</option>
                        {districts.map(district => (
                          <option key={district.id} value={district.id}>
                            {district.ilceAdi}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="doktorlar-form-group">
                      <label>Mahalle</label>
                      <input
                        type="text"
                        name="mahalle"
                        value={formData.adresBilgisi.mahalle}
                        onChange={handleAdresChange}
                      />
                    </div>
                    <div className="doktorlar-form-group">
                      <label>Cadde/Sokak</label>
                      <input
                        type="text"
                        name="caddeSokak"
                        value={formData.adresBilgisi.caddeSokak}
                        onChange={handleAdresChange}
                      />
                    </div>
                    <div className="doktorlar-form-group">
                      <label>Dış Kapı No</label>
                      <input
                        type="text"
                        name="disKapiNo"
                        value={formData.adresBilgisi.disKapiNo}
                        onChange={handleAdresChange}
                      />
                    </div>
                    <div className="doktorlar-form-group">
                      <label>İç Kapı No</label>
                      <input
                        type="text"
                        name="icKapiNo"
                        value={formData.adresBilgisi.icKapiNo}
                        onChange={handleAdresChange}
                      />
                    </div>
                  </div>

                  <div className="doktorlar-form-column">
                    <h3>İletişim Bilgileri</h3>
                    <div className="doktorlar-form-group">
                      <label>Telefon 1</label>
                      <input
                        type="text"
                        name="telNo"
                        value={formData.iletisimBilgisi.telNo}
                        onChange={handleIletisimChange}
                      />
                    </div>
                    <div className="doktorlar-form-group">
                      <label>Telefon 2</label>
                      <input
                        type="text"
                        name="telNo2"
                        value={formData.iletisimBilgisi.telNo2}
                        onChange={handleIletisimChange}
                      />
                    </div>
                    <div className="doktorlar-form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.iletisimBilgisi.email}
                        onChange={handleIletisimChange}
                      />
                    </div>
                    <div className="doktorlar-form-group">
                      <label>Facebook</label>
                      <input
                        type="text"
                        name="facebook"
                        value={formData.iletisimBilgisi.facebook}
                        onChange={handleIletisimChange}
                      />
                    </div>
                    <div className="doktorlar-form-group">
                      <label>Twitter</label>
                      <input
                        type="text"
                        name="twitter"
                        value={formData.iletisimBilgisi.twitter}
                        onChange={handleIletisimChange}
                      />
                    </div>
                    <div className="doktorlar-form-group">
                      <label>Instagram</label>
                      <input
                        type="text"
                        name="instagram"
                        value={formData.iletisimBilgisi.instagram}
                        onChange={handleIletisimChange}
                      />
                    </div>
                    <div className="doktorlar-form-group">
                      <label>LinkedIn</label>
                      <input
                        type="text"
                        name="linkedin"
                        value={formData.iletisimBilgisi.linkedin}
                        onChange={handleIletisimChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="doktorlar-modal-actions">
                  <button type="button" className="doktorlar-confirm-btn" onClick={handleSave}>
                    {isEditing ? 'Güncelle' : 'Kaydet'}
                  </button>
                  <button type="button" className="doktorlar-cancel-btn" onClick={() => { setShowModal(false); resetForm(); }}>
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

export default PoliklinikDoktorlar;