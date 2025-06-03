import React, { useState, useEffect } from 'react';
import { getAddressByHastaneId, updateAddressByHastaneId, getIlveIlceDatas } from '../../../api/api-admin';
import './AddressModal.css';
import LoadingAnimation from '../../../components/LoadingAnimation/LoadingAnimation';

const AddressModal = ({ hospitalId, onClose }) => {
    const [hospital, setHospital] = useState(null);
    const [loading, setLoading] = useState(true);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [selectedIl, setSelectedIl] = useState('');
    const [selectedIlce, setSelectedIlce] = useState('');
    const [address, setAddress] = useState({
        ulke: '',
        mahalle: '',
        caddeSokak: '',
        disKapiNo: '',
        icKapiNo: '',
        il_ID: 0,
        ilce_ID: 0
    });
    const [errors, setErrors] = useState({});

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

    useEffect(() => {
        if (selectedIl && address.ilce_ID && districts.length > 0) {
            setSelectedIlce(address.ilce_ID.toString());
        }
    }, [districts, selectedIl, address.ilce_ID]);

    useEffect(() => {
        const fetchAddress = async () => {
            try {
                const response = await getAddressByHastaneId(hospitalId);
                setHospital(response.data);
                setAddress({
                    ulke: response.data.ulke || '',
                    mahalle: response.data.mahalle || '',
                    caddeSokak: response.data.caddeSokak || '',
                    disKapiNo: response.data.disKapiNo || '',
                    icKapiNo: response.data.icKapiNo || '',
                    il_ID: response.data.il_ID || 0,
                    ilce_ID: response.data.ilce_ID || 0
                });
                setSelectedIl(response.data.il_ID ? response.data.il_ID.toString() : '');
                setSelectedIlce(response.data.ilce_ID ? response.data.ilce_ID.toString() : '');
                setLoading(false);
            } catch (error) {
                setLoading(false);
                if (error.response?.status === 401) {
                    sessionStorage.removeItem('token');
                    onClose();
                    alert('Oturum süresi doldu, lütfen tekrar giriş yapın.');
                } else {
                    console.error('Adres bilgileri alınırken hata oluştu:', error);
                    alert('Bilgiler yüklenirken hata oluştu.');
                }
            }
        };
        fetchAddress();
    }, [hospitalId, onClose]);

    const handleChange = (e) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const handleIlChange = (e) => {
        const ilId = e.target.value;
        setSelectedIl(ilId);
        setAddress(prevState => ({
            ...prevState,
            il_ID: ilId ? parseInt(ilId) : 0,
            ilce_ID: 0
        }));
        setSelectedIlce('');
        setErrors({ ...errors, il_ID: '', ilce_ID: '' });
    };

    const handleIlceChange = (e) => {
        const ilceId = e.target.value;
        setSelectedIlce(ilceId);
        setAddress(prevState => ({
            ...prevState,
            ilce_ID: ilceId ? parseInt(ilceId) : 0
        }));
        setErrors({ ...errors, ilce_ID: '' });
    };

    const validate = () => {
        const newErrors = {};
        if (!address.ulke.trim()) newErrors.ulke = 'Ülke zorunlu.';
        if (!address.il_ID) newErrors.il_ID = 'İl seçimi zorunlu.';
        if (!address.ilce_ID) newErrors.ilce_ID = 'İlçe seçimi zorunlu.';
        return newErrors;
    };

    const handleSave = async () => {
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            await updateAddressByHastaneId(hospitalId, address);
            alert('Adres bilgileri güncellendi!');
            onClose();
        } catch (error) {
            console.error('Güncelleme hatası:', error);
            alert(`Güncelleme başarısız: ${error.response?.data?.message || error.message}`);
        }
    };

    if (loading) {
        return (
            <div className="address-modal-checking">
                <div className="address-modal-loading-alert-wrapper">
                    <LoadingAnimation />
                </div>
                <p className="address-modal-loading-message">Bilgileri yükleniyor...</p>
            </div>
        );
    }

    return (
        <div className="address-modal-overlay">
            <div className="address-modal">
                <div className="address-modal-header">
                    <h2>{hospital.hastaneAdi} Adres Bilgileri</h2>
                    <button className="address-modal-close-btn" onClick={onClose}>×</button>
                </div>
                <div className="address-modal-content">
                    <div className="address-modal-form-columns">
                        <div className="address-modal-form-column address-modal-edit-box">
                            <h3>Güncelle</h3>
                            <div className="address-modal-form-group">
                                <label>Ülke:</label>
                                <input
                                    type="text"
                                    name="ulke"
                                    value={address.ulke}
                                    onChange={handleChange}
                                    className={errors.ulke ? 'address-modal-input-error' : ''}
                                />
                                {errors.ulke && <div className="address-modal-error-message">{errors.ulke}</div>}
                            </div>
                            <div className="address-modal-form-group">
                                <label>İl:</label>
                                <select
                                    value={selectedIl}
                                    onChange={handleIlChange}
                                    className={errors.il_ID ? 'address-modal-input-error' : ''}
                                >
                                    <option value="">İl Seçiniz</option>
                                    {provinces.map(province => (
                                        <option key={province.ilId} value={province.ilId}>
                                            {province.ilAdi}
                                        </option>
                                    ))}
                                </select>
                                {errors.il_ID && <div className="address-modal-error-message">{errors.il_ID}</div>}
                            </div>
                            <div className="address-modal-form-group">
                                <label>İlçe:</label>
                                <select
                                    value={selectedIlce}
                                    onChange={handleIlceChange}
                                    disabled={!selectedIl}
                                    className={errors.ilce_ID ? 'address-modal-input-error' : ''}
                                >
                                    <option value="">İlçe Seçiniz</option>
                                    {districts.map(district => (
                                        <option key={district.id} value={district.id}>
                                            {district.ilceAdi}
                                        </option>
                                    ))}
                                </select>
                                {errors.ilce_ID && <div className="address-modal-error-message">{errors.ilce_ID}</div>}
                            </div>
                            <div className="address-modal-form-group">
                                <label>Mahalle:</label>
                                <input
                                    type="text"
                                    name="mahalle"
                                    value={address.mahalle}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="address-modal-form-group">
                                <label>Cadde/Sokak:</label>
                                <input
                                    type="text"
                                    name="caddeSokak"
                                    value={address.caddeSokak}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="address-modal-form-group">
                                <label>Dış Kapı No:</label>
                                <input
                                    type="text"
                                    name="disKapiNo"
                                    value={address.disKapiNo}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="address-modal-form-group">
                                <label>İç Kapı No:</label>
                                <input
                                    type="text"
                                    name="icKapiNo"
                                    value={address.icKapiNo}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="address-modal-actions">
                        <button className="address-modal-confirm-btn" onClick={handleSave}>Kaydet</button>
                        <button className="address-modal-cancel-btn" onClick={onClose}>İptal</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddressModal;