import React, { useEffect, useState } from 'react';
import { getCommunicationInfoByHastaneId, updateCommunicationInfoByHastaneId } from '../../../api/api-admin';
import './ContactModal.css';
import LoadingAnimation from '../../../components/LoadingAnimation/LoadingAnimation';

const ContactModal = ({ hospitalId, onClose }) => {
    const [hospital, setHospital] = useState(null);
    const [loading, setLoading] = useState(true);
    const [contactInfo, setContactInfo] = useState({
        telNo: '',
        telNo2: '',
        email: '',
        facebook: '',
        twitter: '',
        instagram: '',
        linkedin: '',
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchHospital = async () => {
            try {
                const response = await getCommunicationInfoByHastaneId(hospitalId);
                setHospital(response.data);
                setContactInfo({
                    telNo: response.data.telNo || '',
                    telNo2: response.data.telNo2 || '',
                    email: response.data.email || '',
                    facebook: response.data.facebook || '',
                    twitter: response.data.twitter || '',
                    instagram: response.data.instagram || '',
                    linkedin: response.data.linkedin || '',
                });
                setLoading(false);
            } catch (error) {
                setLoading(false);
                if (error.response?.status === 401) {
                    sessionStorage.removeItem('token');
                    onClose();
                    alert('Oturum süresi doldu, lütfen tekrar giriş yapın.');
                } else {
                    console.error('İletişim bilgileri alınırken hata oluştu:', error);
                    alert('Bilgiler yüklenirken hata oluştu.');
                }
            }
        };
        fetchHospital();
    }, [hospitalId, onClose]);

    const handleChange = (e) => {
        setContactInfo({ ...contactInfo, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const validate = () => {
        const newErrors = {};
        if (!contactInfo.email.trim()) newErrors.email = 'Email zorunlu.';
        else if (!/\S+@\S+\.\S+/.test(contactInfo.email)) newErrors.email = 'Geçerli bir email adresi girin.';
        return newErrors;
    };

    const handleSave = async () => {
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            await updateCommunicationInfoByHastaneId(hospitalId, contactInfo);
            alert('İletişim bilgileri güncellendi!');
            const updatedData = await getCommunicationInfoByHastaneId(hospitalId);
            setHospital(updatedData.data);
            setContactInfo({
                telNo: updatedData.data.telNo || '',
                telNo2: updatedData.data.telNo2 || '',
                email: updatedData.data.email || '',
                facebook: updatedData.data.facebook || '',
                twitter: updatedData.data.twitter || '',
                instagram: updatedData.data.instagram || '',
                linkedin: updatedData.data.linkedin || '',
            });
            onClose();
        } catch (error) {
            console.error('Güncelleme hatası:', error);
            alert(`Güncelleme başarısız: ${error.response?.data?.message || error.message}`);
        }
    };

    if (loading) {
        return (
            <div className="contact-modal-checking">
                <div className="contact-modal-loading-alert-wrapper">
                    <LoadingAnimation />
                </div>
                <p className="contact-modal-loading-message">Bilgileri yükleniyor...</p>
            </div>
        );
    }

    return (
        <div className="contact-modal-overlay">
            <div className="contact-modal">
                <div className="contact-modal-header">
                    <h2>{hospital.hastaneAdi} İletişim Bilgileri</h2>
                    <button className="contact-modal-close-btn" onClick={onClose}>×</button>
                </div>
                <div className="contact-modal-content">
                    <div className="contact-modal-form-columns">
                        <div className="contact-modal-form-column contact-modal-edit-box">
                            <h3>Güncelle</h3>
                            <div className="contact-modal-form-group">
                                <label>Telefon:</label>
                                <input
                                    type="text"
                                    name="telNo"
                                    value={contactInfo.telNo}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="contact-modal-form-group">
                                <label>Telefon 2:</label>
                                <input
                                    type="text"
                                    name="telNo2"
                                    value={contactInfo.telNo2}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="contact-modal-form-group">
                                <label>Email:</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={contactInfo.email}
                                    onChange={handleChange}
                                    className={errors.email ? 'contact-modal-input-error' : ''}
                                />
                                {errors.email && <div className="contact-modal-error-message">{errors.email}</div>}
                            </div>
                            <div className="contact-modal-form-group">
                                <label>Facebook:</label>
                                <input
                                    type="text"
                                    name="facebook"
                                    value={contactInfo.facebook}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="contact-modal-form-group">
                                <label>Twitter:</label>
                                <input
                                    type="text"
                                    name="twitter"
                                    value={contactInfo.twitter}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="contact-modal-form-group">
                                <label>Instagram:</label>
                                <input
                                    type="text"
                                    name="instagram"
                                    value={contactInfo.instagram}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="contact-modal-form-group">
                                <label>Linkedin:</label>
                                <input
                                    type="text"
                                    name="linkedin"
                                    value={contactInfo.linkedin}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="contact-modal-actions">
                        <button className="contact-modal-confirm-btn" onClick={handleSave}>Kaydet</button>
                        <button className="contact-modal-cancel-btn" onClick={onClose}>İptal</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactModal;