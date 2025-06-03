import React, { useState, useEffect } from 'react';
import { FaBars, FaTimes, FaSignInAlt, FaUserPlus, FaChevronDown, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import './Navbar.css';
import logo from "../../assets/medical-logo.png";
import { getAllHastane } from '../../api/api-hasta';
import { getUserRole, getUserId } from '../../api/auth';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hastaneler, setHastaneler] = useState([]);
  const [selectedHastane, setSelectedHastane] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);

  const navigate = useNavigate();
  const { hastaneId } = useParams();
  const location = useLocation();

  useEffect(() => {
    const role = getUserRole(); // Kullanıcının rolünü al
    const id = getUserId(); // Kullanıcının ID'sini al

    if (role) {
      setIsAuthenticated(true);
      setUserId(id);
      setUserRole(role); // Rolü state olarak tut
    } else {
      setIsAuthenticated(false);
    }

    const loadHastaneler = async () => {
      try {
        const data = await getAllHastane();
        setHastaneler(data);

        const numericHastaneId = Number(hastaneId);
        const foundHastane = data.find(h => h.id === numericHastaneId);

        if (foundHastane) {
          setSelectedHastane(foundHastane);
        } else if (location.pathname === "/" && data.length > 0) {
          setSelectedHastane(data[0]);
          navigate(`/${data[0].id}`, { replace: true });
        }
      } catch (error) {
        console.error('Hastane verileri alınamadı:', error);
      }
    };

    loadHastaneler();
  }, [hastaneId, location.pathname, navigate]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleSelectHastane = (id) => {
    const selected = hastaneler.find(h => h.id === id);
    if (selected) {
      setSelectedHastane(selected);
      navigate(`/${id}`);
    }
    setIsDropdownOpen(false);
    setIsMenuOpen(false);
  };

  // Kullanıcının rolüne göre yönlendirme yapılacak URL
  const getProfileLink = () => {
    if (userRole === "Doktor") {
      return `/doktor/profile`;
    } else if (userRole === "Admin") {
      return `/admin/home`;
    } else {
      return `/hasta/profile`;
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    setIsAuthenticated(false);
    navigate('/giris');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="Hastane Logosu" />
        </Link>

        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <div className="nav-links">
            <Link to={`/${hastaneId}`} className="nav-link">Ana Sayfa</Link>
            <Link to={`/${hastaneId}/about-us`} className="nav-link">Hakkımızda</Link>
            <Link to={`/${hastaneId}/communication`} className="nav-link">İletişim</Link>
          </div>

          <div className="nav-buttons">
            <div className="dropdown-container">
              <button className="dropdown-toggle" onClick={toggleDropdown}>
                <span className="selected-hospital">
                  {selectedHastane ? selectedHastane.hastaneAdi : "Hastane Seçiniz"}
                </span>
                <FaChevronDown className={`chevron ${isDropdownOpen ? 'open' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="dropdown-menu">
                  {hastaneler.map(hastane => (
                    <div
                      key={hastane.id}
                      className={`dropdown-item ${hastane.id === selectedHastane?.id ? 'selected' : ''}`}
                      onClick={() => handleSelectHastane(hastane.id)}
                    >
                      {hastane.hastaneAdi}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Link to="/hasta/randevu-al" className="nav-button randevu-btn">Randevu Al</Link>

            {/* Kullanıcı giriş yaptıysa Profil butonu göster, yapmadıysa Giriş ve Kayıt butonlarını göster */}
            {isAuthenticated ? (
              <>
                <Link to={getProfileLink()} className="nav-button profile-btn">
                  <FaUser /> Profilim
                </Link>
                <button onClick={handleLogout} className="nav-button logout-btn">
                  <FaSignOutAlt /> Çıkış Yap
                </button>
              </>
            ) : (
              <>
                <Link to="/giris" className="nav-button login-btn">
                  <FaSignInAlt /> Giriş Yap
                </Link>
                <Link to="/hasta/register" className="nav-button register-btn">
                  <FaUserPlus /> Kayıt Ol
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="menu-icon" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
