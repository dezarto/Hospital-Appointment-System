import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Hasta/Login/Login';
import Communication from './Hastane/Communication/Communication';
import Home from './Hastane/Home/Home';
import AboutUs from './Hastane/AboutUs/AboutUs';
import Duyurular from './Hastane/Duyurular/Duyurular';
import Haberler from './Hastane/Haberler/Haberler';
import Etkinlikler from './Hastane/Etkinlikler/Etkinlikler';
import NotFound from './components/NotFound/NotFound';
import HastaRoutes from './routes/HastaRoutes';
import AdminRoutes from './routes/AdminRoutes';
import DoktorRoutes from './routes/DoktorRoutes';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import { Outlet } from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Ana hastane rotaları */}
        <Route path="/:hastaneId" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="communication" element={<Communication />} />
          <Route path="about-us" element={<AboutUs />} />
          <Route path="duyurular" element={<Duyurular />} />
          <Route path="haberler" element={<Haberler />} />
          <Route path="etkinlikler" element={<Etkinlikler />} />
        </Route>

        {/* Diğer rotalar */}
        <Route path="/giris" element={<Login />} />
        <Route path="/hasta/*" element={<HastaRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/doktor/*" element={<DoktorRoutes />} />

        {/* Ana sayfa yönlendirmesi */}
        <Route path="/" element={<Navigate to="/1" replace />} />
        {/* <Route path="/default" element={<DefaultHospitalRedirect />} /> */}

        {/* 404 Sayfası */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

// Layout bileşeni Navbar ve Footer ile içerik yerleştirecek
const Layout = () => {
  return (
    <>
      <Navbar />
      <div>
        <Outlet />  {/* Burada içerik render edilecek */}
      </div>
      <Footer />
    </>
  );
};

// DefaultHospitalRedirect.jsx
const DefaultHospitalRedirect = () => {
  const { hastaneler } = useHastaneler(); // Özel hook veya context
  useEffect(() => {
    if (hastaneler.length > 0) {
      navigate(`/${hastaneler[0].id}`, { replace: true });
    }
  }, [hastaneler]);

  return <LoadingSpinner />;
};

export default App;
