import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faUser, faLock, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { register, getIlveIlceDatas } from '../../api/api-hasta';

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState(''); // Added confirmPassword state

    // State for province and district data
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);

    const [hasta_TC, setHasta_TC] = useState('');
    const [dogumTarihi, setDogumTarihi] = useState('');
    const [isim, setIsim] = useState('');
    const [soyisim, setSoyisim] = useState('');
    const [anneAdi, setAnneAdi] = useState('');
    const [babaAdi, setBabaAdi] = useState('');
    const [saglikGecmisi, setSaglikGecmisi] = useState('');
    const [dogumYeri, setDogumYeri] = useState('');
    const [cinsiyet, setCinsiyet] = useState('');
    const [sifre, setSifre] = useState('');
    const [roles, setRoles] = useState(['']); // Assuming an array of roles
    const [ulke, setUlke] = useState('');
    const [mahalle, setMahalle] = useState('');
    const [caddeSokak, setCaddeSokak] = useState('');
    const [disKapiNo, setDisKapiNo] = useState('');
    const [icKapiNo, setIcKapiNo] = useState('');
    const [il_ID, setIl_ID] = useState(0);
    const [ilce_ID, setIlce_ID] = useState(0);
    const [telNo, setTelNo] = useState('');
    const [telNo2, setTelNo2] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Fetch province and district data on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getIlveIlceDatas();
                setProvinces(response);
            } catch (err) {
                setError('İl ve ilçe bilgileri yüklenemedi');
            }
        };
        fetchData();
    }, []);

    // Update districts when province changes
    useEffect(() => {
        if (il_ID) {
            const selectedProvince = provinces.find(prov => prov.ilId === parseInt(il_ID));
            setDistricts(selectedProvince ? selectedProvince.ilceBilgisi : []);
            setIlce_ID(''); // Reset district selection when province changes
        } else {
            setDistricts([]);
            setIlce_ID('');
        }
    }, [il_ID, provinces]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validate password match
        if (sifre !== confirmPassword) {
            setError('Şifreler uyuşmuyor');
            return;
        }

        if (!il_ID || !ilce_ID) {
            setError('Lütfen il ve ilçe seçiniz');
            return;
        }

        const userData = {
            hasta_TC,
            dogumTarihi,
            isim,
            soyisim,
            anneAdi,
            babaAdi,
            saglikGecmisi,
            dogumYeri,
            cinsiyet: Boolean(cinsiyet),
            sifre,
            roles: ["Hasta"],
            ulke,
            mahalle,
            caddeSokak,
            disKapiNo,
            icKapiNo,
            il_ID: parseInt(il_ID),
            ilce_ID: parseInt(ilce_ID),
            telNo,
            telNo2,
            email,
        };

        try {
            const response = await register(userData);
            navigate('/');
        } catch (error) {
            setError(error.response?.data?.message || 'Kayıt işlemi başarısız');
        }
    };

    const togglePasswordVisibility = (type) => {
        if (type === 'password') {
            setShowPassword(!showPassword);
        } else if (type === 'confirmPassword') {
            setShowPasswordConfirm(!showPasswordConfirm);
        }
    };

    return (
        <div className="container">
            <div className="card-top">
                <div className="card">
                    <div className="card2">
                        <form className="form" onSubmit={handleSubmit}>
                            {/* Üst kısım: Sol ve Sağ Kolon */}
                            <h2>KAYIT EKRANI</h2>
                            <div className="form-top">

                                {/* Sol Kolon: Kişisel Bilgiler */}
                                <div className="left-column">
                                    <h2>Kişisel Bilgiler</h2>
                                    <div className="double-field">
                                        <div className="field">
                                            <FontAwesomeIcon icon={faUser} className="input-icon" />
                                            <input
                                                type="text"
                                                className="input-field"
                                                placeholder="İsim"
                                                value={isim}
                                                onChange={(e) => setIsim(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="field">
                                            <FontAwesomeIcon icon={faUser} className="input-icon" />
                                            <input
                                                type="text"
                                                className="input-field"
                                                placeholder="Soyisim"
                                                value={soyisim}
                                                onChange={(e) => setSoyisim(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="field">
                                        <input
                                            type="text"
                                            className="input-field"
                                            placeholder="TC Kimlik"
                                            value={hasta_TC}
                                            onChange={(e) => setHasta_TC(e.target.value)}
                                            required
                                            maxLength={11}
                                        />
                                    </div>
                                    <div className="double-field">
                                        <div className="field">
                                            <input
                                                type="text"
                                                className="input-field"
                                                placeholder="Doğum Yeri"
                                                value={dogumYeri}
                                                onChange={(e) => setDogumYeri(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="field">
                                            <input
                                                type="date"
                                                className="input-field"
                                                placeholder="Doğum Tarihi"
                                                value={dogumTarihi}
                                                onChange={(e) => setDogumTarihi(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="double-field">
                                        <div className="field">
                                            <input
                                                type="text"
                                                className="input-field"
                                                placeholder="Anne Adı"
                                                value={anneAdi}
                                                onChange={(e) => setAnneAdi(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="field">
                                            <input
                                                type="text"
                                                className="input-field"
                                                placeholder="Baba Adı"
                                                value={babaAdi}
                                                onChange={(e) => setBabaAdi(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="field">
                                        <input
                                            type="text"
                                            className="input-field"
                                            placeholder="Sağlık Geçmişi"
                                            value={saglikGecmisi}
                                            onChange={(e) => setSaglikGecmisi(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Sağ Kolon: Adres Bilgileri */}
                                <div className="right-column">
                                    <h2>Adres Bilgileri</h2>
                                    <div className="double-field">
                                        <div className="field">
                                            <input
                                                type="text"
                                                className="input-field"
                                                placeholder="Ülke"
                                                value={ulke}
                                                onChange={(e) => setUlke(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="field">
                                            <select
                                                className="input-field custom-select"
                                                value={il_ID}
                                                onChange={(e) => setIl_ID(e.target.value)}
                                                required
                                                style={{ color: "rgb(90,82,82)", backgroundColor: "#85aad3", border: "none" }}
                                            >
                                                <option value="">İl Seçiniz</option>
                                                {provinces.map(province => (
                                                    <option
                                                        key={province.ilId}
                                                        value={province.ilId}
                                                        style={{ color: "black" }}
                                                    >
                                                        {province.ilAdi}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="double-field">
                                        <div className="field">
                                            <select
                                                className="input-field custom-select"
                                                value={ilce_ID}
                                                onChange={(e) => setIlce_ID(e.target.value)}
                                                required
                                                disabled={!il_ID}
                                                style={{ color: "rgb(90,82,82)", backgroundColor: "#85aad3", border: "none", outline: "none", appearance: "none" }}
                                            >
                                                <option value="">İlçe Seçiniz</option>
                                                {districts.map(district => (
                                                    <option
                                                        key={district.id}
                                                        value={district.id}
                                                        style={{ color: "black" }}
                                                    >
                                                        {district.ilceAdi}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="field">
                                            <input
                                                type="text"
                                                className="input-field"
                                                placeholder="Mahalle"
                                                value={mahalle}
                                                onChange={(e) => setMahalle(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="field">
                                        <input
                                            type="text"
                                            className="input-field"
                                            placeholder="Cadde/Sokak"
                                            value={caddeSokak}
                                            onChange={(e) => setCaddeSokak(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="double-field">
                                        <div className="field">
                                            <input
                                                type="text"
                                                className="input-field"
                                                placeholder="Dış Kapı"
                                                value={disKapiNo}
                                                onChange={(e) => setDisKapiNo(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="field">
                                            <input
                                                type="text"
                                                className="input-field"
                                                placeholder="İç Kapı"
                                                value={icKapiNo}
                                                onChange={(e) => setIcKapiNo(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="field">
                                        <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                                        <input
                                            type="email"
                                            className="input-field"
                                            placeholder="E-mail"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Alt kısım: E-mail, Cinsiyet, Telefon, Şifre Alanları ve Kayıt Butonu */}
                            <div className="form-bottom">
                                <div className="field">
                                    <select
                                        className="input-field custom-select"
                                        value={cinsiyet}
                                        onChange={(e) => setCinsiyet(e.target.value === 'true')}
                                        required
                                        style={{
                                            color: "rgb(90,82,82)",
                                            backgroundColor: "#85aad3",
                                            border: "none",
                                            outline: "none",
                                            appearance: "none"
                                        }}
                                    >
                                        <option value="" style={{ color: "black" }}>Cinsiyet</option>
                                        <option value="false" style={{ color: "black" }}>Erkek</option>
                                        <option value="true" style={{ color: "black" }}>Kadın</option>
                                    </select>
                                </div>

                                {/* Telefon numaraları yan yana */}
                                <div className="phone-fields">
                                    <div className="field">
                                        <FontAwesomeIcon icon={faPhone} className="input-icon" />
                                        <input
                                            type="text"
                                            className="input-field"
                                            placeholder="Telefon Numarası"
                                            value={telNo}
                                            onChange={(e) => setTelNo(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="field">
                                        <FontAwesomeIcon icon={faPhone} className="input-icon" />
                                        <input
                                            type="text"
                                            className="input-field"
                                            placeholder="Telefon Numarası 2"
                                            value={telNo2}
                                            onChange={(e) => setTelNo2(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="field">
                                    <FontAwesomeIcon
                                        icon={showPassword ? faEyeSlash : faEye}
                                        className="input-icon-eye"
                                        onClick={() => togglePasswordVisibility('password')}
                                    />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        className="input-field"
                                        placeholder="Şifre"
                                        value={sifre}
                                        onChange={(e) => setSifre(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="field">
                                    <FontAwesomeIcon
                                        icon={showPasswordConfirm ? faEyeSlash : faEye} // Changed to use showPasswordConfirm
                                        className="input-icon-eye"
                                        onClick={() => togglePasswordVisibility('confirmPassword')} // Changed to use correct type
                                    />
                                    <input
                                        type={showPasswordConfirm ? 'text' : 'password'}
                                        className="input-field"
                                        placeholder="Şifreyi Tekrar Girin"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                {error && <p className="error-message">{error}</p>}
                                <button type="submit" className="register-btn">Kayıt Ol</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
