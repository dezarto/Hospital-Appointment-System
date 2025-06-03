import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Lazy yükleme ile bileşenleri import et
const Register = lazy(() => import('../Hasta/Register/Register'));
const Randevu = lazy(() => import('../Hasta/Randevu/Randevu'));
const RandevuAra = lazy(() => import('../Hasta/Randevu/RandevuAra'));
const Profile = lazy(() => import('../Hasta/Profile/Profile'));

const HastaRoutes = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/randevu-al" element={<Randevu />} />
      <Route path="/randevu-ara" element={<RandevuAra />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  </Suspense>
);

export default HastaRoutes;
