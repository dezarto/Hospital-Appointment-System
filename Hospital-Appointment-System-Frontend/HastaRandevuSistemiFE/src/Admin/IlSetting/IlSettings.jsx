import React, { useEffect, useState } from 'react';
import {
    getIller,
    addIl,
    deleteIlById,
    updateIlById,
    addIlce,
    updateIlceById,
    deleteIlceById
} from '../../api/api-admin';
import './IlSettings.css';
import LoadingAnimation from '../../components/LoadingAnimation/LoadingAnimation';

const IlSettings = () => {
    const [iller, setIller] = useState([]);
    const [selectedIl, setSelectedIl] = useState(null);
    const [selectedIlce, setSelectedIlce] = useState(null);
    const [showIlModal, setShowIlModal] = useState(false);
    const [showIlceModal, setShowIlceModal] = useState(false);
    const [showDeleteIlModal, setShowDeleteIlModal] = useState(false);
    const [showDeleteIlceModal, setShowDeleteIlceModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isEditingIl, setIsEditingIl] = useState(false);
    const [isEditingIlce, setIsEditingIlce] = useState(false);
    const [newIl, setNewIl] = useState({ ilAdi: '' });
    const [newIlce, setNewIlce] = useState({ ilceAdi: '' });
    const [ilError, setIlError] = useState(''); // Added for input validation

    useEffect(() => {
        const fetchIller = async () => {
            try {
                const response = await getIller();
                setIller(response.data);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                if (error.response?.status === 401) {
                    sessionStorage.removeItem('token');
                    navigate('/giris');
                } else {
                    console.error('Veri yüklenirken hata:', error);
                }
            }
        };
        fetchIller();
    }, []);

    // İl İşlemleri
    const handleIlEdit = (il) => {
        setNewIl(il);
        setIsEditingIl(true);
        setShowIlModal(true);
        setIlError('');
    };

    const handleIlDelete = (il) => {
        setSelectedIl(il);
        setShowDeleteIlModal(true);
    };

    const confirmIlDelete = async () => {
        try {
            await deleteIlById(selectedIl.ilId);
            setIller(prev => prev.filter(i => i.ilId !== selectedIl.ilId));
            setShowDeleteIlModal(false);
        } catch (error) {
            console.error('Silme hatası:', error);
        }
    };

    const handleIlSave = async () => {
        if (!newIl.ilAdi.trim()) {
            setIlError('İl adı boş olamaz');
            return;
        }
        try {
            if (isEditingIl) {
                await updateIlById(newIl.ilId, newIl.ilAdi);
            } else {
                await addIl(newIl.ilAdi);
            }
            const updatedData = await getIller();
            setIller(updatedData.data);
            setShowIlModal(false);
            resetIlForm();
        } catch (error) {
            console.error('Kaydetme hatası:', error);
            setIlError('Kaydetme sırasında hata oluştu');
        }
    };

    // İlçe İşlemleri
    const handleIlceAdd = (il) => {
        setSelectedIl(il);
        setShowIlceModal(true);
    };

    const handleIlceEdit = (ilce) => {
        setSelectedIlce(ilce);
        setNewIlce({ ilceAdi: ilce.ilceAdi });
        setIsEditingIlce(true);
        setShowIlceModal(true);
    };

    const handleIlceDelete = (ilce) => {
        setSelectedIlce(ilce);
        setShowDeleteIlceModal(true);
    };

    const confirmIlceDelete = async () => {
        try {
            await deleteIlceById(selectedIlce.id);
            setIller(prev => prev.map(il => ({
                ...il,
                ilceBilgisi: il.ilceBilgisi.filter(ic => ic.id !== selectedIlce.id)
            })));
            setShowDeleteIlceModal(false);
        } catch (error) {
            console.error('Silme hatası:', error);
        }
    };

    const handleIlceSave = async () => {
        try {
            if (isEditingIlce) {
                await updateIlceById(selectedIlce.id, newIlce.ilceAdi);
            } else {
                await addIlce(selectedIl.ilId, newIlce.ilceAdi);
            }
            const updatedData = await getIller();
            setIller(updatedData.data);
            setShowIlceModal(false);
            resetIlceForm();
        } catch (error) {
            console.error('Kaydetme hatası:', error);
        }
    };

    // Form Yönetimi
    const resetIlForm = () => {
        setNewIl({ ilAdi: '' });
        setIsEditingIl(false);
        setIlError('');
    };

    const resetIlceForm = () => {
        setNewIlce({ ilceAdi: '' });
        setIsEditingIlce(false);
        setSelectedIl(null);
        setSelectedIlce(null);
    };

    if (loading) {
        return (
            <div className="checking">
                <LoadingAnimation />
                <p className="loading-message">Yükleniyor...</p>
            </div>
        );
    }

    return (
        <div className="il-settings-container">
            <button className="il-add-button" onClick={() => setShowIlModal(true)}>
                + Yeni İl Ekle
            </button>

            <table className="il-settings-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>İl Adı</th>
                        <th>İşlemler</th>
                    </tr>
                </thead>
                <tbody>
                    {iller.map((il) => (
                        <React.Fragment key={il.ilId}>
                            <tr>
                                <td>{il.ilId}</td>
                                <td>{il.ilAdi}</td>
                                <td className="actions">
                                    <button className="edit-button" onClick={() => handleIlEdit(il)}>
                                        Düzenle
                                    </button>
                                    <button className="delete-button" onClick={() => handleIlDelete(il)}>
                                        Sil
                                    </button>
                                    <button className="add-button" onClick={() => handleIlceAdd(il)}>
                                        + İlçe Ekle
                                    </button>
                                </td>
                            </tr>
                            {il.ilceBilgisi.map((ilce) => (
                                <tr key={ilce.id} className="ilce-row">
                                    <td></td>
                                    <td>├─ {ilce.ilceAdi}</td>
                                    <td className="actions">
                                        <button className="edit-button" onClick={() => handleIlceEdit(ilce)}>
                                            Düzenle
                                        </button>
                                        <button className="delete-button" onClick={() => handleIlceDelete(ilce)}>
                                            Sil
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>

            {/* İl Modal */}
            {showIlModal && (
                <div className="il-modal-overlay">
                    <div className="il-modal">
                        <h2>{isEditingIl ? 'İl Düzenle' : 'Yeni İl Ekle'}</h2>
                        <div className="il-form-group">
                            <input
                                type="text"
                                value={newIl.ilAdi}
                                onChange={(e) => {
                                    setNewIl({ ...newIl, ilAdi: e.target.value });
                                    setIlError(''); // Clear error on input change
                                }}
                                placeholder="İl adı giriniz"
                                className={ilError ? 'input-error' : ''}
                            />
                            {ilError && <p className="error-message">{ilError}</p>}
                        </div>
                        <div className="modal-actions">
                            <button onClick={handleIlSave}>{isEditingIl ? 'Güncelle' : 'Kaydet'}</button>
                            <button onClick={() => { setShowIlModal(false); resetIlForm(); }}>İptal</button>
                        </div>
                    </div>
                </div>
            )}

            {/* İlçe Modal */}
            {showIlceModal && (
                <div className="il-modal-overlay">
                    <div className="il-modal">
                        <h2>{isEditingIlce ? 'İlçe Düzenle' : 'Yeni İlçe Ekle'}</h2>
                        <div className="il-form-group">
                            <input
                                type="text"
                                value={newIlce.ilceAdi}
                                onChange={(e) => setNewIlce({ ...newIlce, ilceAdi: e.target.value })}
                                placeholder="İlçe adı giriniz"
                            />
                        </div>
                        <div className="modal-actions">
                            <button onClick={handleIlceSave}>{isEditingIlce ? 'Güncelle' : 'Kaydet'}</button>
                            <button onClick={() => { setShowIlceModal(false); resetIlceForm(); }}>İptal</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Silme Onay Modalı */}
            {showDeleteIlModal && (
                <div className="il-modal-overlay">
                    <div className="il-confirmation-modal">
                        <p>{selectedIl?.ilAdi} ilini silmek istediğinize emin misiniz?</p>
                        <div className="modal-actions">
                            <button onClick={confirmIlDelete}>Evet</button>
                            <button onClick={() => setShowDeleteIlModal(false)}>Hayır</button>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteIlceModal && (
                <div className="il-modal-overlay">
                    <div className="il-confirmation-modal">
                        <p>{selectedIlce?.ilceAdi} ilçesini silmek istediğinize emin misiniz?</p>
                        <div className="modal-actions">
                            <button onClick={confirmIlceDelete}>Evet</button>
                            <button onClick={() => setShowDeleteIlceModal(false)}>Hayır</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IlSettings;