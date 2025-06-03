import React, { useEffect, useState } from "react";
import { getHastaByTC, updateHasta } from "../../api/api-admin";
import "./EditModal.css";
import LoadingAnimation from "../../components/LoadingAnimation/LoadingAnimation";

const EditModal = ({ patient, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    hasta_TC: "",
    dogumTarihi: "",
    isim: "",
    soyisim: "",
    anneAdi: "",
    babaAdi: "",
    saglikGecmisi: "",
    dogumYeri: "",
    cinsiyet: true,
    sifre: "",
    adres_ID: 0,
    iletisim_ID: 0,
    roles: ["Hasta"],
  });

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await getHastaByTC(patient.hasta_TC);
        setFormData({
          hasta_TC: response.data.hasta_TC || "",
          dogumTarihi: response.data.dogumTarihi
            ? response.data.dogumTarihi.split("T")[0]
            : "",
          isim: response.data.isim || "",
          soyisim: response.data.soyisim || "",
          anneAdi: response.data.anneAdi || "",
          babaAdi: response.data.babaAdi || "",
          saglikGecmisi: response.data.saglikGecmisi || "",
          dogumYeri: response.data.dogumYeri || "",
          cinsiyet: response.data.cinsiyet !== undefined ? response.data.cinsiyet : true,
          sifre: response.data.sifre || "",
          adres_ID: response.data.adres_ID || 0,
          iletisim_ID: response.data.iletisim_ID || 0,
          roles: response.data.roles || ["Hasta"],
        });
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Hasta bilgileri alınırken hata oluştu:", error);
      }
    };
    fetchPatient();
  }, [patient.hasta_TC]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "cinsiyet" ? value === "true" : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const isUpdated = await updateHasta(patient.hasta_TC, formData);
      if (isUpdated) {
        onUpdate(formData);
        alert("Hasta bilgileri başarıyla güncellendi.");
        onClose();
      }
    } catch (error) {
      console.error("Güncelleme hatası:", error);
    }
  };

  if (loading) {
    return (
      <div className="em-modal-overlay">
        <div className="em-modal">
          <div className="em-checking">
            <LoadingAnimation />
            <p className="em-loading-message">Bilgiler yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="em-modal-overlay">
      <div className="em-modal">
        <div className="em-modal-header">
          <h2>Hasta Düzenle</h2>
          <button className="em-close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <form className="em-modal-content" onSubmit={handleSubmit}>
          <div className="em-form-columns">
            <div className="em-form-column">
              <div className="em-form-group">
                <label>TC Kimlik No:</label>
                <input
                  type="text"
                  name="hasta_TC"
                  value={formData.hasta_TC}
                  onChange={handleChange}
                  required
                  disabled
                />
              </div>
              <div className="em-form-group">
                <label>Ad:</label>
                <input
                  type="text"
                  name="isim"
                  value={formData.isim}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="em-form-group">
                <label>Soyad:</label>
                <input
                  type="text"
                  name="soyisim"
                  value={formData.soyisim}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="em-form-group">
                <label>Doğum Tarihi:</label>
                <input
                  type="date"
                  name="dogumTarihi"
                  value={formData.dogumTarihi || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="em-form-group">
                <label>Cinsiyet:</label>
                <div className="em-radio-group">
                  <label>
                    <input
                      type="radio"
                      name="cinsiyet"
                      value="true"
                      checked={formData.cinsiyet === true}
                      onChange={handleChange}
                    />
                    Kadın
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="cinsiyet"
                      value="false"
                      checked={formData.cinsiyet === false}
                      onChange={handleChange}
                    />
                    Erkek
                  </label>
                </div>
              </div>
            </div>
            <div className="em-form-column">
              <div className="em-form-group">
                <label>Anne Adı:</label>
                <input
                  type="text"
                  name="anneAdi"
                  value={formData.anneAdi}
                  onChange={handleChange}
                />
              </div>
              <div className="em-form-group">
                <label>Baba Adı:</label>
                <input
                  type="text"
                  name="babaAdi"
                  value={formData.babaAdi}
                  onChange={handleChange}
                />
              </div>
              <div className="em-form-group">
                <label>Sağlık Geçmişi:</label>
                <textarea
                  name="saglikGecmisi"
                  value={formData.saglikGecmisi}
                  onChange={handleChange}
                  rows="3"
                />
              </div>
              <div className="em-form-group">
                <label>Doğum Yeri:</label>
                <input
                  type="text"
                  name="dogumYeri"
                  value={formData.dogumYeri}
                  onChange={handleChange}
                />
              </div>
              <div className="em-form-group">
                <label>Şifre:</label>
                <input
                  type="password"
                  name="sifre"
                  value={formData.sifre}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
          <div className="em-modal-actions">
            <button type="submit" className="em-confirm-btn">
              Güncelle
            </button>
            <button type="button" className="em-cancel-btn" onClick={onClose}>
              İptal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;