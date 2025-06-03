import React, { useEffect, useState } from "react";
import "./HastaHome.css";
import {
  hastalar,
  deleteHasta,
  addHasta,
  getIlveIlceDatas,
} from "../../api/api-admin";
import LoadingAnimation from "../../components/LoadingAnimation/LoadingAnimation";
import EditModal from "./EditModal";
import AddressModal from "./AddressModal";
import ContactModal from "./ContactModal";

const HastaHome = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [passwordError, setPasswordError] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(true);

  // İl ve ilçe verileri için durumlar
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedIl, setSelectedIl] = useState("");
  const [selectedIlce, setSelectedIlce] = useState("");

  const [newPatient, setNewPatient] = useState({
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
    sifreOnay: "",
    roles: ["Hasta"],
    ulke: "",
    mahalle: "",
    caddeSokak: "",
    disKapiNo: "",
    icKapiNo: "",
    il_ID: 0,
    ilce_ID: 0,
    telNo: "",
    telNo2: "",
    email: "",
  });

  // İl ve ilçe verilerini çekme
  useEffect(() => {
    const fetchIlveIlceDatas = async () => {
      try {
        const response = await getIlveIlceDatas();
        setProvinces(response);
      } catch (error) {
        console.error("İl ve ilçe bilgileri yüklenemedi:", error);
      }
    };
    fetchIlveIlceDatas();
  }, []);

  // İl seçildiğinde ilçeleri güncelle
  useEffect(() => {
    if (selectedIl) {
      const selectedProvince = provinces.find(
        (prov) => prov.ilId === parseInt(selectedIl)
      );
      setDistricts(selectedProvince ? selectedProvince.ilceBilgisi : []);
      setSelectedIlce("");
    } else {
      setDistricts([]);
      setSelectedIlce("");
    }
  }, [selectedIl, provinces]);

  // İl değişikliğini yönetme
  const handleIlChange = (e) => {
    const ilId = e.target.value;
    setSelectedIl(ilId);
    setNewPatient((prev) => ({
      ...prev,
      il_ID: parseInt(ilId) || 0,
      ilce_ID: 0,
    }));
  };

  // İlçe değişikliğini yönetme
  const handleIlceChange = (e) => {
    const ilceId = e.target.value;
    setSelectedIlce(ilceId);
    setNewPatient((prev) => ({
      ...prev,
      ilce_ID: parseInt(ilceId) || 0,
    }));
  };

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await hastalar();
        setPatients(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        if (error.response?.status === 401) {
          sessionStorage.removeItem("token");
          alert("Oturum süresi doldu, lütfen tekrar giriş yapın.");
          window.location.href = "/giris";
        } else {
          console.error("Hasta verileri alınırken hata oluştu:", error);
        }
      }
    };
    fetchPatients();
  }, []);

  const handleEditClick = (patient) => {
    setSelectedPatient(patient);
    setShowEditModal(true);
  };

  const handleAddressClick = (patient) => {
    setSelectedPatient(patient);
    setShowAddressModal(true);
  };

  const handleContactClick = (patient) => {
    setSelectedPatient(patient);
    setShowContactModal(true);
  };

  const handleDeleteClick = (patient) => {
    setSelectedPatient(patient);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (selectedPatient) {
      try {
        const isDeleted = await deleteHasta(selectedPatient.hasta_TC);
        if (isDeleted) {
          setPatients((prev) =>
            prev.filter((p) => p.hasta_TC !== selectedPatient.hasta_TC)
          );
        }
        setShowDeleteModal(false);
      } catch (error) {
        console.error("Hasta silinirken hata oluştu:", error);
        alert("Hasta silinirken bir hata oluştu.");
      }
    }
  };

  const handleNewPatientChange = (e) => {
    const { name, value } = e.target;
    if (name === "cinsiyet") {
      setNewPatient((prev) => ({
        ...prev,
        [name]: value === "true",
      }));
    } else {
      setNewPatient((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
    if (name === "sifre" || name === "sifreOnay") {
      setPasswordError("");
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!newPatient.hasta_TC.trim()) errors.hasta_TC = "TC Kimlik No zorunlu";
    if (!newPatient.isim.trim()) errors.isim = "Ad zorunlu";
    if (!newPatient.soyisim.trim()) errors.soyisim = "Soyad zorunlu";
    if (!newPatient.dogumTarihi) errors.dogumTarihi = "Doğum tarihi zorunlu";
    if (!newPatient.sifre) errors.sifre = "Şifre zorunlu";
    if (newPatient.sifre !== newPatient.sifreOnay) {
      errors.sifreOnay = "Şifreler eşleşmiyor";
      setPasswordError("Şifreler eşleşmiyor!");
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveNewPatient = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await addHasta(newPatient);
      alert("Yeni hasta başarıyla eklendi!");
      setShowAddModal(false);
      setNewPatient({
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
        sifreOnay: "",
        roles: ["Hasta"],
        ulke: "",
        mahalle: "",
        caddeSokak: "",
        disKapiNo: "",
        icKapiNo: "",
        il_ID: 0,
        ilce_ID: 0,
        telNo: "",
        telNo2: "",
        email: "",
      });
      setSelectedIl("");
      setSelectedIlce("");
      setFormErrors({});
      const response = await hastalar();
      setPatients(response.data);
    } catch (error) {
      console.error("Yeni hasta eklenirken hata oluştu:", error);
      alert(`Hasta eklenirken hata oluştu: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleSort = (column) => {
    let order = "asc";
    if (sortColumn === column && sortOrder === "asc") {
      order = "desc";
    }
    setSortColumn(column);
    setSortOrder(order);

    const sortedPatients = [...patients].sort((a, b) => {
      if (a[column] < b[column]) return order === "asc" ? -1 : 1;
      if (a[column] > b[column]) return order === "asc" ? 1 : -1;
      return 0;
    });
    setPatients(sortedPatients);
  };

  const renderSortIcon = (column) => {
    if (sortColumn === column) {
      return sortOrder === "asc" ? " ▲" : " ▼";
    }
    return "";
  };

  const handleUpdatePatient = (updatedPatient) => {
    setPatients((prev) =>
      prev.map((p) =>
        p.hasta_TC === updatedPatient.hasta_TC ? updatedPatient : p
      )
    );
    setShowEditModal(false);
  };

  const handleUpdateAddress = (updatedAddress) => {
    setPatients((prev) =>
      prev.map((p) =>
        p.hasta_TC === selectedPatient.hasta_TC
          ? { ...p, ...updatedAddress }
          : p
      )
    );
    setShowAddressModal(false);
  };

  const handleUpdateContact = (updatedContact) => {
    setPatients((prev) =>
      prev.map((p) =>
        p.hasta_TC === selectedPatient.hasta_TC
          ? { ...p, ...updatedContact }
          : p
      )
    );
    setShowContactModal(false);
  };

  if (loading) {
    return (
      <div className="hh-checking">
        <div className="hh-loading-alert-wrapper">
          <LoadingAnimation />
        </div>
        <p className="hh-loading-message">Bilgiler yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="hh-table-container">
      <button
        className="hh-add-new-btn"
        onClick={() => setShowAddModal(true)}
      >
        + Yeni Hasta Ekle
      </button>

      <table className="hh-hasta-table">
        <thead>
          <tr>
            <th onClick={() => handleSort("hasta_TC")}>
              TC No {renderSortIcon("hasta_TC")}
            </th>
            <th onClick={() => handleSort("isim")}>
              Ad {renderSortIcon("isim")}
            </th>
            <th onClick={() => handleSort("soyisim")}>
              Soyad {renderSortIcon("soyisim")}
            </th>
            <th onClick={() => handleSort("dogumTarihi")}>
              Doğum Tarihi {renderSortIcon("dogumTarihi")}
            </th>
            <th onClick={() => handleSort("cinsiyet")}>
              Cinsiyet {renderSortIcon("cinsiyet")}
            </th>
            <th onClick={() => handleSort("anneAdi")}>
              Anne Adı {renderSortIcon("anneAdi")}
            </th>
            <th onClick={() => handleSort("babaAdi")}>
              Baba Adı {renderSortIcon("babaAdi")}
            </th>
            <th onClick={() => handleSort("saglikGecmisi")}>
              Sağlık Geçmişi {renderSortIcon("saglikGecmisi")}
            </th>
            <th onClick={() => handleSort("dogumYeri")}>
              Doğum Yeri {renderSortIcon("dogumYeri")}
            </th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {patients.length > 0 ? (
            patients.map((patient) => (
              <tr key={patient.hasta_TC}>
                <td>{patient.hasta_TC}</td>
                <td>{patient.isim}</td>
                <td>{patient.soyisim}</td>
                <td>{new Date(patient.dogumTarihi).toLocaleDateString()}</td>
                <td>{patient.cinsiyet ? "Kadın" : "Erkek"}</td>
                <td>{patient.anneAdi}</td>
                <td>{patient.babaAdi}</td>
                <td>{patient.saglikGecmisi}</td>
                <td>{patient.dogumYeri}</td>
                <td className="hh-actions">
                  <button
                    className="hh-edit-btn"
                    onClick={() => handleEditClick(patient)}
                  >
                    Düzenle
                  </button>
                  <button
                    className="hh-contact-btn"
                    onClick={() => handleContactClick(patient)}
                  >
                    İletişim
                  </button>
                  <button
                    className="hh-address-btn"
                    onClick={() => handleAddressClick(patient)}
                  >
                    Adres
                  </button>
                  <button
                    className="hh-delete-btn"
                    onClick={() => handleDeleteClick(patient)}
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10">Hasta verileri yükleniyor...</td>
            </tr>
          )}
        </tbody>
      </table>

      {showDeleteModal && (
        <div className="hh-modal-overlay">
          <div className="hh-confirmation-modal">
            <div className="hh-modal-header">
              <h3>Silme Onayı</h3>
              <button
                className="hh-close-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                ×
              </button>
            </div>
            <div className="hh-modal-content">
              <p>
                {selectedPatient?.isim} {selectedPatient?.soyisim} isimli hastayı
                silmek istediğinize emin misiniz?
              </p>
              <div className="hh-modal-actions">
                <button className="hh-confirm-btn" onClick={confirmDelete}>
                  Evet
                </button>
                <button
                  className="hh-cancel-btn"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Hayır
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="hh-modal-overlay">
          <div className="hh-modal">
            <div className="hh-modal-header">
              <h2>Yeni Hasta Ekle</h2>
              <button
                className="hh-close-btn"
                onClick={() => {
                  setShowAddModal(false);
                  setNewPatient({
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
                    sifreOnay: "",
                    roles: ["Hasta"],
                    ulke: "",
                    mahalle: "",
                    caddeSokak: "",
                    disKapiNo: "",
                    icKapiNo: "",
                    il_ID: 0,
                    ilce_ID: 0,
                    telNo: "",
                    telNo2: "",
                    email: "",
                  });
                  setSelectedIl("");
                  setSelectedIlce("");
                  setFormErrors({});
                  setPasswordError("");
                }}
              >
                ×
              </button>
            </div>
            <form className="hh-modal-content" onSubmit={handleSaveNewPatient}>
              <div className="hh-form-columns">
                <div className="hh-form-column">
                  <div className="hh-form-group">
                    <label>TC Kimlik No</label>
                    <input
                      type="text"
                      name="hasta_TC"
                      placeholder="TC Kimlik numarası"
                      value={newPatient.hasta_TC}
                      onChange={handleNewPatientChange}
                      className={formErrors.hasta_TC ? "hh-input-error" : ""}
                    />
                    {formErrors.hasta_TC && (
                      <div className="hh-error-message">{formErrors.hasta_TC}</div>
                    )}
                  </div>
                  <div className="hh-form-group">
                    <label>Ad</label>
                    <input
                      type="text"
                      name="isim"
                      placeholder="Hasta adı"
                      value={newPatient.isim}
                      onChange={handleNewPatientChange}
                      className={formErrors.isim ? "hh-input-error" : ""}
                    />
                    {formErrors.isim && (
                      <div className="hh-error-message">{formErrors.isim}</div>
                    )}
                  </div>
                  <div className="hh-form-group">
                    <label>Soyad</label>
                    <input
                      type="text"
                      name="soyisim"
                      placeholder="Hasta soyadı"
                      value={newPatient.soyisim}
                      onChange={handleNewPatientChange}
                      className={formErrors.soyisim ? "hh-input-error" : ""}
                    />
                    {formErrors.soyisim && (
                      <div className="hh-error-message">{formErrors.soyisim}</div>
                    )}
                  </div>
                  <div className="hh-form-group">
                    <label>Doğum Tarihi</label>
                    <input
                      type="date"
                      name="dogumTarihi"
                      value={newPatient.dogumTarihi}
                      onChange={handleNewPatientChange}
                      className={formErrors.dogumTarihi ? "hh-input-error" : ""}
                    />
                    {formErrors.dogumTarihi && (
                      <div className="hh-error-message">{formErrors.dogumTarihi}</div>
                    )}
                  </div>
                  <div className="hh-form-group">
                    <label>Cinsiyet</label>
                    <div className="hh-radio-group">
                      <label>
                        <input
                          type="radio"
                          name="cinsiyet"
                          value="true"
                          checked={newPatient.cinsiyet === true}
                          onChange={handleNewPatientChange}
                        />
                        Kadın
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="cinsiyet"
                          value="false"
                          checked={newPatient.cinsiyet === false}
                          onChange={handleNewPatientChange}
                        />
                        Erkek
                      </label>
                    </div>
                  </div>
                  <div className="hh-form-group">
                    <label>Şifre</label>
                    <input
                      type="password"
                      name="sifre"
                      value={newPatient.sifre}
                      onChange={handleNewPatientChange}
                      className={formErrors.sifre ? "hh-input-error" : ""}
                    />
                    {formErrors.sifre && (
                      <div className="hh-error-message">{formErrors.sifre}</div>
                    )}
                  </div>
                  <div className="hh-form-group">
                    <label>Şifre Tekrar</label>
                    <input
                      type="password"
                      name="sifreOnay"
                      value={newPatient.sifreOnay}
                      onChange={handleNewPatientChange}
                      className={formErrors.sifreOnay ? "hh-input-error" : ""}
                    />
                    {formErrors.sifreOnay && (
                      <div className="hh-error-message">{formErrors.sifreOnay}</div>
                    )}
                    {passwordError && !formErrors.sifreOnay && (
                      <div className="hh-error-message">{passwordError}</div>
                    )}
                  </div>
                </div>
                <div className="hh-form-column">
                  <div className="hh-form-group">
                    <label>Aile Bilgileri</label>
                    <input
                      type="text"
                      name="anneAdi"
                      placeholder="Anne Adı"
                      value={newPatient.anneAdi}
                      onChange={handleNewPatientChange}
                    />
                    <input
                      type="text"
                      name="babaAdi"
                      placeholder="Baba Adı"
                      value={newPatient.babaAdi}
                      onChange={handleNewPatientChange}
                    />
                  </div>
                  <div className="hh-form-group">
                    <label>Sağlık Bilgileri</label>
                    <textarea
                      name="saglikGecmisi"
                      placeholder="Sağlık Geçmişi"
                      value={newPatient.saglikGecmisi}
                      onChange={handleNewPatientChange}
                      rows="3"
                    />
                    <input
                      type="text"
                      name="dogumYeri"
                      placeholder="Doğum Yeri"
                      value={newPatient.dogumYeri}
                      onChange={handleNewPatientChange}
                    />
                  </div>
                  <div className="hh-form-group">
                    <label>İletişim Bilgileri</label>
                    <input
                      type="text"
                      name="telNo"
                      placeholder="Telefon"
                      value={newPatient.telNo}
                      onChange={handleNewPatientChange}
                    />
                    <input
                      type="text"
                      name="telNo2"
                      placeholder="Diğer Telefon"
                      value={newPatient.telNo2}
                      onChange={handleNewPatientChange}
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={newPatient.email}
                      onChange={handleNewPatientChange}
                    />
                  </div>
                  <div className="hh-form-group">
                    <label>Adres Bilgileri</label>
                    <input
                      type="text"
                      name="ulke"
                      placeholder="Ülke"
                      value={newPatient.ulke}
                      onChange={handleNewPatientChange}
                    />
                    <div className="hh-form-group">
                      <label>İl</label>
                      <select
                        name="il_ID"
                        value={selectedIl}
                        onChange={handleIlChange}
                      >
                        <option value="">İl Seçiniz</option>
                        {provinces.map((province) => (
                          <option key={province.ilId} value={province.ilId}>
                            {province.ilAdi}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="hh-form-group">
                      <label>İlçe</label>
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
                    <input
                      type="text"
                      name="mahalle"
                      placeholder="Mahalle"
                      value={newPatient.mahalle}
                      onChange={handleNewPatientChange}
                    />
                    <input
                      type="text"
                      name="caddeSokak"
                      placeholder="Cadde/Sokak"
                      value={newPatient.caddeSokak}
                      onChange={handleNewPatientChange}
                    />
                    <div className="hh-input-group">
                      <input
                        type="text"
                        name="disKapiNo"
                        placeholder="Dış Kapı No"
                        value={newPatient.disKapiNo}
                        onChange={handleNewPatientChange}
                      />
                      <input
                        type="text"
                        name="icKapiNo"
                        placeholder="İç Kapı No"
                        value={newPatient.icKapiNo}
                        onChange={handleNewPatientChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="hh-modal-actions">
                <button type="submit" className="hh-confirm-btn">
                  Kaydet
                </button>
                <button
                  type="button"
                  className="hh-cancel-btn"
                  onClick={() => setShowAddModal(false)}
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && (
        <EditModal
          patient={selectedPatient}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleUpdatePatient}
        />
      )}

      {showAddressModal && (
        <AddressModal
          tc={selectedPatient.hasta_TC}
          provinces={provinces}
          onClose={() => setShowAddressModal(false)}
          onUpdate={handleUpdateAddress}
        />
      )}

      {showContactModal && (
        <ContactModal
          tc={selectedPatient.hasta_TC}
          onClose={() => setShowContactModal(false)}
          onUpdate={handleUpdateContact}
        />
      )}
    </div>
  );
};

export default HastaHome;