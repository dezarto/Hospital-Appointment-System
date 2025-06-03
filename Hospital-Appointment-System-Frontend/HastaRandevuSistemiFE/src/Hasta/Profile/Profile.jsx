import React, { useState, useEffect } from 'react';
import {
    FaEdit, FaClock, FaCalendarAlt, FaUser, FaTimes, FaCalendarDay,
    FaUsers, FaHeartbeat, FaInfoCircle, FaPrint, FaFilePdf, FaStickyNote,
    FaSave, FaSignOutAlt
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import {
    getHastaDatas,
    updateHastaDatas,
    getRandevularim,
    getRandevuDatas,
    updateHastaPassword,
    getIlveIlceDatas
} from '../../api/api-hasta';
import LoadingAnimation from '../../components/LoadingAnimation/LoadingAnimation';
import { getUserId } from '../../api/auth';

const Profile = () => {
    const navigate = useNavigate();
    const [hastaData, setHastaData] = useState(null);
    const [randevular, setRandevular] = useState([]);
    const [selectedRandevu, setSelectedRandevu] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showRandevuModal, setShowRandevuModal] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [activeTab, setActiveTab] = useState('bilgiler');
    const hastaTC = getUserId();

    // İl ve ilçe verileri için durumlar
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [selectedIl, setSelectedIl] = useState('');
    const [selectedIlce, setSelectedIlce] = useState('');

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        password: '',
        confirmPassword: '',
        hasta_TC: hastaTC,
        doktor_TC: "",
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
            setDistricts(selectedProvince ? selectedProvince.ilceBilgisi : []);
            setSelectedIlce(''); // İl değiştiğinde ilçe sıfırlanır
        } else {
            setDistricts([]);
            setSelectedIlce('');
        }
    }, [selectedIl, provinces]);

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

    // Hasta verilerini ve randevuları çekme
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [hasta, randevular] = await Promise.all([
                    getHastaDatas(hastaTC),
                    getRandevularim(hastaTC).catch(() => []),
                ]);

                setHastaData(hasta.data);
                setRandevular(randevular.data);

                setSelectedIl(hasta.data.adresBilgisi.il_ID.toString());
                setSelectedIlce(hasta.data.adresBilgisi.ilce_ID.toString());
            } catch (error) {
                if (error.response?.status === 401) {
                    sessionStorage.removeItem('token');
                    navigate('/giris');
                } else {
                    console.error('Veri çekme hatası:', error);
                }
            }
        };

        if (hastaTC) {
            fetchData();
        } else {
            navigate('/giris');
        }
    }, [hastaTC, navigate]);

    // Hasta bilgilerini güncelleme
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await updateHastaDatas(hastaTC, editForm);
            if (response.status === 200) {
                setHastaData(prev => ({ ...prev, ...editForm }));
                setShowEditModal(false);
                alert('Bilgiler başarıyla güncellendi!');
            }
        } catch (error) {
            console.error('Güncelleme hatası:', error);
            alert('Güncelleme başarısız!');
        }
    };

    // Düzenleme butonuna tıklama
    const handleEditClick = () => {
        setEditForm({
            hastaBilgisi: { ...hastaData.hastaBilgisi },
            iletisimBilgisi: { ...hastaData.iletisimBilgisi },
            adresBilgisi: { ...hastaData.adresBilgisi }
        });
        setSelectedIl(hastaData.adresBilgisi.il_ID.toString());
        setSelectedIlce(hastaData.adresBilgisi.ilce_ID.toString());
        setShowEditModal(true);
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

    // Şifre güncelleme
    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        const { currentPassword, password, confirmPassword } = passwordForm;
        if (password !== confirmPassword) {
            alert('Yeni şifreler eşleşmiyor!');
            return;
        }
        try {
            const response = await updateHastaPassword({
                hasta_TC: hastaTC,
                currentPassword,
                password,
                confirmPassword
            });
            if (response.status === 200) {
                alert('Şifre başarıyla güncellendi!');
                setPasswordForm({
                    currentPassword: '',
                    password: '',
                    confirmPassword: '',
                    hasta_TC: hastaTC,
                    doktor_TC: ""
                });
            }
        } catch (error) {
            console.error('Şifre güncelleme hatası:', error);
            alert('Şifre güncelleme başarısız! Mevcut şifrenizi kontrol edin.');
        }
    };

    // Randevu detayını çekme
    const fetchRandevuDetay = async (randevuID) => {
        try {
            const randevuDetay = await getRandevuDatas(hastaTC, randevuID);
            setSelectedRandevu(randevuDetay);
            setShowRandevuModal(true);
        } catch (error) {
            console.error('Randevu detay hatası:', error);
        }
    };

    // Tarih ve saat formatlama
    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('tr-TR');
    const formatTime = (time) => time?.substring(0, 5) || '';

    // Sosyal medya linki render
    const renderSocialLink = (url) => {
        if (!url) return <p>Bilgi yok</p>;
        return <a href={url} target="_blank" rel="noopener noreferrer">{url.length > 30 ? 'Görüntüle' : url}</a>;
    };

    // Çıkış yapma
    const handleLogout = async () => {
        sessionStorage.clear();
        await navigate('/giris');
    };

    // Escape tuşu ile modal kapatma
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && showRandevuModal) {
                setShowRandevuModal(false);
            }
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [showRandevuModal]);

    // Sekme içeriği
    const renderContent = () => {
        switch (activeTab) {
            case 'bilgiler':
                return (
                    <div className="prf-bilgilerim-container">
                        <div className="prf-profil-baslik">
                            <h2>{hastaData.hastaBilgisi.isim} {hastaData.hastaBilgisi.soyisim}</h2>
                            <button className="prf-edit-btn" onClick={handleEditClick}>
                                <FaEdit /> Düzenle
                            </button>
                        </div>
                        <h3>Kişisel Bilgiler</h3>
                        <div className="prf-bilgi-grid">
                            <div className="prf-bilgi-item"><label>TC Kimlik No:</label><p>{hastaData.hastaBilgisi.hasta_TC}</p></div>
                            <div className="prf-bilgi-item"><label>Cinsiyet:</label><p>{hastaData.hastaBilgisi.cinsiyet ? 'Kadın' : 'Erkek'}</p></div>
                            <div className="prf-bilgi-item"><label>Doğum Tarihi:</label><p>{new Date(hastaData.hastaBilgisi.dogumTarihi).toLocaleDateString("tr-TR")}</p></div>
                            <div className="prf-bilgi-item"><label>Doğum Yeri:</label><p>{hastaData.hastaBilgisi.dogumYeri}</p></div>
                            <div className="prf-bilgi-item"><label>Anne Adı:</label><p>{hastaData.hastaBilgisi.anneAdi}</p></div>
                            <div className="prf-bilgi-item"><label>Baba Adı:</label><p>{hastaData.hastaBilgisi.babaAdi}</p></div>
                            <div className="prf-bilgi-item"><label>Sağlık Geçmişi:</label><p>{hastaData.hastaBilgisi.saglikGecmisi}</p></div>
                        </div>
                        <h3>İletişim Bilgileri</h3>
                        <div className="prf-bilgi-grid">
                            <div className="prf-bilgi-item"><label>Telefon:</label><p>{hastaData.iletisimBilgisi.telNo}</p></div>
                            <div className="prf-bilgi-item"><label>Alternatif Telefon:</label><p>{hastaData.iletisimBilgisi.telNo2}</p></div>
                            <div className="prf-bilgi-item"><label>E-Mail:</label><p>{hastaData.iletisimBilgisi.email}</p></div>
                            <div className="prf-bilgi-item"><label>Facebook:</label>{renderSocialLink(hastaData.iletisimBilgisi.facebook)}</div>
                            <div className="prf-bilgi-item"><label>Twitter:</label>{renderSocialLink(hastaData.iletisimBilgisi.twitter)}</div>
                            <div className="prf-bilgi-item"><label>Instagram:</label>{renderSocialLink(hastaData.iletisimBilgisi.instagram)}</div>
                            <div className="prf-bilgi-item"><label>LinkedIn:</label>{renderSocialLink(hastaData.iletisimBilgisi.linkedin)}</div>
                        </div>
                        <h3>Adres Bilgileri</h3>
                        <div className="prf-bilgi-grid">
                            <div className="prf-bilgi-item"><label>Ülke:</label><p>{hastaData.adresBilgisi.ulke}</p></div>
                            <div className="prf-bilgi-item">
                                <label>İl:</label>
                                <p>
                                    {provinces.find(prov => prov.ilId === hastaData.adresBilgisi.il_ID)?.ilAdi || 'Bilinmiyor'}
                                </p>
                            </div>
                            <div className="prf-bilgi-item">
                                <label>İlçe:</label>
                                <p>
                                    {provinces.find(prov => prov.ilId === hastaData.adresBilgisi.il_ID)?.ilceBilgisi.find(ilce => ilce.id === hastaData.adresBilgisi.ilce_ID)?.ilceAdi || 'Bilinmiyor'}
                                </p>
                            </div>
                            <div className="prf-bilgi-item"><label>Mahalle:</label><p>{hastaData.adresBilgisi.mahalle}</p></div>
                            <div className="prf-bilgi-item"><label>Cadde-Sokak:</label><p>{hastaData.adresBilgisi.caddeSokak}</p></div>
                            <div className="prf-bilgi-item"><label>Dış Kapı No:</label><p>{hastaData.adresBilgisi.disKapiNo}</p></div>
                            <div className="prf-bilgi-item"><label>İç Kapı No:</label><p>{hastaData.adresBilgisi.icKapiNo}</p></div>
                        </div>
                    </div>
                );
            case 'sifre-degistir':
                return (
                    <div className="prf-sifre-degistir-container">
                        <h3><FaEdit /> Şifreni Değiştir</h3>
                        <form onSubmit={handlePasswordUpdate} className="prf-password-form">
                            <div className="prf-form-group">
                                <label>Mevcut Şifre:</label>
                                <input
                                    type="password"
                                    value={passwordForm.currentPassword}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="prf-form-group">
                                <label>Yeni Şifre:</label>
                                <input
                                    type="password"
                                    value={passwordForm.password}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, password: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="prf-form-group">
                                <label>Yeni Şifre (Tekrar):</label>
                                <input
                                    type="password"
                                    value={passwordForm.confirmPassword}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="prf-button-group">
                                <button type="submit">Şifreyi Güncelle</button>
                            </div>
                        </form>
                    </div>
                );
            case 'randevular':
                const sortedRandevular = [...randevular].sort((a, b) => {
                    const dateA = new Date(a.randevuTarihi);
                    const dateB = new Date(b.randevuTarihi);

                    if (dateA.getTime() !== dateB.getTime()) {
                        return dateB - dateA;
                    } else {
                        const [hourA, minA] = a.baslangıcSaati.split(":").map(Number);
                        const [hourB, minB] = b.baslangıcSaati.split(":").map(Number);
                        return hourA - hourB || minA - minB;
                    }
                });

                return (
                    <div className="prf-randevu-listesi">
                        <h3><FaCalendarAlt /> Randevularım</h3>
                        {sortedRandevular.length > 0 ? (
                            sortedRandevular.map(randevu => (
                                <div
                                    key={randevu.randevuID}
                                    className="prf-randevu-item"
                                    onClick={() => fetchRandevuDetay(randevu.randevuID)}
                                >
                                    <span>{formatDate(randevu.randevuTarihi)}</span>
                                    <span>{formatTime(randevu.baslangıcSaati)}</span>
                                    <span>{hastaData.hastaBilgisi.isim} {hastaData.hastaBilgisi.soyisim}</span>
                                </div>
                            ))
                        ) : (
                            <p className="prf-bilgi-yok">Kayıtlı randevunuz bulunmamaktadır</p>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    if (!hastaData) {
        return (
            <div className="prf-checking">
                <div className="prf-loading-alert-wrapper">
                    <LoadingAnimation />
                </div>
                <p className="prf-loading-message">Bilgiler yükleniyor...</p>
            </div>
        );
    }

    return (
        <div className="prf-doktor-panel">
            <div className="prf-panel-container">
                <div className="prf-sol-menu">
                    <div className="prf-menu-header"><h2>Hasta Yönetim Paneli</h2></div>
                    <nav className="prf-menu-items">
                        <button className={`prf-menu-item ${activeTab === 'bilgiler' ? 'prf-active' : ''}`} onClick={() => setActiveTab('bilgiler')}>
                            <FaUser /> Bilgilerim
                        </button>
                        <button className={`prf-menu-item ${activeTab === 'sifre-degistir' ? 'prf-active' : ''}`} onClick={() => setActiveTab('sifre-degistir')}>
                            <FaEdit /> Şifreni Değiştir
                        </button>
                        <button className={`prf-menu-item ${activeTab === 'randevular' ? 'prf-active' : ''}`} onClick={() => setActiveTab('randevular')}>
                            <FaClock /> Randevularım
                        </button>
                        <button className="prf-menu-item" onClick={() => navigate('/hasta/randevu-al')}>
                            <FaCalendarDay /> Randevu Al
                        </button>
                        <button className="prf-menu-item" onClick={handleLogout}>
                            <FaSignOutAlt /> Çıkış Yap
                        </button>
                    </nav>
                </div>
                <div className="prf-sag-icerik">{renderContent()}</div>
            </div>

            {/* Düzenleme Modalı */}
            {showEditModal && (
                <div className="prf-modal-overlay">
                    <div className="prf-modal-content">
                        <button
                            className="prf-kapat-btn"
                            onClick={() => setShowEditModal(false)}
                            aria-label="Modali Kapat"
                        >
                            <FaTimes />
                        </button>
                        <h3>Bilgileri Düzenle</h3>
                        <form onSubmit={handleUpdate} className="prf-edit-form">
                            {/* Kişisel Bilgiler */}
                            <div className="prf-form-section">
                                <h4>Kişisel Bilgiler</h4>
                                <div className="prf-form-group">
                                    <label>İsim:</label>
                                    <input
                                        type="text"
                                        value={editForm.hastaBilgisi?.isim || ''}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                hastaBilgisi: { ...editForm.hastaBilgisi, isim: e.target.value },
                                            })
                                        }
                                    />
                                </div>
                                <div className="prf-form-group">
                                    <label>Soyisim:</label>
                                    <input
                                        type="text"
                                        value={editForm.hastaBilgisi?.soyisim || ''}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                hastaBilgisi: { ...editForm.hastaBilgisi, soyisim: e.target.value },
                                            })
                                        }
                                    />
                                </div>
                                <div className="prf-form-group">
                                    <label>Cinsiyet:</label>
                                    <select
                                        value={editForm.hastaBilgisi?.cinsiyet ? 'Kadın' : 'Erkek'}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                hastaBilgisi: {
                                                    ...editForm.hastaBilgisi,
                                                    cinsiyet: e.target.value === 'Kadın',
                                                },
                                            })
                                        }
                                    >
                                        <option>Erkek</option>
                                        <option>Kadın</option>
                                    </select>
                                </div>
                                <div className="prf-form-group">
                                    <label>Doğum Tarihi:</label>
                                    <input
                                        type="date"
                                        value={editForm.hastaBilgisi?.dogumTarihi?.split('T')[0] || ''}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                hastaBilgisi: { ...editForm.hastaBilgisi, dogumTarihi: e.target.value },
                                            })
                                        }
                                    />
                                </div>
                                <div className="prf-form-group">
                                    <label>Doğum Yeri:</label>
                                    <input
                                        type="text"
                                        value={editForm.hastaBilgisi?.dogumYeri || ''}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                hastaBilgisi: { ...editForm.hastaBilgisi, dogumYeri: e.target.value },
                                            })
                                        }
                                    />
                                </div>
                                <div className="prf-form-group">
                                    <label>Anne Adı:</label>
                                    <input
                                        type="text"
                                        value={editForm.hastaBilgisi?.anneAdi || ''}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                hastaBilgisi: { ...editForm.hastaBilgisi, anneAdi: e.target.value },
                                            })
                                        }
                                    />
                                </div>
                                <div className="prf-form-group">
                                    <label>Baba Adı:</label>
                                    <input
                                        type="text"
                                        value={editForm.hastaBilgisi?.babaAdi || ''}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                hastaBilgisi: { ...editForm.hastaBilgisi, babaAdi: e.target.value },
                                            })
                                        }
                                    />
                                </div>
                                <div className="prf-form-group">
                                    <label>Sağlık Geçmişi:</label>
                                    <textarea
                                        value={editForm.hastaBilgisi?.saglikGecmisi || ''}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                hastaBilgisi: { ...editForm.hastaBilgisi, saglikGecmisi: e.target.value },
                                            })
                                        }
                                    />
                                </div>
                            </div>

                            {/* İletişim Bilgileri */}
                            <div className="prf-form-section">
                                <h4>İletişim Bilgileri</h4>
                                <div className="prf-form-group">
                                    <label>Telefon Numarası:</label>
                                    <input
                                        type="text"
                                        value={editForm.iletisimBilgisi?.telNo || ''}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                iletisimBilgisi: { ...editForm.iletisimBilgisi, telNo: e.target.value },
                                            })
                                        }
                                    />
                                </div>
                                <div className="prf-form-group">
                                    <label>Alternatif Telefon Numarası:</label>
                                    <input
                                        type="text"
                                        value={editForm.iletisimBilgisi?.telNo2 || ''}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                iletisimBilgisi: { ...editForm.iletisimBilgisi, telNo2: e.target.value },
                                            })
                                        }
                                    />
                                </div>
                                <div className="prf-form-group">
                                    <label>E-Mail Adresi:</label>
                                    <input
                                        type="email"
                                        value={editForm.iletisimBilgisi?.email || ''}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                iletisimBilgisi: { ...editForm.iletisimBilgisi, email: e.target.value },
                                            })
                                        }
                                    />
                                </div>
                                <div className="prf-form-group">
                                    <label>Facebook:</label>
                                    <input
                                        type="text"
                                        value={editForm.iletisimBilgisi?.facebook || ''}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                iletisimBilgisi: { ...editForm.iletisimBilgisi, facebook: e.target.value },
                                            })
                                        }
                                    />
                                </div>
                                <div className="prf-form-group">
                                    <label>Twitter:</label>
                                    <input
                                        type="text"
                                        value={editForm.iletisimBilgisi?.twitter || ''}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                iletisimBilgisi: { ...editForm.iletisimBilgisi, twitter: e.target.value },
                                            })
                                        }
                                    />
                                </div>
                                <div className="prf-form-group">
                                    <label>Instagram:</label>
                                    <input
                                        type="text"
                                        value={editForm.iletisimBilgisi?.instagram || ''}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                iletisimBilgisi: { ...editForm.iletisimBilgisi, instagram: e.target.value },
                                            })
                                        }
                                    />
                                </div>
                                <div className="prf-form-group">
                                    <label>LinkedIn:</label>
                                    <input
                                        type="text"
                                        value={editForm.iletisimBilgisi?.linkedin || ''}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                iletisimBilgisi: { ...editForm.iletisimBilgisi, linkedin: e.target.value },
                                            })
                                        }
                                    />
                                </div>
                            </div>

                            {/* Adres Bilgileri */}
                            <div className="prf-form-section">
                                <h4>Adres Bilgileri</h4>
                                <div className="prf-form-group">
                                    <label>Ülke:</label>
                                    <input
                                        type="text"
                                        value={editForm.adresBilgisi?.ulke || ''}
                                        onChange={(e) => handleFormChange('adresBilgisi', 'ulke', e.target.value)}
                                    />
                                </div>
                                <div className="prf-form-group">
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
                                <div className="prf-form-group">
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
                                <div className="prf-form-group">
                                    <label>Mahalle:</label>
                                    <input
                                        type="text"
                                        value={editForm.adresBilgisi?.mahalle || ''}
                                        onChange={(e) => handleFormChange('adresBilgisi', 'mahalle', e.target.value)}
                                    />
                                </div>
                                <div className="prf-form-group">
                                    <label>Cadde-Sokak:</label>
                                    <input
                                        type="text"
                                        value={editForm.adresBilgisi?.caddeSokak || ''}
                                        onChange={(e) => handleFormChange('adresBilgisi', 'caddeSokak', e.target.value)}
                                    />
                                </div>
                                <div className="prf-form-group">
                                    <label>Dış Kapı No:</label>
                                    <input
                                        type="text"
                                        value={editForm.adresBilgisi?.disKapiNo || ''}
                                        onChange={(e) => handleFormChange('adresBilgisi', 'disKapiNo', e.target.value)}
                                    />
                                </div>
                                <div className="prf-form-group">
                                    <label>İç Kapı No:</label>
                                    <input
                                        type="text"
                                        value={editForm.adresBilgisi?.icKapiNo || ''}
                                        onChange={(e) => handleFormChange('adresBilgisi', 'icKapiNo', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="prf-button-group">
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
                <div
                    className="prf-modal-overlay"
                    onClick={(e) => {
                        if (e.target.className === 'prf-modal-overlay') {
                            setShowRandevuModal(false);
                        }
                    }}
                >
                    <div className="prf-modal-content prf-randevu-detay-container">
                        <button
                            className="prf-kapat-btn"
                            onClick={() => {
                                console.log("Kapatma butonuna tıklandı");
                                setShowRandevuModal(false);
                            }}
                            aria-label="Modali Kapat"
                        >
                            <FaTimes />
                        </button>
                        <div className="prf-randevu-header">
                            <h3>
                                <FaCalendarAlt aria-hidden="true" /> Randevu Detayları
                            </h3>
                        </div>

                        <div className="prf-randevu-zaman">
                            <span className="prf-tarih">
                                <FaCalendarDay aria-hidden="true" /> {formatDate(selectedRandevu.randevuDetay.randevuTarihi)}
                            </span>
                            <span className="prf-saat">
                                <FaClock aria-hidden="true" /> {formatTime(selectedRandevu.randevuDetay.baslangıcSaati)} - {formatTime(selectedRandevu.randevuDetay.bitisSaati)}
                            </span>
                        </div>

                        <div className="prf-randevu-grid">
                            <div className="prf-hasta-bilgileri prf-info-card">
                                <h4><FaUser aria-hidden="true" /> Hasta Bilgileri</h4>
                                <div className="prf-info-grid">
                                    <div className="prf-info-item">
                                        <label>TC Kimlik No:</label>
                                        <p>{selectedRandevu.hasta.hasta_TC}</p>
                                    </div>
                                    <div className="prf-info-item">
                                        <label>Ad Soyad:</label>
                                        <p>{selectedRandevu.hasta.isim} {selectedRandevu.hasta.soyisim}</p>
                                    </div>
                                    <div className="prf-info-item">
                                        <label>Doğum Tarihi:</label>
                                        <p>{formatDate(selectedRandevu.hasta.dogumTarihi)}</p>
                                    </div>
                                    <div className="prf-info-item">
                                        <label>Cinsiyet:</label>
                                        <p>{selectedRandevu.hasta.cinsiyet ? 'Kadın' : 'Erkek'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="prf-aile-bilgileri prf-info-card">
                                <h4><FaUsers aria-hidden="true" /> Aile Bilgileri</h4>
                                <div className="prf-info-grid">
                                    <div className="prf-info-item">
                                        <label>Anne Adı:</label>
                                        <p>{selectedRandevu.hasta.anneAdi || '-'}</p>
                                    </div>
                                    <div className="prf-info-item">
                                        <label>Baba Adı:</label>
                                        <p>{selectedRandevu.hasta.babaAdi || '-'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="prf-saglik-bilgileri prf-info-card">
                                <h4><FaHeartbeat aria-hidden="true" /> Sağlık Geçmişi</h4>
                                <div className="prf-info-content">
                                    {selectedRandevu.hasta.saglikGecmisi ? (
                                        <p>{selectedRandevu.hasta.saglikGecmisi}</p>
                                    ) : (
                                        <p className="prf-bilgi-yok">Kayıtlı sağlık geçmişi bulunmamaktadır</p>
                                    )}
                                </div>
                            </div>

                            <div className="prf-ek-bilgiler prf-info-card">
                                <h4><FaInfoCircle aria-hidden="true" /> Ek Bilgiler</h4>
                                <div className="prf-info-grid">
                                    <div className="prf-info-item">
                                        <label>Doğum Yeri:</label>
                                        <p>{selectedRandevu.hasta.dogumYeri || '-'}</p>
                                    </div>
                                    <div className="prf-info-item">
                                        <label>Son Güncelleme:</label>
                                        <p>{formatDate(selectedRandevu.randevuDetay.olusturulmaTarihi)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="prf-randevu-notu prf-info-card">
                            <h4><FaStickyNote aria-hidden="true" /> Randevu Notu</h4>
                            <textarea
                                className="prf-not-input"
                                value={selectedRandevu.randevuDetay.randevuNotu || ''}
                                readOnly
                                placeholder="Herhangi bir randevu notu girilmemiştir."
                                aria-label="Randevu Notu"
                            />
                        </div>

                        <div className="prf-randevu-actions">
                            <button className="prf-action-btn prf-print-btn" aria-label="Randevu Detaylarını Yazdır">
                                <FaPrint aria-hidden="true" /> Yazdır
                            </button>
                            <button className="prf-action-btn prf-pdf-btn" aria-label="PDF Oluştur">
                                <FaFilePdf aria-hidden="true" /> PDF Oluştur
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;