import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

const HomeHastane = lazy(() => import('../Admin/Hastane/Home/HomeHastane'));
const Duyuru = lazy(() => import('../Admin/Hastane/Duyurular/Duyuru'));
const Haber = lazy(() => import('../Admin/Hastane/Haberler/Haber'));
const Etkinlik = lazy(() => import('../Admin/Hastane/Etkinlikler/Etkinlik'));
const Slider = lazy(() => import('../Admin/Hastane/Sliderler/Sliderlar'));
const Bolum = lazy(() => import('../Admin/Hastane/Bolumler/Bolumler'));
const Poliklinik = lazy(() => import('../Admin/Hastane/Bolumler/Poliklinikler/Poliklinikler'));
const PoliklinikDoktorlar = lazy(() => import('../Admin/Hastane/Bolumler/Poliklinikler/Doktorlar/PoliklinikDoktorlar'));
const TumDoktorlar = lazy(() => import('../Admin/Hastane/Doktorlar/TumDoktorlar'));
const Randevu = lazy(() => import('../Admin/Hastane/Randevu/Randevu'));
const Mesai = lazy(() => import('../Admin/Hastane/Doktorlar/Mesai'));
const HomeHasta = lazy(() => import('../Admin/Hasta/HastaHome'));
const Home = lazy(() => import('../Admin/Home/Home'));
const IlSetting = lazy(() => import('../Admin/IlSetting/IlSettings'));

const HastaRoutes = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/hastalar" element={<HomeHasta />} />
      <Route path="/hastaneler" element={<HomeHastane />} />
      <Route path="hastaneler/duyurular/:hastaneId" element={<Duyuru />} />
      <Route path="hastaneler/haberler/:hastaneId" element={<Haber />} />
      <Route path="hastaneler/etkinlikler/:hastaneId" element={<Etkinlik />} />
      <Route path="hastaneler/sliderler/:hastaneId" element={<Slider />} />
      <Route path="hastaneler/doktorlar/:hastaneId" element={<TumDoktorlar />} />
      <Route path="hastaneler/doktorlar/:hastaneId/mesailer/:doktorTC" element={<Mesai />} />
      <Route path="hastaneler/randevular/:hastaneId" element={<Randevu />} />
      <Route path="hastaneler/bolumler/:hastaneId" element={<Bolum />} />
      <Route path="hastaneler/bolumler/:hastaneId/poliklinikler/:bolumID" element={<Poliklinik />} />
      <Route path="hastaneler/bolumler/:hastaneId/poliklinikler/:bolumID/doktorlar/:poliklinikID" element={<PoliklinikDoktorlar />} />
      <Route path="/il-settings" element={<IlSetting />} />
    </Routes>
  </Suspense>
);

export default HastaRoutes;
