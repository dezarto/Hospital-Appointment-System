import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Lazy yükleme ile bileşenleri import et
const Doktor = lazy(() => import('../Doktor/Doktor'));

const HastaRoutes = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <Routes>
      <Route path="/profile" element={<Doktor />} />
    </Routes>
  </Suspense>
);

export default HastaRoutes;
