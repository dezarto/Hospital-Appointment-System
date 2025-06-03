import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaTimes, FaCheck } from "react-icons/fa";
import { getRandevuAra, postRandevuOnayla } from '../../api/api-hasta';
import "./RandevuAra.css";
import LoadingAnimation from '../../components/LoadingAnimation/LoadingAnimation';
import { getUserId } from '../../api/auth';

const RandevuAra = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [selectedIl, setSelectedIl] = useState("");
  const [selectedIlce, setSelectedIlce] = useState("");
  const [selectedHastane, setSelectedHastane] = useState("");
  const [selectedBolum, setSelectedBolum] = useState("");
  const [selectedDoktor, setSelectedDoktor] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [selectedMesai, setSelectedMesai] = useState(null);
  const hastaTC = getUserId();
  const [formData, setFormData] = useState({
    baslangic: "",
    bitis: ""
  });
  const formatTime = (timeString) => {
    return timeString?.split(':').slice(0, 2).join(':') || '';
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await getRandevuAra();
      setData(response);
    };
    fetchData();
  }, []);

  // Filtreleme fonksiyonları
  const filteredIlceler = (data?.iller ?? [])
    .filter((il) => il.ilAdi === selectedIl)
    .flatMap((il) => il.ilceler ?? []);

  const filteredHastaneler = filteredIlceler
    .filter((ilce) => ilce.ilceAdi === selectedIlce)
    .flatMap((ilce) => ilce.hastaneler ?? []);

  const filteredBolumler = filteredHastaneler
    .filter((hastane) => hastane.hastaneAdi === selectedHastane)
    .flatMap((hastane) => hastane.bolumler ?? []);

  const filteredDoktorlar = filteredHastaneler
    .filter((hastane) => hastane.hastaneAdi === selectedHastane)
    .flatMap((hastane) => hastane.poliklinikler ?? [])
    .filter((poliklinik) => poliklinik.poliklinikAdi === selectedBolum)
    .flatMap((poliklinik) => poliklinik.doktorlar ?? []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTemizle = () => {
    setSelectedIl("");
    setSelectedIlce("");
    setSelectedHastane("");
    setSelectedBolum("");
    setSelectedDoktor("");
    setFormData({ baslangic: "", bitis: "" });
    setShowPopup(false);
    setSelectedMesai(null);
  };

  const handleRandevuAra = (e) => {
    e.preventDefault();
    if (selectedDoktor) {
      setShowPopup(true);
    }
  };

  const handleOnayla = async () => {
    try {
      const secilenHastane = filteredHastaneler.find(
        h => h.hastaneAdi === selectedHastane
      );

      const secilenPoliklinik = filteredHastaneler
        .flatMap(h => h.poliklinikler)
        .find(p => p.poliklinikAdi === selectedBolum);

      const tarihObj = new Date(selectedMesai.tarih);
      tarihObj.setMinutes(tarihObj.getMinutes() - tarihObj.getTimezoneOffset());

      const randevuData = {
        Hasta_TC: hastaTC,
        Doktor_TC: selectedDoktor,
        PoliklinikID: secilenPoliklinik?.poliklinikID,
        Tarih: tarihObj.toISOString().split("T")[0],
        BaslangicZamani: selectedMesai.baslangicSaati,
        BitisZamani: selectedMesai.bitisSaati,
        MesaiID: selectedMesai.mesaiID
      };

      console.log(randevuData);
      const response = await postRandevuOnayla(randevuData);

      if (response.status === 200) {
        alert('Randevu başarıyla oluşturuldu!');
        handleTemizle();
      } else {
        alert('Randevu oluşturulamadı: ' + response.message);
      }
      navigate(`/hasta/randevu-al`);
    } catch (error) {
      if (error.response?.status === 401) {
        sessionStorage.removeItem('token');
        navigate('/giris');
      } else {
        alert('Randevu oluşturulurken hata oluştu: ' + error.message);
        console.error("Randevu oluşturulurken bir hata oluştu:", error);
      }
    } finally {
      setShowPopup(false);
      setSelectedMesai(null);
    }
  };

  const secilenDoktor = filteredDoktorlar.find(d => d.doktor_TC === selectedDoktor);

  if (!data) {
    return (
      <div className="rda-checking">
        <div className="rda-loading-alert-wrapper">
          <LoadingAnimation />
        </div>
        <p className="rda-loading-message">Randevular yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="rda-randevu-container">
      <form className="rda-form-section" onSubmit={handleRandevuAra}>
        <div className="rda-input-group">
          <label htmlFor="il-select">İl</label>
          <select
            id="il-select"
            value={selectedIl}
            onChange={(e) => {
              setSelectedIl(e.target.value);
              setSelectedIlce("");
              setSelectedHastane("");
              setSelectedBolum("");
              setSelectedDoktor("");
            }}
          >
            <option value="">İl Seçiniz</option>
            {data.iller.map((il) => (
              <option key={il.id} value={il.ilAdi}>
                {il.ilAdi}
              </option>
            ))}
          </select>
        </div>

        {selectedIl && (
          <div className="rda-input-group">
            <label htmlFor="ilce-select">İlçe</label>
            <select
              id="ilce-select"
              value={selectedIlce}
              onChange={(e) => {
                setSelectedIlce(e.target.value);
                setSelectedHastane("");
                setSelectedBolum("");
                setSelectedDoktor("");
              }}
            >
              <option value="">İlçe Seçiniz</option>
              {filteredIlceler.map((ilce) => (
                <option key={ilce.id} value={ilce.ilceAdi}>
                  {ilce.ilceAdi}
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedIlce && (
          <div className="rda-input-group">
            <label htmlFor="hastane-select">Hastane</label>
            <select
              id="hastane-select"
              value={selectedHastane}
              onChange={(e) => {
                setSelectedHastane(e.target.value);
                setSelectedBolum("");
                setSelectedDoktor("");
              }}
            >
              <option value="">Hastane Seçiniz</option>
              {filteredHastaneler.map((hastane) => (
                <option key={hastane.hastaneID} value={hastane.hastaneAdi}>
                  {hastane.hastaneAdi}
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedHastane && (
          <div className="rda-input-group">
            <label htmlFor="bolum-select">Klinik</label>
            <select
              id="bolum-select"
              value={selectedBolum}
              onChange={(e) => {
                setSelectedBolum(e.target.value);
                setSelectedDoktor("");
              }}
            >
              <option value="">Klinik Seçiniz</option>
              {filteredBolumler.map((bolum) => (
                <option key={bolum.bolumID} value={bolum.bolumAdi}>
                  {bolum.bolumAdi}
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedBolum && (
          <div className="rda-input-group">
            <label htmlFor="doktor-select">Hekim</label>
            <select
              id="doktor-select"
              value={selectedDoktor}
              onChange={(e) => setSelectedDoktor(e.target.value)}
            >
              <option value="">Hekim Seçiniz</option>
              {filteredDoktorlar.map((doktor) => (
                <option key={doktor.doktor_TC} value={doktor.doktor_TC}>
                  {doktor.isim} {doktor.soyisim}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="rda-button-group">
          <button type="submit" className="rda-btn rda-search-btn">
            <FaSearch className="rda-icon" />
            <span>Randevu Ara</span>
          </button>
          <button type="button" className="rda-btn rda-clear-btn" onClick={handleTemizle}>
            <FaTimes className="rda-icon" />
            <span>Temizle</span>
          </button>
        </div>
      </form>

      {showPopup && (
        <div className="rda-popup-overlay">
          <div className="rda-randevu-popup">
            <div className="rda-popup-header">
              <h3>Müsait Zaman Seçin</h3>
              <FaTimes
                className="rda-close-icon"
                onClick={() => setShowPopup(false)}
              />
            </div>

            <div className="rda-mesai-listesi">
              {secilenDoktor?.doktorMesai?.map((mesai) => (
                <div
                  key={mesai.mesaiID}
                  className={`rda-mesai-item ${selectedMesai?.mesaiID === mesai.mesaiID ? 'rda-selected' : ''}`}
                  onClick={() => setSelectedMesai(mesai)}
                >
                  <span className="rda-tarih">
                    {new Date(mesai.tarih).toLocaleDateString("tr-TR")}
                  </span>
                  <span className="rda-saat">
                    {formatTime(mesai.baslangicSaati)} - {formatTime(mesai.bitisSaati)}
                  </span>
                </div>
              ))}
            </div>

            {selectedMesai && (
              <button className="rda-onayla-btn" onClick={handleOnayla}>
                <FaCheck className="rda-icon" />
                <span>Randevuyu Onayla</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RandevuAra;