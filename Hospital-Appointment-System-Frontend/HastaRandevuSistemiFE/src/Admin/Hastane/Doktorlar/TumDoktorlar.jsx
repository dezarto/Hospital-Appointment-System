import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getDoktorlarByHastaneID,
  getHastaneById
} from '../../../api/api-admin';
import LoadingAnimation from '../../../components/LoadingAnimation/LoadingAnimation';
import ActionButtonsSidebar from '../Home/ActionButtonsSidebar';
import './TumDoktorlar.css';

const TumDoktorlar = () => {
  const navigate = useNavigate();
  const { hastaneId } = useParams();
  const [doktorlar, setDoktorlar] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [hospitalName, setHospitalName] = useState('');
  const [formData, setFormData] = useState({
    doktorBilgisi: {
      doktor_TC: '',
      isim: '',
      soyisim: '',
      cinsiyet: true,
      sifre: '',
      poliklinik_ID: 0,
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
    const fetchDoktorlar = async () => {
      try {
        // Fetch hospital name
        const hospitalResponse = await getHastaneById(hastaneId);
        setHospitalName(hospitalResponse.data.hastaneAdi || 'Hastane');

        // Fetch doctors
        const response = await getDoktorlarByHastaneID(hastaneId);
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
    fetchDoktorlar();
  }, [hastaneId, navigate]);

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

  const handleMesailerClick = (doktorTC) => {
    navigate(`mesailer/${doktorTC}`);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      doktorBilgisi: {
        ...prev.doktorBilgisi,
        [name]: name === 'cinsiyet' ? value === 'true' : value
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
          iletisim_ID: formData.iletisimBilgisi.id,
          adres_ID: formData.adresBilgisi.id
        }
      };

      // Note: Actual API calls for add/update are missing in the original code
      // Placeholder: await addDoktorByHastaneID(hastaneId, payload);
      // or await updateDoktorByHastaneID(hastaneId, payload.doktorBilgisi.doktor_TC, payload);

      const updatedData = await getDoktorlarByHastaneID(hastaneId);
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
        poliklinik_ID: 0,
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
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="tumdoktorlar-checking">
        <div className="tumdoktorlar-loading-alert-wrapper">
          <LoadingAnimation />
        </div>
        <p className="tumdoktorlar-loading-message">Doktorlar yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="tumdoktorlar-main-container">
      <ActionButtonsSidebar
        hospitalId={hastaneId}
        hospitalName={hospitalName}
        noHospitalMessage="Hastane bilgisi yükleniyor..."
      />
      <div className="tumdoktorlar-table-container">
        <button className="tumdoktorlar-add-new-btn" onClick={() => setShowModal(true)}>
          + Yeni Doktor Ekle
        </button>

        <table className="tumdoktorlar-hasta-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('doktor_TC')}>TC {renderSortIcon('doktor_TC')}</th>
              <th onClick={() => handleSort('isim')}>İsim {renderSortIcon('isim')}</th>
              <th onClick={() => handleSort('soyisim')}>Soyisim {renderSortIcon('soyisim')}</th>
              <th onClick={() => handleSort('cinsiyet')}>Cinsiyet {renderSortIcon('cinsiyet')}</th>
              <th onClick={() => handleSort('poliklinik_ID')}>Poliklinik ID {renderSortIcon('poliklinik_ID')}</th>
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
                  <td>{doktor.doktorBilgisi.poliklinik_ID}</td>
                  <td className="tumdoktorlar-actions">
                    <button
                      className="tumdoktorlar-news-btn"
                      onClick={() => handleMesailerClick(doktor.doktorBilgisi.doktor_TC)}
                    >
                      Mesailer
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                  Kayıtlı doktor bulunmamaktadır
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {showModal && (
          <div className="tumdoktorlar-modal-overlay">
            <div className="tumdoktorlar-modal">
              <div className="tumdoktorlar-modal-header">
                <h2>{isEditing ? 'Doktor Düzenle' : 'Yeni Doktor Ekle'}</h2>
                <button className="tumdoktorlar-close-btn" onClick={() => { setShowModal(false); resetForm(); }}>×</button>
              </div>

              <form className="tumdoktorlar-modal-content">
                <div className="tumdoktorlar-form-columns">
                  <div className="tumdoktorlar-form-column">
                    <div className="tumdoktorlar-form-group">
                      <label>TC Kimlik No</label>
                      <input
                        type="text"
                        name="doktor_TC"
                        value={formData.doktorBilgisi.doktor_TC}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="tumdoktorlar-form-group">
                      <label>İsim</label>
                      <input
                        type="text"
                        name="isim"
                        value={formData.doktorBilgisi.isim}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="tumdoktorlar-form-group">
                      <label>Soyisim</label>
                      <input
                        type="text"
                        name="soyisim"
                        value={formData.doktorBilgisi.soyisim}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="tumdoktorlar-form-group">
                      <label>Cinsiyet</label>
                      <select
                        name="cinsiyet"
                        value={formData.doktorBilgisi.cinsiyet}
                        onChange={handleInputChange}
                      >
                        <option value={true}>Kadın</option>
                        <option value={false}>Erkek</option>
                      </select>
                    </div>
                    <div className="tumdoktorlar-form-group">
                      <label>Şifre</label>
                      <input
                        type="password"
                        name="sifre"
                        value={formData.doktorBilgisi.sifre || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="tumdoktorlar-form-group">
                      <label>Uzmanlık ID</label>
                      <input
                        type="number"
                        name="uzmanlik_ID"
                        value={formData.doktorBilgisi.uzmanlik_ID}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="tumdoktorlar-form-column">
                    <h3>Adres Bilgileri</h3>
                    <div className="tumdoktorlar-form-group">
                      <label>Ülke</label>
                      <input
                        type="text"
                        name="ulke"
                        value={formData.adresBilgisi.ulke}
                        onChange={handleAdresChange}
                      />
                    </div>
                    <div className="tumdoktorlar-form-group">
                      <label>İl ID</label>
                      <input
                        type="number"
                        name="il_ID"
                        value={formData.adresBilgisi.il_ID}
                        onChange={handleAdresChange}
                      />
                    </div>
                    <div className="tumdoktorlar-form-group">
                      <label>İlçe ID</label>
                      <input
                        type="number"
                        name="ilce_ID"
                        value={formData.adresBilgisi.ilce_ID}
                        onChange={handleAdresChange}
                      />
                    </div>
                    <div className="tumdoktorlar-form-group">
                      <label>Mahalle</label>
                      <input
                        type="text"
                        name="mahalle"
                        value={formData.adresBilgisi.mahalle}
                        onChange={handleAdresChange}
                      />
                    </div>
                    <div className="tumdoktorlar-form-group">
                      <label>Cadde/Sokak</label>
                      <input
                        type="text"
                        name="caddeSokak"
                        value={formData.adresBilgisi.caddeSokak}
                        onChange={handleAdresChange}
                      />
                    </div>
                    <div className="tumdoktorlar-form-group">
                      <label>Dış Kapı No</label>
                      <input
                        type="text"
                        name="disKapiNo"
                        value={formData.adresBilgisi.disKapiNo}
                        onChange={handleAdresChange}
                      />
                    </div>
                    <div className="tumdoktorlar-form-group">
                      <label>İç Kapı No</label>
                      <input
                        type="text"
                        name="icKapiNo"
                        value={formData.adresBilgisi.icKapiNo}
                        onChange={handleAdresChange}
                      />
                    </div>
                  </div>

                  <div className="tumdoktorlar-form-column">
                    <h3>İletişim Bilgileri</h3>
                    <div className="tumdoktorlar-form-group">
                      <label>Telefon 1</label>
                      <input
                        type="text"
                        name="telNo"
                        value={formData.iletisimBilgisi.telNo}
                        onChange={handleIletisimChange}
                      />
                    </div>
                    <div className="tumdoktorlar-form-group">
                      <label>Telefon 2</label>
                      <input
                        type="text"
                        name="telNo2"
                        value={formData.iletisimBilgisi.telNo2}
                        onChange={handleIletisimChange}
                      />
                    </div>
                    <div className="tumdoktorlar-form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.iletisimBilgisi.email}
                        onChange={handleIletisimChange}
                      />
                    </div>
                    <div className="tumdoktorlar-form-group">
                      <label>Facebook</label>
                      <input
                        type="text"
                        name="facebook"
                        value={formData.iletisimBilgisi.facebook}
                        onChange={handleIletisimChange}
                      />
                    </div>
                    <div className="tumdoktorlar-form-group">
                      <label>Twitter</label>
                      <input
                        type="text"
                        name="twitter"
                        value={formData.iletisimBilgisi.twitter}
                        onChange={handleIletisimChange}
                      />
                    </div>
                    <div className="tumdoktorlar-form-group">
                      <label>Instagram</label>
                      <input
                        type="text"
                        name="instagram"
                        value={formData.iletisimBilgisi.instagram}
                        onChange={handleIletisimChange}
                      />
                    </div>
                    <div className="tumdoktorlar-form-group">
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

                <div className="tumdoktorlar-modal-actions">
                  <button type="button" className="tumdoktorlar-confirm-btn" onClick={handleSave}>
                    {isEditing ? 'Güncelle' : 'Kaydet'}
                  </button>
                  <button type="button" className="tumdoktorlar-cancel-btn" onClick={() => { setShowModal(false); resetForm(); }}>
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

export default TumDoktorlar;