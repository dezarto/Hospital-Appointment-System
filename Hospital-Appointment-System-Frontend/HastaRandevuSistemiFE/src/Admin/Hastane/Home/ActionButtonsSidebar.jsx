import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EditModal from './EditModal';
import ContactModal from './ContactModal';
import AddressModal from './AddressModal';
import AboutModal from './AboutModal';
import './ActionButtonsSidebar.css';

const ActionButtonsSidebar = ({ hospitalId, hospitalName, noHospitalMessage, actions, onHospitalUpdate }) => {
    const navigate = useNavigate();
    const [showEditModal, setShowEditModal] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [showAboutModal, setShowAboutModal] = useState(false);

    const defaultActions = [
        { label: 'Hastaneler', className: 'sidebar-btn doktorlar-btn', action: () => navigate(`/admin/hastaneler`) },
        { label: 'Düzenle', className: 'sidebar-btn edit-btn', action: () => setShowEditModal(true) },
        { label: 'İletişim', className: 'sidebar-btn contact-btn', action: () => setShowContactModal(true) },
        { label: 'Adres', className: 'sidebar-btn address-btn', action: () => setShowAddressModal(true) },
        { label: 'Hakkımda', className: 'sidebar-btn about-btn', action: () => setShowAboutModal(true) },
        { label: 'Haberler', className: 'sidebar-btn news-btn', action: () => navigate(`/admin/hastaneler/haberler/${hospitalId}`) },
        { label: 'Duyurular', className: 'sidebar-btn announcement-btn', action: () => navigate(`/admin/hastaneler/duyurular/${hospitalId}`) },
        { label: 'Etkinlikler', className: 'sidebar-btn event-btn', action: () => navigate(`/admin/hastaneler/etkinlikler/${hospitalId}`) },
        { label: 'Sliderler', className: 'sidebar-btn slider-btn', action: () => navigate(`/admin/hastaneler/sliderler/${hospitalId}`) },
        { label: 'Bölümler', className: 'sidebar-btn bolumler-btn', action: () => navigate(`/admin/hastaneler/bolumler/${hospitalId}`) },
        { label: 'Hastane Doktorları', className: 'sidebar-btn doktorlar-btn', action: () => navigate(`/admin/hastaneler/doktorlar/${hospitalId}`) },
        { label: 'Randevular', className: 'sidebar-btn randevular-btn', action: () => navigate(`/admin/hastaneler/randevular/${hospitalId}`) },
    ];

    const buttons = actions || defaultActions;

    return (
        <div className="action-buttons-sidebar">
            {hospitalId ? (
                <>
                    <h3 className="action-buttons-sidebar-title">{hospitalName || 'Hastane'}</h3>
                    <div className="action-buttons-sidebar-menu">
                        {buttons.map((btn, index) => (
                            <button
                                key={index}
                                className={`action-buttons-sidebar-action-btn ${btn.className}`}
                                onClick={btn.action}
                            >
                                {btn.label}
                            </button>
                        ))}
                    </div>
                </>
            ) : (
                <p className="action-buttons-sidebar-no-hospital">{noHospitalMessage || 'Lütfen bir hastane seçiniz'}</p>
            )}

            {showEditModal && (
                <EditModal
                    hospitalId={hospitalId}
                    onClose={() => setShowEditModal(false)}
                    onSave={() => {
                        setShowEditModal(false);
                        if (onHospitalUpdate) onHospitalUpdate();
                    }}
                />
            )}

            {showContactModal && (
                <ContactModal
                    hospitalId={hospitalId}
                    onClose={() => setShowContactModal(false)}
                />
            )}

            {showAddressModal && (
                <AddressModal
                    hospitalId={hospitalId}
                    onClose={() => setShowAddressModal(false)}
                />
            )}

            {showAboutModal && (
                <AboutModal
                    hospitalId={hospitalId}
                    onClose={() => setShowAboutModal(false)}
                />
            )}
        </div>
    );
};

export default ActionButtonsSidebar;