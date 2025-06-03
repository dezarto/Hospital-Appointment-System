import React, { useState, useEffect } from 'react';
import {
  FaEdit, FaClock, FaCalendarAlt, FaUser, FaList, FaTimes, FaCalendarDay,
  FaUsers, FaHeartbeat, FaInfoCircle, FaPrint, FaFilePdf, FaStickyNote,
  FaSave, FaSignOutAlt
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Doktor.css';
import {
  getDoktorDatas,
  updateDoktorDatas,
  getDoktorMesailer,
  getDoktorRandevular,
  getDoktorRandevuDatas,
  updateDoktorPassword,
  getIlveIlceDatas,
  updateHastaRandevuNotu
} from '../api/api-doktor';
import LoadingAnimation from '../components/LoadingAnimation/LoadingAnimation';
import { getUserId } from '../api/auth';

const Doktor = () => {
  const navigate = useNavigate();
  const [doktorData, setDoktorData] = useState(null);
  const [mesailer, setMesailer] = useState([]);
  const [randevular, setRandevular] = useState([]);
  const [selectedRandevu, setSelectedRandevu] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRandevuModal, setShowRandevuModal] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [activeTab, setActiveTab] = useState('bilgiler');
  const doktorTC = getUserId();
  const [randevuNotu, setRandevuNotu] = useState('');

  // İl ve ilçe verileri için durumlar
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedIl, setSelectedIl] = useState('');
  const [selectedIlce, setSelectedIlce] = useState('');

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    password: '',
    confirmPassword: '',
    hasta_TC: "",
    doktor_TC: doktorTC,
  });

  useEffect(() => {
    if (selectedRandevu) {
      setRandevuNotu(selectedRandevu.randevuDetay.randevuNotu || '');
    }
  }, [selectedRandevu]);

  const handleNotKaydet = async () => {
    try {
      console.log("doktorTC: " + doktorTC + " selectedRandevu.randevuID: " + selectedRandevu.randevuID
        + " randevuNotu: " + randevuNotu
      );
      await updateHastaRandevuNotu(
        doktorTC,
        selectedRandevu.randevuID,
        randevuNotu
      );

      // Randevu listesini güncelle
      const updatedRandevular = await getDoktorRandevular(doktorTC);
      setRandevular(updatedRandevular);

      alert('Not başarıyla kaydedildi!');
    } catch (error) {
      console.error('Not kaydetme hatası:', error);
      alert('Not kaydedilemedi!');
    }
  };

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
      setDistricts(selectedProvince ? selectedProvince.ilceBilgisi : []);
      setSelectedIlce(''); // İl değiştiğinde ilçe sıfırlanır
    } else {
      setDistricts([]);
      setSelectedIlce('');
    }
  }, [selectedIl, provinces]);

  // Verileri çekme
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [doktor, mesailer, randevular] = await Promise.all([
          getDoktorDatas(doktorTC),
          getDoktorMesailer(doktorTC).catch(() => []),  // Mesai verisi gelmese de hata verme
          getDoktorRandevular(doktorTC).catch(() => [])  // Randevu verisi gelmese de hata verme
        ]);
        setDoktorData(doktor.data);
        setMesailer(mesailer);
        setRandevular(randevular);

        setSelectedIl(doktor.data.adresBilgisi.il_ID.toString());
        setSelectedIlce(doktor.data.adresBilgisi.ilce_ID.toString());
      } catch (error) {
        if (error.response?.status === 401) {
          // Token'ı sil ve login sayfasına yönlendir
          sessionStorage.removeItem('token');
          navigate('/giris'); // Login sayfasına yönlendir
        } else {
          console.error('Veri çekme hatası:', error);
        }
      }
    };

    fetchData();
  }, [doktorTC]);

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    const { currentPassword, password, confirmPassword } = passwordForm;

    // Yeni şifre ile doğrulama eşleşiyor mu?
    if (password !== confirmPassword) {
      alert('Yeni şifreler eşleşmiyor!');
      return;
    }

    try {
      const response = await updateDoktorPassword({
        hasta_TC: "",
        doktor_TC: doktorTC,
        currentPassword: currentPassword,
        password: password,
        confirmPassword: confirmPassword
      });

      if (response.status === 200) {
        alert('Şifre başarıyla güncellendi!');
        setPasswordForm({
          doktor_TC: '',
          hasta_TC: '',
          currentPassword: '',
          password: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      console.error('Şifre güncelleme hatası:', error);
      alert('Şifre güncelleme başarısız! Mevcut şifrenizi kontrol edin.');
    }
  };

  // Doktor bilgilerini güncelleme
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await updateDoktorDatas(doktorTC, editForm);
      if (response.status === 200) {
        setDoktorData(prev => ({ ...prev, ...editForm }));
        setShowEditModal(false);
        alert('Bilgiler başarıyla güncellendi!');
      }
    } catch (error) {
      console.error('Güncelleme hatası:', error);
      alert('Güncelleme başarısız!');
    }
  };

  // Randevu detayını çekme
  const fetchRandevuDetay = async (randevuID) => {
    try {
      const randevuDetay = await getDoktorRandevuDatas(doktorTC, randevuID);
      setSelectedRandevu(randevuDetay);
      setShowRandevuModal(true);
    } catch (error) {
      console.error('Randevu detay hatası:', error);
    }
  };

  const handleEditClick = () => {
    setEditForm({
      doktorBilgisi: { ...doktorData.doktorBilgisi },
      iletisimBilgisi: { ...doktorData.iletisimBilgisi },
      adresBilgisi: { ...doktorData.adresBilgisi }
    });
    setSelectedIl(doktorData.adresBilgisi.il_ID.toString());
    setSelectedIlce(doktorData.adresBilgisi.ilce_ID.toString());
    setShowEditModal(true);
  };

  // Tarih formatlama
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  // Saat formatlama
  const formatTime = (time) => {
    return time?.substring(0, 5) || '';
  };

  const renderSocialLink = (url) => {
    if (!url) return <p>Bilgi yok</p>;
    return (
      <a href={url} target="_blank" rel="noopener noreferrer">
        {url.length > 30 ? 'Görüntüle' : url}
      </a>
    );
  };

  // Form değişikliklerini yönetme
  const handleFormChange = (section, field, value) => {
    setEditForm(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // İl değişikliğini yönetme
  const handleIlChange = (e) => {
    const ilId = e.target.value;
    setSelectedIl(ilId);
    handleFormChange('adresBilgisi', 'il_ID', parseInt(ilId));
  };

  // İlçe değişikliğini yönetme
  const handleIlceChange = (e) => {
    const ilceId = e.target.value;
    setSelectedIlce(ilceId);
    handleFormChange('adresBilgisi', 'ilce_ID', parseInt(ilceId));
  };

  const handleLogout = async () => {
    sessionStorage.clear();
    await navigate('/giris');
  };

  // Render içeriği sekmelere göre
  const renderContent = () => {
    switch (activeTab) {
      case 'bilgiler':
        return (
          <div className="dr-bilgilerim-container">
            <div className="dr-profil-baslik">
              <h2>{doktorData.doktorBilgisi.isim} {doktorData.doktorBilgisi.soyisim}</h2>
              <button
                className="dr-edit-btn"
                onClick={() => {
                  handleEditClick();
                  setEditForm(doktorData);
                  setShowEditModal(true);
                }}
              >
                <FaEdit /> Düzenle
              </button>
            </div>

            <div className="dr-bilgi-grid">
              <div className="dr-bilgi-item">
                <label>TC Kimlik No:</label>
                <p>{doktorData.doktorBilgisi.doktor_TC}</p>
              </div>

              <div className="dr-bilgi-item">
                <label>Cinsiyet:</label>
                <p>{doktorData.doktorBilgisi.cinsiyet ? 'Kadın' : 'Erkek'}</p>
              </div>

              <div className="dr-bilgi-item">
                <label>Poliklinik:</label>
                <p>{doktorData.doktorBilgisi.poliklinikAdi}</p>
              </div>

              <div className="dr-bilgi-item">
                <label>Uzmanlık:</label>
                <p>{doktorData.doktorBilgisi.uzmanlikAdi}</p>
              </div>
            </div>

            <h3>İletişim Bilgisi</h3>
            <div className="dr-bilgi-grid">
              <div className="dr-bilgi-item">
                <label>Telefon Numarası:</label>
                <p>{doktorData.iletisimBilgisi.telNo}</p>
              </div>

              <div className="dr-bilgi-item">
                <label>Alternatif Telefon Numarası:</label>
                <p>{doktorData.iletisimBilgisi.telNo2}</p>
              </div>

              <div className="dr-bilgi-item">
                <label>E-Mail Adresi:</label>
                <p>{doktorData.iletisimBilgisi.email}</p>
              </div>

              <div className="dr-bilgi-item">
                <label>Facebook:</label>
                {renderSocialLink(doktorData.iletisimBilgisi.facebook)}
              </div>

              <div className="dr-bilgi-item">
                <label>Twitter:</label>
                {renderSocialLink(doktorData.iletisimBilgisi.twitter)}
              </div>

              <div className="dr-bilgi-item">
                <label>Instagram:</label>
                {renderSocialLink(doktorData.iletisimBilgisi.instagram)}
              </div>

              <div className="dr-bilgi-item">
                <label>LinkedIn:</label>
                {renderSocialLink(doktorData.iletisimBilgisi.linkedin)}
              </div>
            </div>

            <h3>Adres Bilgisi</h3>
            <div className="dr-bilgi-grid">
              <div className="dr-bilgi-item">
                <label>Adres:</label>
                <p>{doktorData.adresBilgisi.ulke}</p>
              </div>

              <div className="dr-bilgi-item">
                <label>İl:</label>
                <p>
                  {provinces.find(prov => prov.ilId === doktorData.adresBilgisi.il_ID)?.ilAdi || 'Bilinmiyor'}
                </p>
              </div>

              <div className="dr-bilgi-item">
                <label>İlçe:</label>
                <p>
                  {provinces.find(prov => prov.ilId === doktorData.adresBilgisi.il_ID)?.ilceBilgisi.find(ilce => ilce.id === doktorData.adresBilgisi.ilce_ID)?.ilceAdi || 'Bilinmiyor'}
                </p>
              </div>

              <div className="dr-bilgi-item">
                <label>Mahalle:</label>
                <p>{doktorData.adresBilgisi.mahalle}</p>
              </div>

              <div className="dr-bilgi-item">
                <label>Cadde-Sokak:</label>
                <p>{doktorData.adresBilgisi.caddeSokak}</p>
              </div>

              <div className="dr-bilgi-item">
                <label>Dış Kapı No:</label>
                <p>{doktorData.adresBilgisi.disKapiNo}</p>
              </div>

              <div className="dr-bilgi-item">
                <label>İç Kapı No:</label>
                <p>{doktorData.adresBilgisi.icKapiNo}</p>
              </div>
            </div>
          </div>
        );

      case 'sifre-degistir':
        return (
          <div className="dr-sifre-degistir-container">
            <h3><FaEdit /> Şifreni Değiştir</h3>
            <form onSubmit={handlePasswordUpdate} className="dr-password-form">
              <div className="dr-form-group">
                <label>Mevcut Şifre:</label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  required
                />
              </div>
              <div className="dr-form-group">
                <label>Yeni Şifre:</label>
                <input
                  type="password"
                  value={passwordForm.password}
                  onChange={(e) => setPasswordForm({ ...passwordForm, password: e.target.value })}
                  required
                />
              </div>
              <div className="dr-form-group">
                <label>Yeni Şifre (Tekrar):</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  required
                />
              </div>
              <div className="dr-button-group">
                <button type="submit">Şifreyi Güncelle</button>
              </div>
            </form>
          </div>
        );

      case 'mesai':
        return (
          <div className="dr-mesai-listesi">
            <h3><FaClock /> Mesai Saatlerim</h3>
            {mesailer.length > 0 ? (
              mesailer.map(mesai => (
                <div key={mesai.mesaiID} className="dr-mesai-item">
                  <span>{formatDate(mesai.tarih)}</span>
                  <span>{formatTime(mesai.baslangicSaati)} - {formatTime(mesai.bitisSaati)}</span>
                  <span className={`dr-durum ${mesai.aktif ? 'dr-aktif' : 'dr-pasif'}`}>
                    {mesai.aktif ? 'Aktif' : 'Randevu'}
                  </span>
                </div>
              ))
            ) : (
              <p className="dr-bilgi-yok">Kayıtlı mesai bilginiz bulunmamaktadır</p>
            )}
          </div>
        );

      case 'randevular':
        const sortedRandevular = [...randevular].sort((a, b) => {
          const dateA = new Date(a.randevuDetay.randevuTarihi);
          const dateB = new Date(b.randevuDetay.randevuTarihi);

          if (dateA.getTime() !== dateB.getTime()) {
            return dateB - dateA; // Yeni tarih önce
          } else {
            const [hourA, minA] = a.randevuDetay.baslangıcSaati.split(":").map(Number);
            const [hourB, minB] = b.randevuDetay.baslangıcSaati.split(":").map(Number);
            return hourA - hourB || minA - minB; // Saat küçük olan önce
          }
        });

        return (
          <div className="dr-randevu-listesi">
            <h3><FaCalendarAlt /> Randevularım</h3>
            {sortedRandevular.length > 0 ? (
              sortedRandevular.map(randevu => (
                <div
                  key={randevu.randevuID}
                  className="dr-randevu-item"
                  onClick={() => fetchRandevuDetay(randevu.randevuID)}
                >
                  <span>{formatDate(randevu.randevuDetay.randevuTarihi)}</span>
                  <span>{formatTime(randevu.randevuDetay.baslangıcSaati)}</span>
                  <span>{randevu.hasta.isim} {randevu.hasta.soyisim}</span>
                </div>
              ))
            ) : (
              <p className="dr-bilgi-yok">Kayıtlı randevunuz bulunmamaktadır</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (!doktorData) {
    return (
      <div className="dr-checking">
        <div className="dr-loading-alert-wrapper">
          <LoadingAnimation />
        </div>
        <p className="dr-loading-message">Bilgiler yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="dr-doktor-panel">
      {doktorData ? (
        <div className="dr-panel-container">
          {/* Sol Menü */}
          <div className="dr-sol-menu">
            <div className="dr-menu-header">
              <h2>Doktor Paneli</h2>
            </div>

            <nav className="dr-menu-items">
              <button
                className={`dr-menu-item ${activeTab === 'bilgiler' ? 'dr-active' : ''}`}
                onClick={() => setActiveTab('bilgiler')}
              >
                <FaUser /> Bilgilerim
              </button>

              <button
                className={`dr-menu-item ${activeTab === 'sifre-degistir' ? 'dr-active' : ''}`}
                onClick={() => setActiveTab('sifre-degistir')}
              >
                <FaEdit /> Şifreni Değiştir
              </button>

              <button
                className={`dr-menu-item ${activeTab === 'mesai' ? 'dr-active' : ''}`}
                onClick={() => setActiveTab('mesai')}
              >
                <FaClock /> Mesai Saatlerim
              </button>

              <button
                className={`dr-menu-item ${activeTab === 'randevular' ? 'dr-active' : ''}`}
                onClick={() => setActiveTab('randevular')}
              >
                <FaList /> Randevularım
              </button>
              <button className="dr-menu-item" onClick={handleLogout}>
                <FaSignOutAlt /> Çıkış Yap
              </button>
            </nav>
          </div>

          {/* Sağ İçerik */}
          <div className="dr-sag-icerik">
            {renderContent()}
          </div>
        </div>
      ) : (
        <div className="dr-loading">Yükleniyor...</div>
      )}

      {/* Düzenleme Modalı */}
      {showEditModal && (
        <div className="dr-modal-overlay">
          <div className="dr-modal-content">
            <h3>Bilgileri Düzenle</h3>
            <form onSubmit={handleUpdate} className="dr-edit-form">
              <div className="dr-form-section">
                <h4>Kişisel Bilgiler</h4>
                <div className="dr-form-group">
                  <label>İsim:</label>
                  <input
                    value={editForm.doktorBilgisi?.isim || ''}
                    onChange={(e) => setEditForm({
                      ...editForm,
                      doktorBilgisi: { ...editForm.doktorBilgisi, isim: e.target.value }
                    })}
                  />
                </div>
                <div className="dr-form-group">
                  <label>Soyisim:</label>
                  <input
                    value={editForm.doktorBilgisi?.soyisim || ''}
                    onChange={(e) => setEditForm({
                      ...editForm,
                      doktorBilgisi: { ...editForm.doktorBilgisi, soyisim: e.target.value }
                    })}
                  />
                </div>
                <div className="dr-form-group">
                  <label>Cinsiyet:</label>
                  <select
                    value={editForm.doktorBilgisi?.cinsiyet ? 'Kadın' : 'Erkek'}
                    onChange={(e) => setEditForm({
                      ...editForm,
                      doktorBilgisi: { ...editForm.doktorBilgisi, cinsiyet: e.target.value === 'Kadın' }
                    })}
                  >
                    <option>Erkek</option>
                    <option>Kadın</option>
                  </select>
                </div>
              </div>

              <div className="dr-form-section">
                <h4>İletişim Bilgileri</h4>
                <div className="dr-form-group">
                  <label>Telefon:</label>
                  <input
                    value={editForm.iletisimBilgisi?.telNo || ''}
                    onChange={(e) => setEditForm({
                      ...editForm,
                      iletisimBilgisi: { ...editForm.iletisimBilgisi, telNo: e.target.value }
                    })}
                  />
                </div>
                <div className="dr-form-group">
                  <label>Alternatif Telefon:</label>
                  <input
                    value={editForm.iletisimBilgisi?.telNo2 || ''}
                    onChange={(e) => setEditForm({
                      ...editForm,
                      iletisimBilgisi: { ...editForm.iletisimBilgisi, telNo2: e.target.value }
                    })}
                  />
                </div>
                <div className="dr-form-group">
                  <label>E-Mail:</label>
                  <input
                    value={editForm.iletisimBilgisi?.email || ''}
                    onChange={(e) => setEditForm({
                      ...editForm,
                      iletisimBilgisi: { ...editForm.iletisimBilgisi, email: e.target.value }
                    })}
                  />
                </div>
                <div className="dr-form-group">
                  <label>Facebook:</label>
                  <input
                    value={editForm.iletisimBilgisi?.facebook || ''}
                    onChange={(e) => setEditForm({
                      ...editForm,
                      iletisimBilgisi: { ...editForm.iletisimBilgisi, facebook: e.target.value }
                    })}
                  />
                </div>
                <div className="dr-form-group">
                  <label>Twitter:</label>
                  <input
                    value={editForm.iletisimBilgisi?.twitter || ''}
                    onChange={(e) => setEditForm({
                      ...editForm,
                      iletisimBilgisi: { ...editForm.iletisimBilgisi, twitter: e.target.value }
                    })}
                  />
                </div>
                <div className="dr-form-group">
                  <label>Instagram:</label>
                  <input
                    value={editForm.iletisimBilgisi?.instagram || ''}
                    onChange={(e) => setEditForm({
                      ...editForm,
                      iletisimBilgisi: { ...editForm.iletisimBilgisi, instagram: e.target.value }
                    })}
                  />
                </div>
                <div className="dr-form-group">
                  <label>LinkedIn:</label>
                  <input
                    value={editForm.iletisimBilgisi?.linkedin || ''}
                    onChange={(e) => setEditForm({
                      ...editForm,
                      iletisimBilgisi: { ...editForm.iletisimBilgisi, linkedin: e.target.value }
                    })}
                  />
                </div>
              </div>

              {/* Adres Bilgileri */}
              <div className="dr-form-section">
                <h4>Adres Bilgileri</h4>
                <div className="dr-form-group">
                  <label>Ülke:</label>
                  <input
                    value={editForm.adresBilgisi?.ulke || ''}
                    onChange={(e) => setEditForm({
                      ...editForm,
                      adresBilgisi: { ...editForm.adresBilgisi, ulke: e.target.value }
                    })}
                  />
                </div>
                <div className="dr-form-group">
                  <label>İl:</label>
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
                <div className="dr-form-group">
                  <label>İlçe:</label>
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
                <div className="dr-form-group">
                  <label>Mahalle:</label>
                  <input
                    value={editForm.adresBilgisi?.mahalle || ''}
                    onChange={(e) => setEditForm({
                      ...editForm,
                      adresBilgisi: { ...editForm.adresBilgisi, mahalle: e.target.value }
                    })}
                  />
                </div>
                <div className="dr-form-group">
                  <label>Cadde-Sokak:</label>
                  <input
                    value={editForm.adresBilgisi?.caddeSokak || ''}
                    onChange={(e) => setEditForm({
                      ...editForm,
                      adresBilgisi: { ...editForm.adresBilgisi, caddeSokak: e.target.value }
                    })}
                  />
                </div>
                <div className="dr-form-group">
                  <label>Dış Kapı No:</label>
                  <input
                    value={editForm.adresBilgisi?.disKapiNo || ''}
                    onChange={(e) => setEditForm({
                      ...editForm,
                      adresBilgisi: { ...editForm.adresBilgisi, disKapiNo: e.target.value }
                    })}
                  />
                </div>
                <div className="dr-form-group">
                  <label>İç Kapı No:</label>
                  <input
                    value={editForm.adresBilgisi?.icKapiNo || ''}
                    onChange={(e) => setEditForm({
                      ...editForm,
                      adresBilgisi: { ...editForm.adresBilgisi, icKapiNo: e.target.value }
                    })}
                  />
                </div>
              </div>

              <div className="dr-button-group">
                <button type="button" onClick={() => setShowEditModal(false)}>
                  İptal
                </button>
                <button type="submit">Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Randevu Detay Modalı */}
      {showRandevuModal && selectedRandevu && (
        <div className="dr-modal-overlay">
          <div className="dr-modal-content dr-randevu-detay-container">
            <div className="dr-randevu-header">
              <h3>
                <FaCalendarAlt /> Randevu Detayları
                <button className="dr-kapat-btn" onClick={() => setShowRandevuModal(false)}>
                  <FaTimes />
                </button>
              </h3>
              <div className="dr-randevu-zaman">
                <span className="dr-tarih">
                  <FaCalendarDay /> {formatDate(selectedRandevu.randevuDetay.randevuTarihi)}
                </span>
                <span className="dr-saat">
                  <FaClock /> {formatTime(selectedRandevu.randevuDetay.baslangıcSaati)} -
                  {formatTime(selectedRandevu.randevuDetay.bitisSaati)}
                </span>
              </div>
            </div>

            <div className="dr-randevu-grid">
              {/* Hasta Bilgileri */}
              <div className="dr-hasta-bilgileri dr-info-card">
                <h4><FaUser /> Hasta Bilgileri</h4>
                <div className="dr-info-grid">
                  <div className="dr-info-item">
                    <label>TC Kimlik No:</label>
                    <p>{selectedRandevu.hasta.hasta_TC}</p>
                  </div>
                  <div className="dr-info-item">
                    <label>Ad Soyad:</label>
                    <p>{selectedRandevu.hasta.isim} {selectedRandevu.hasta.soyisim}</p>
                  </div>
                  <div className="dr-info-item">
                    <label>Doğum Tarihi:</label>
                    <p>{formatDate(selectedRandevu.hasta.dogumTarihi)}</p>
                  </div>
                  <div className="dr-info-item">
                    <label>Cinsiyet:</label>
                    <p>{selectedRandevu.hasta.cinsiyet ? 'Kadın' : 'Erkek'}</p>
                  </div>
                </div>
              </div>

              {/* Aile Bilgileri */}
              <div className="dr-aile-bilgileri dr-info-card">
                <h4><FaUsers /> Aile Bilgileri</h4>
                <div className="dr-info-grid">
                  <div className="dr-info-item">
                    <label>Anne Adı:</label>
                    <p>{selectedRandevu.hasta.anneAdi || '-'}</p>
                  </div>
                  <div className="dr-info-item">
                    <label>Baba Adı:</label>
                    <p>{selectedRandevu.hasta.babaAdi || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Sağlık Bilgileri */}
              <div className="dr-saglik-bilgileri dr-info-card">
                <h4><FaHeartbeat /> Sağlık Geçmişi</h4>
                <div className="dr-info-content">
                  {selectedRandevu.hasta.saglikGecmisi ? (
                    <p>{selectedRandevu.hasta.saglikGecmisi}</p>
                  ) : (
                    <p className="dr-bilgi-yok">Kayıtlı sağlık geçmişi bulunmamaktadır</p>
                  )}
                </div>
              </div>

              {/* Ek Bilgiler */}
              <div className="dr-ek-bilgiler dr-info-card">
                <h4><FaInfoCircle /> Ek Bilgiler</h4>
                <div className="dr-info-grid">
                  <div className="dr-info-item">
                    <label>Doğum Yeri:</label>
                    <p>{selectedRandevu.hasta.dogumYeri || '-'}</p>
                  </div>
                  <div className="dr-info-item">
                    <label>Son Güncelleme:</label>
                    <p>{formatDate(selectedRandevu.randevuDetay.olusturulmaTarihi)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Randevu Notu Bölümü */}
            <div className="dr-randevu-notu dr-info-card">
              <h4><FaStickyNote /> Randevu Notu</h4>
              <textarea
                className="dr-not-input"
                value={randevuNotu}
                onChange={(e) => setRandevuNotu(e.target.value)}
                placeholder="Randevu ile ilgili notlarınızı buraya yazın..."
              />
              <button
                className="dr-not-kaydet-btn"
                onClick={handleNotKaydet}
                disabled={!randevuNotu.trim()}
              >
                <FaSave /> Notu Kaydet
              </button>
            </div>

            <div className="dr-randevu-actions">
              <button className="dr-action-btn dr-print-btn">
                <FaPrint /> Yazdır
              </button>
              <button className="dr-action-btn dr-pdf-btn">
                <FaFilePdf /> PDF Oluştur
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Doktor;