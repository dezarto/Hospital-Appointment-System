import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faUser } from '@fortawesome/free-solid-svg-icons';
import LoadingAnimation from '../../components/LoadingAnimation/LoadingAnimation';
import logo from '../../assets/medical-logo.png';
import { login } from '../../api/api-hasta';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [tc, setTc] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isDoctor, setIsDoctor] = useState(false); // Hasta ve doktor arasında geçiş yapabilmek için state
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            setLoading(true);
            const response = await login({ tc, password, role: isDoctor ? 'Doktor' : 'Hasta' }); // Role ekledik
            sessionStorage.setItem('token', response.token);
            setLoading(false);
            navigate('/');
        } catch (error) {
            setError(error.response?.data?.message || 'Giriş bilgileri hatalı');
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setError(''); // Hatalı mesajı temizler
        }, 3000);

        return () => clearTimeout(timer);
    }, [error]);

    const togglePasswordVisibility = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setShowPassword(!showPassword);
    };

    const handleRoleToggle = () => {
        setIsDoctor(!isDoctor); // Doctor rolü ile hasta rolü arasında geçiş yap
    };

    if (loading) {
        return (
            <div className="checking">
                <div className="loading-alert-wrapper">
                    <LoadingAnimation />
                </div>
                <p className="loading-message">Bilgiler kontrol ediliyor...</p>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="card-top">
                <div className="card">
                    <div className="card2">
                        <form className="form" onSubmit={handleSubmit}>
                            <div className="logo-container">
                                <img src={logo} alt="Logo" className="logo" />
                            </div>
                            <h2>Giriş Yap</h2>
                            {error && <div className="error">{error}</div>}
                            <div className="field">
                                <FontAwesomeIcon icon={faUser} className="input-icon" />
                                <input
                                    type="text"
                                    id="hasta_tc"
                                    value={tc}
                                    className="input-field"
                                    placeholder="TC kimlik numarası"
                                    autoComplete="off"
                                    onChange={(e) => setTc(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="field">
                                <span
                                    className={`password-toggle-icon ${showPassword ? 'active' : ''}`}
                                    onClick={togglePasswordVisibility}
                                >
                                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                </span>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="input-field"
                                    autoComplete="new-password"
                                    placeholder="Şifreniz"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Styled Toggle Switch */}
                            <div className="role-toggle">
                                <label className="role-label">Giriş Tipi</label>
                                <div className="toggle-switch">
                                    <input
                                        type="checkbox"
                                        id="role-toggle"
                                        checked={isDoctor}
                                        onChange={handleRoleToggle}
                                    />
                                    <label htmlFor="role-toggle" className="toggle-label">
                                        <span className="toggle-text hasta">Hasta</span>
                                        <span className="toggle-text doktor">Doktor</span>
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>
                            </div>

                            <div className="btn">
                                <button type="submit" className="button1">
                                    Giriş
                                </button>
                                <button
                                    type="button"
                                    className="button1"
                                    onClick={() => navigate('/hasta/register')}
                                >
                                    Kayıt Ol
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;