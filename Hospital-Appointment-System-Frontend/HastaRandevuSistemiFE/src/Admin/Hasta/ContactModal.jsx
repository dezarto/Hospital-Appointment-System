import React, { useEffect, useState } from "react";
import {
    getCommunicationInfoByHastaTC,
    updateCommunicationInfoByHastaTC,
} from "../../api/api-admin";
import "./ContactModal.css";
import LoadingAnimation from "../../components/LoadingAnimation/LoadingAnimation";

const ContactModal = ({ tc, onClose, onUpdate }) => {
    const [loading, setLoading] = useState(true);
    const [contactInfo, setContactInfo] = useState({
        telNo: "",
        telNo2: "",
        email: "",
    });

    useEffect(() => {
        const fetchContact = async () => {
            try {
                const response = await getCommunicationInfoByHastaTC(tc);
                setContactInfo({
                    telNo: response.data.telNo || "",
                    telNo2: response.data.telNo2 || "",
                    email: response.data.email || "",
                });
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.error("İletişim bilgileri alınırken hata oluştu:", error);
            }
        };
        fetchContact();
    }, [tc]);

    const handleChange = (e) => {
        setContactInfo({ ...contactInfo, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            await updateCommunicationInfoByHastaTC(tc, contactInfo);
            onUpdate(contactInfo);
            alert("İletişim bilgileri güncellendi!");
            onClose();
        } catch (error) {
            console.error("Güncelleme hatası:", error);
        }
    };

    if (loading) {
        return (
            <div className="cm-modal-overlay">
                <div className="cm-modal">
                    <div className="cm-checking">
                        <LoadingAnimation />
                        <p className="cm-loading-message">Bilgiler yükleniyor...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="cm-modal-overlay">
            <div className="cm-modal">
                <div className="cm-modal-header">
                    <h2>İletişim Bilgilerini Güncelle</h2>
                    <button className="cm-close-btn" onClick={onClose}>
                        ×
                    </button>
                </div>
                <div className="cm-modal-content">
                    <div className="cm-form-group">
                        <label>Telefon:</label>
                        <input
                            type="text"
                            name="telNo"
                            value={contactInfo.telNo}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="cm-form-group">
                        <label>Telefon 2:</label>
                        <input
                            type="text"
                            name="telNo2"
                            value={contactInfo.telNo2}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="cm-form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={contactInfo.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="cm-modal-actions">
                        <button type="button" className="cm-confirm-btn" onClick={handleSave}>
                            Kaydet
                        </button>
                        <button type="button" className="cm-cancel-btn" onClick={onClose}>
                            İptal
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactModal;