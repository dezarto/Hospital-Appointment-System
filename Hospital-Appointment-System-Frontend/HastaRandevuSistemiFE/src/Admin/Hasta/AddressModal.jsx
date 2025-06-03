import React, { useEffect, useState } from "react";
import {
    getAddressByHastaTC,
    updateAddressByHastaTC,
} from "../../api/api-admin";
import "./AddressModal.css";
import LoadingAnimation from "../../components/LoadingAnimation/LoadingAnimation";

const AddressModal = ({ tc, provinces, onClose, onUpdate }) => {
    const [loading, setLoading] = useState(true);
    const [address, setAddress] = useState({
        ulke: "",
        mahalle: "",
        caddeSokak: "",
        disKapiNo: "",
        icKapiNo: "",
        il_ID: 0,
        ilce_ID: 0,
    });
    const [districts, setDistricts] = useState([]);
    const [selectedIl, setSelectedIl] = useState("");
    const [selectedIlce, setSelectedIlce] = useState("");

    useEffect(() => {
        const fetchAddress = async () => {
            try {
                const response = await getAddressByHastaTC(tc);
                setAddress({
                    ulke: response.data.ulke || "",
                    mahalle: response.data.mahalle || "",
                    caddeSokak: response.data.caddeSokak || "",
                    disKapiNo: response.data.disKapiNo || "",
                    icKapiNo: response.data.icKapiNo || "",
                    il_ID: response.data.il_ID || 0,
                    ilce_ID: response.data.ilce_ID || 0,
                });
                setSelectedIl(response.data.il_ID ? response.data.il_ID.toString() : "");
                setSelectedIlce(
                    response.data.ilce_ID ? response.data.ilce_ID.toString() : ""
                );
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.error("Adres bilgileri alınırken hata oluştu:", error);
            }
        };
        fetchAddress();
    }, [tc]);

    useEffect(() => {
        if (selectedIl) {
            const selectedProvince = provinces.find(
                (prov) => prov.ilId === parseInt(selectedIl)
            );
            setDistricts(selectedProvince ? selectedProvince.ilceBilgisi : []);
            setSelectedIlce("");
            setAddress((prev) => ({
                ...prev,
                ilce_ID: 0,
            }));
        } else {
            setDistricts([]);
            setSelectedIlce("");
            setAddress((prev) => ({
                ...prev,
                ilce_ID: 0,
            }));
        }
    }, [selectedIl, provinces]);

    const handleIlChange = (e) => {
        const ilId = e.target.value;
        setSelectedIl(ilId);
        setAddress((prev) => ({
            ...prev,
            il_ID: parseInt(ilId) || 0,
            ilce_ID: 0,
        }));
    };

    const handleIlceChange = (e) => {
        const ilceId = e.target.value;
        setSelectedIlce(ilceId);
        setAddress((prev) => ({
            ...prev,
            ilce_ID: parseInt(ilceId) || 0,
        }));
    };

    const handleChange = (e) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            await updateAddressByHastaTC(tc, address);
            onUpdate(address);
            alert("Adres bilgileri güncellendi!");
            onClose();
        } catch (error) {
            console.error("Güncelleme hatası:", error);
        }
    };

    if (loading) {
        return (
            <div className="am-modal-overlay">
                <div className="am-modal">
                    <div className="am-checking">
                        <LoadingAnimation />
                        <p className="am-loading-message">Bilgiler yükleniyor...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="am-modal-overlay">
            <div className="am-modal">
                <div className="am-modal-header">
                    <h2>Adres Bilgilerini Güncelle</h2>
                    <button className="am-close-btn" onClick={onClose}>
                        ×
                    </button>
                </div>
                <div className="am-modal-content">
                    <div className="am-form-group">
                        <label>Ülke:</label>
                        <input
                            type="text"
                            name="ulke"
                            value={address.ulke}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="am-form-group">
                        <label>İl:</label>
                        <select name="il_ID" value={selectedIl} onChange={handleIlChange}>
                            <option value="">İl Seçiniz</option>
                            {provinces.map((province) => (
                                <option key={province.ilId} value={province.ilId}>
                                    {province.ilAdi}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="am-form-group">
                        <label>İlçe:</label>
                        <select
                            name="ilce_ID"
                            value={selectedIlce}
                            onChange={handleIlceChange}
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
                    <div className="am-form-group">
                        <label>Mahalle:</label>
                        <input
                            type="text"
                            name="mahalle"
                            value={address.mahalle}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="am-form-group">
                        <label>Cadde/Sokak:</label>
                        <input
                            type="text"
                            name="caddeSokak"
                            value={address.caddeSokak}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="am-input-group">
                        <div className="am-form-group">
                            <label>Dış Kapı No:</label>
                            <input
                                type="text"
                                name="disKapiNo"
                                value={address.disKapiNo}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="am-form-group">
                            <label>İç Kapı No:</label>
                            <input
                                type="text"
                                name="icKapiNo"
                                value={address.icKapiNo}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="am-modal-actions">
                        <button type="button" className="am-confirm-btn" onClick={handleSave}>
                            Kaydet
                        </button>
                        <button type="button" className="am-cancel-btn" onClick={onClose}>
                            İptal
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddressModal;