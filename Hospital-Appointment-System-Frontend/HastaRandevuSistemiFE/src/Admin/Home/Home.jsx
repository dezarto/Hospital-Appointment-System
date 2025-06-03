import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const AdminHome = () => {
    const navigate = useNavigate();

    return (
        <div className="admin-home-container">
            <div className="admin-home-button-container">
                <button
                    className="admin-home-action-btn"
                    onClick={() => navigate('/admin/hastaneler')}
                >
                    Hastaneler
                </button>
                <button
                    className="admin-home-action-btn"
                    onClick={() => navigate('/admin/hastalar')}
                >
                    Hastalar
                </button>
                <button
                    className="admin-home-action-btn"
                    onClick={() => navigate('/admin/il-settings')}
                >
                    İl Ayarları
                </button>
            </div>
        </div>
    );
};

export default AdminHome;