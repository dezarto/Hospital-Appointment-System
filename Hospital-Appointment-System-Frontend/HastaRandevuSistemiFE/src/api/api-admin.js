import axios from 'axios';

const API_URL = 'https://localhost:7004/api';

const getHeaders = () => ({
    headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json',
    },
});

// ### Hastane İşlemleri
export const hastaneler = async () => {
    try {
        const response = await axios.get(`${API_URL}/Admin/get-all-hastane`, getHeaders());
        return response;
    } catch (error) {
        console.error("Hastane listesi alınırken bir hata oluştu: " + error.message);
        throw error;
    }
};

export const addHastane = async (updatedData) => {
    try {
        await axios.post(`${API_URL}/Admin/add-new-hastane/`, updatedData, getHeaders());
        return true;
    } catch (error) {
        console.error("Yeni hastane eklenirken bir hata oluştu: " + error.message);
        return false;
    }
};

export const deleteHastane = async (hastaneId) => {
    try {
        await axios.delete(`${API_URL}/Admin/delete-hastane/${hastaneId}`, getHeaders());
        return true;
    } catch (error) {
        console.error(`Hastane silinirken bir hata oluştu (ID: ${hastaneId}): ` + error.message);
        return false;
    }
};

export const getHastaneById = async (hastaneId) => {
    try {
        const response = await axios.get(`${API_URL}/Admin/get-hastane-by-id/${hastaneId}`, getHeaders());
        return response;
    } catch (error) {
        console.error(`Belirtilen ID ile hastane getirilirken bir hata oluştu (ID: ${hastaneId}): ` + error.message);
        throw error;
    }
};

export const updateHastane = async (hastaneId, updatedData) => {
    try {
        await axios.put(`${API_URL}/Admin/update-hastane/${hastaneId}`, updatedData, getHeaders());
        return true;
    } catch (error) {
        console.error(`Hastane bilgileri güncellenirken bir hata oluştu (ID: ${hastaneId}): ` + error.message);
        return false;
    }
};

export const getCommunicationInfoByHastaneId = async (hastaneId) => {
    try {
        const response = await axios.get(`${API_URL}/Admin/get-communication-info-by-hastane-id/${hastaneId}`, getHeaders());
        return response;
    } catch (error) {
        console.error(`Hastane iletişim bilgileri getirilirken bir hata oluştu (ID: ${hastaneId}): ` + error.message);
        throw error;
    }
};

export const updateCommunicationInfoByHastaneId = async (hastaneId, updatedData) => {
    try {
        await axios.put(`${API_URL}/Admin/put-update-communication-info-by-hastane-id/${hastaneId}`, updatedData, getHeaders());
        return true;
    } catch (error) {
        console.error(`Hastane iletişim bilgileri güncellenirken bir hata oluştu (ID: ${hastaneId}): ` + error.message);
        return false;
    }
};

export const getAboutUsByHastaneId = async (hastaneId) => {
    try {
        const response = await axios.get(`${API_URL}/Admin/get-about-us-by-hastane-name/${hastaneId}`, getHeaders());
        return response;
    } catch (error) {
        console.error(`Hastane hakkında bilgi getirilirken bir hata oluştu (ID: ${hastaneId}): ` + error.message);
        throw error;
    }
};

export const updateAboutUsByHastaneId = async (hastaneId, updatedData) => {
    try {
        await axios.put(`${API_URL}/Admin/update-about-us-by-hastane-id/${hastaneId}`, updatedData, getHeaders());
        return true;
    } catch (error) {
        console.error(`Hastane hakkında bilgi güncellenirken bir hata oluştu (ID: ${hastaneId}): ` + error.message);
        return false;
    }
};

export const getAddressByHastaneId = async (hastaneId) => {
    try {
        const response = await axios.get(`${API_URL}/Admin/get-address-by-hastane-id/${hastaneId}`, getHeaders());
        return response;
    } catch (error) {
        console.error(`Hastane adresi getirilirken bir hata oluştu (ID: ${hastaneId}): ` + error.message);
        throw error;
    }
};

export const updateAddressByHastaneId = async (hastaneId, updatedData) => {
    try {
        const response = await axios.put(`${API_URL}/Admin/update-address-by-hastane-id/${hastaneId}`, updatedData, getHeaders());
        return response.data;
    } catch (error) {
        console.error(`Hastane adresi güncellenirken bir hata oluştu (ID: ${hastaneId}): ` + error.message);
        throw error;
    }
};

// ### Hasta İşlemleri
export const hastalar = async () => {
    try {
        const response = await axios.get(`${API_URL}/Admin/get-all-hasta`, getHeaders());
        return response;
    } catch (error) {
        console.error("Hasta listesi alınırken bir hata oluştu: " + error.message);
        throw error;
    }
};

export const addHasta = async (updatedData) => {
    try {
        await axios.post(`${API_URL}/Admin/add-new-hasta`, updatedData, getHeaders());
        return true;
    } catch (error) {
        console.error("Yeni hasta eklenirken bir hata oluştu: " + error.message);
        return false;
    }
};

export const deleteHasta = async (hastaTC) => {
    try {
        await axios.delete(`${API_URL}/Admin/delete-hasta-by-tc-number/${hastaTC}`, getHeaders());
        return true;
    } catch (error) {
        console.error(`Hasta silinirken bir hata oluştu (TC: ${hastaTC}): ` + error.message);
        return false;
    }
};

export const getHastaByTC = async (hastaTC) => {
    try {
        const response = await axios.get(`${API_URL}/Admin/get-hasta-by-tc-number/${hastaTC}`, getHeaders());
        return response;
    } catch (error) {
        console.error(`Belirtilen TC ile hasta bilgileri getirilirken bir hata oluştu (TC: ${hastaTC}): ` + error.message);
        throw error;
    }
};

export const updateHasta = async (hastaTC, updatedData) => {
    try {
        await axios.put(`${API_URL}/Admin/update-hasta-information-by-hasta-tc-number/${hastaTC}`, updatedData, getHeaders());
        return true;
    } catch (error) {
        console.error(`Hasta bilgileri güncellenirken bir hata oluştu (TC: ${hastaTC}): ` + error.message);
        return false;
    }
};

export const getCommunicationInfoByHastaTC = async (hastaTC) => {
    try {
        const response = await axios.get(`${API_URL}/Admin/get-communication-information-by-hasta-tc-number/${hastaTC}`, getHeaders());
        return response;
    } catch (error) {
        console.error(`Hasta iletişim bilgileri getirilirken bir hata oluştu (TC: ${hastaTC}): ` + error.message);
        throw error;
    }
};

export const updateCommunicationInfoByHastaTC = async (hastaTC, updatedData) => {
    try {
        await axios.put(`${API_URL}/Admin/update-communication-information-by-hasta-tc-number/${hastaTC}`, updatedData, getHeaders());
        return true;
    } catch (error) {
        console.error(`Hasta iletişim bilgileri güncellenirken bir hata oluştu (TC: ${hastaTC}): ` + error.message);
        return false;
    }
};

export const getAddressByHastaTC = async (hastaTC) => {
    try {
        const response = await axios.get(`${API_URL}/Admin/get-address-information-by-hasta-tc-number/${hastaTC}`, getHeaders());
        return response;
    } catch (error) {
        console.error(`Hasta adresi getirilirken bir hata oluştu (TC: ${hastaTC}): ` + error.message);
        throw error;
    }
};

export const updateAddressByHastaTC = async (hastaTC, updatedData) => {
    try {
        const response = await axios.put(`${API_URL}/Admin/update-address-information-by-hasta-tc-number/${hastaTC}`, updatedData, getHeaders());
        return response.data;
    } catch (error) {
        console.error(`Hasta adresi güncellenirken bir hata oluştu (TC: ${hastaTC}): ` + error.message);
        throw error;
    }
};

// ### Duyuru İşlemleri
export const getDuyurularByHastaneID = async (hastaneId) => {
    try {
        const response = await axios.get(`${API_URL}/Admin/get-all-duyuru-by-hastane-id/${hastaneId}`, getHeaders());
        return response;
    } catch (error) {
        console.error(`Hastane duyuruları getirilirken bir hata oluştu (ID: ${hastaneId}): ` + error.message);
        throw error;
    }
};

export const getDuyuruByHastaneIDAndDuyuruID = async (hastaneId, duyuruId) => {
    try {
        const response = await axios.get(`${API_URL}/Admin/get-duyuru-by-id/${hastaneId}/${duyuruId}`, getHeaders());
        return response.data;
    } catch (error) {
        console.error(`Belirtilen hastane ve duyuru ID ile duyuru getirilirken bir hata oluştu (Hastane ID: ${hastaneId}, Duyuru ID: ${duyuruId}): ` + error.message);
        throw error;
    }
};

export const addDuyuruByHastaneID = async (hastaneId, data) => {
    try {
        const response = await axios.post(`${API_URL}/Admin/add-duyuru/${hastaneId}`, data, getHeaders());
        return response.data;
    } catch (error) {
        console.error(`Hastaneye yeni duyuru eklenirken bir hata oluştu (ID: ${hastaneId}): ` + error.message);
        throw error;
    }
};

export const deleteDuyuruByHastaneIDAndDuyuruID = async (hastaneId, duyuruId) => {
    try {
        const response = await axios.delete(`${API_URL}/Admin/delete-duyuru/${hastaneId}/${duyuruId}`, getHeaders());
        return response.data;
    } catch (error) {
        console.error(`Hastaneye ait duyuru silinirken bir hata oluştu (Hastane ID: ${hastaneId}, Duyuru ID: ${duyuruId}): ` + error.message);
        throw error;
    }
};

export const updateDuyuruByHastaneID = async (hastaneId, duyuruId, data) => {
    try {
        const response = await axios.put(`${API_URL}/Admin/update-duyuru/${hastaneId}/${duyuruId}`, data, getHeaders());
        return response.data;
    } catch (error) {
        console.error(`Hastaneye ait duyuru güncellenirken bir hata oluştu (Hastane ID: ${hastaneId}, Duyuru ID: ${duyuruId}): ` + error.message);
        throw error;
    }
};

// ### Haber İşlemleri
export const getHaberlerByHastaneID = async (hastaneId) => {
    try {
        const response = await axios.get(`${API_URL}/Admin/get-all-haber-by-hastane-id/${hastaneId}`, getHeaders());
        return response;
    } catch (error) {
        console.error(`Hastane haberleri getirilirken bir hata oluştu (ID: ${hastaneId}): ` + error.message);
        throw error;
    }
};

export const getHaberByHastaneIDAndHaberID = async (hastaneId, haberId) => {
    try {
        const response = await axios.get(`${API_URL}/Admin/get-haber-by-id/${hastaneId}/${haberId}`, getHeaders());
        return response.data;
    } catch (error) {
        console.error(`Belirtilen hastane ve haber ID ile haber getirilirken bir hata oluştu (Hastane ID: ${hastaneId}, Haber ID: ${haberId}): ` + error.message);
        throw error;
    }
};

export const addHaberByHastaneID = async (hastaneId, data) => {
    try {
        const response = await axios.post(`${API_URL}/Admin/add-haber/${hastaneId}`, data, getHeaders());
        return response.data;
    } catch (error) {
        console.error(`Hastaneye yeni haber eklenirken bir hata oluştu (ID: ${hastaneId}): ` + error.message);
        throw error;
    }
};

export const deleteHaberByHastaneIDAndHaberID = async (hastaneId, haberId) => {
    try {
        const response = await axios.delete(`${API_URL}/Admin/delete-haber/${hastaneId}/${haberId}`, getHeaders());
        return response.data;
    } catch (error) {
        console.error(`Hastaneye ait haber silinirken bir hata oluştu (Hastane ID: ${hastaneId}, Haber ID: ${haberId}): ` + error.message);
        throw error;
    }
};

export const updateHaberByHastaneID = async (hastaneId, haberId, data) => {
    try {
        const response = await axios.put(`${API_URL}/Admin/update-haber/${hastaneId}/${haberId}`, data, getHeaders());
        return response.data;
    } catch (error) {
        console.error(`Hastaneye ait haber güncellenirken bir hata oluştu (Hastane ID: ${hastaneId}, Haber ID: ${haberId}): ` + error.message);
        throw error;
    }
};

// ### Etkinlik İşlemleri
export const getEtkinliklerByHastaneID = async (hastaneId) => {
    try {
        const response = await axios.get(`${API_URL}/Admin/get-all-etkinlik-by-hastane-id/${hastaneId}`, getHeaders());
        return response;
    } catch (error) {
        console.error(`Hastane etkinlikleri getirilirken bir hata oluştu (ID: ${hastaneId}): ` + error.message);
        throw error;
    }
};

export const getEtkinlikByHastaneIDAndEtkinlikID = async (hastaneId, etkinlikId) => {
    try {
        const response = await axios.get(`${API_URL}/Admin/get-etkinlik-by-id/${hastaneId}/${etkinlikId}`, getHeaders());
        return response.data;
    } catch (error) {
        console.error(`Belirtilen hastane ve etkinlik ID ile etkinlik getirilirken bir hata oluştu (Hastane ID: ${hastaneId}, Etkinlik ID: ${etkinlikId}): ` + error.message);
        throw error;
    }
};

export const addEtkinlikByHastaneID = async (hastaneId, data) => {
    try {
        const response = await axios.post(`${API_URL}/Admin/add-etkinlik/${hastaneId}`, data, getHeaders());
        return response.data;
    } catch (error) {
        console.error(`Hastaneye yeni etkinlik eklenirken bir hata oluştu (ID: ${hastaneId}): ` + error.message);
        throw error;
    }
};

export const deleteEtkinlikByHastaneIDAndEtkinlikID = async (hastaneId, etkinlikId) => {
    try {
        const response = await axios.delete(`${API_URL}/Admin/delete-etkinlik/${hastaneId}/${etkinlikId}`, getHeaders());
        return response.data;
    } catch (error) {
        console.error(`Hastaneye ait etkinlik silinirken bir hata oluştu (Hastane ID: ${hastaneId}, Etkinlik ID: ${etkinlikId}): ` + error.message);
        throw error;
    }
};

export const updateEtkinlikByHastaneID = async (hastaneId, etkinlikId, data) => {
    try {
        const response = await axios.put(`${API_URL}/Admin/update-etkinlik/${hastaneId}/${etkinlikId}`, data, getHeaders());
        return response.data;
    } catch (error) {
        console.error(`Hastaneye ait etkinlik güncellenirken bir hata oluştu (Hastane ID: ${hastaneId}, Etkinlik ID: ${etkinlikId}): ` + error.message);
        throw error;
    }
};

// ### Slider İşlemleri
export const getSliderlerByHastaneID = async (hastaneId) => {
    try {
        const response = await axios.get(`${API_URL}/Admin/get-all-slider-by-hastane-id/${hastaneId}`, getHeaders());
        return response;
    } catch (error) {
        console.error(`Hastane sliderları getirilirken bir hata oluştu (ID: ${hastaneId}): ` + error.message);
        throw error;
    }
};

export const getSliderByHastaneIDAndSliderID = async (hastaneId, sliderId) => {
    try {
        const response = await axios.get(`${API_URL}/Admin/get-slider-by-id/${hastaneId}/${sliderId}`, getHeaders());
        return response.data;
    } catch (error) {
        console.error(`Belirtilen hastane ve slider ID ile slider getirilirken bir hata oluştu (Hastane ID: ${hastaneId}, Slider ID: ${sliderId}): ` + error.message);
        throw error;
    }
};

export const addSliderByHastaneID = async (hastaneId, data) => {
    try {
        const response = await axios.post(`${API_URL}/Admin/add-slider/${hastaneId}`, data, getHeaders());
        return response.data;
    } catch (error) {
        console.error(`Hastaneye yeni slider eklenirken bir hata oluştu (ID: ${hastaneId}): ` + error.message);
        throw error;
    }
};

export const deleteSliderByHastaneIDAndSliderID = async (hastaneId, sliderId) => {
    try {
        const response = await axios.delete(`${API_URL}/Admin/delete-slider/${hastaneId}/${sliderId}`, getHeaders());
        return response.data;
    } catch (error) {
        console.error(`Hastaneye ait slider silinirken bir hata oluştu (Hastane ID: ${hastaneId}, Slider ID: ${sliderId}): ` + error.message);
        throw error;
    }
};

export const updateSliderByHastaneID = async (hastaneId, sliderId, data) => {
    try {
        const response = await axios.put(`${API_URL}/Admin/update-slider/${hastaneId}/${sliderId}`, data, getHeaders());
        return response.data;
    } catch (error) {
        console.error(`Hastaneye ait slider güncellenirken bir hata oluştu (Hastane ID: ${hastaneId}, Slider ID: ${sliderId}): ` + error.message);
        throw error;
    }
};

// ### Bölüm İşlemleri
export const getBolumlerByHastaneID = async (hastaneId) => {
    try {
        const response = await axios.get(`${API_URL}/Admin/bolumler/${hastaneId}`, getHeaders());
        return response;
    } catch (error) {
        console.error(`Hastane bölümleri getirilirken bir hata oluştu (ID: ${hastaneId}): ` + error.message);
        throw error;
    }
};

export const addBolumByHastaneID = async (data, hastaneId) => {
    try {
        const response = await axios.post(`${API_URL}/Admin/add-bolum/${hastaneId}`, data, getHeaders());
        return response.data;
    } catch (error) {
        console.error(`Hastaneye yeni bölüm eklenirken bir hata oluştu (ID: ${hastaneId}): ` + error.message);
        throw error;
    }
};

export const deleteBolumByHastaneIDAndBolumID = async (hastaneId, bolumId) => {
    try {
        const response = await axios.delete(`${API_URL}/Admin/delete-bolum/${hastaneId}/${bolumId}`, getHeaders());
        return response.data;
    } catch (error) {
        console.error(`Hastaneye ait bölüm silinirken bir hata oluştu (Hastane ID: ${hastaneId}, Bölüm ID: ${bolumId}): ` + error.message);
        throw error;
    }
};

export const updateBolumByHastaneID = async (newBolum, hastaneId, bolumId) => {
    try {
        const response = await axios.put(`${API_URL}/Admin/update-bolum/${hastaneId}/${bolumId}`, newBolum, getHeaders());
        return response.data;
    } catch (error) {
        console.error(`Hastaneye ait bölüm güncellenirken bir hata oluştu (Hastane ID: ${hastaneId}, Bölüm ID: ${bolumId}): ` + error.message);
        throw error;
    }
};

// ### Poliklinik İşlemleri
export const getPolikliniklerByHastaneAndBolumID = async (hastaneId, bolumId) => {
    try {
        const response = await axios.get(`${API_URL}/Admin/poliklinikler/${hastaneId}/${bolumId}`, getHeaders());
        return response;
    } catch (error) {
        console.error(`Hastane poliklinikleri getirilirken bir hata oluştu (Hastane ID: ${hastaneId}, Bölüm ID: ${bolumId}): ` + error.message);
        throw error;
    }
};

export const addPoliklinikByHastaneID = async (data, hastaneId, bolumId) => {
    try {
        const response = await axios.post(`${API_URL}/Admin/add-poliklinik/${hastaneId}/${bolumId}`, data, getHeaders());
        return response.data;
    } catch (error) {
        console.error(`Hastaneye yeni poliklinik eklenirken bir hata oluştu (Hastane ID: ${hastaneId}, Bölüm ID: ${bolumId}): ` + error.message);
        throw error;
    }
};

export const deletePoliklinikByHastaneIDAndPoliklinikID = async (hastaneId, poliklinikId, bolumId) => {
    try {
        const response = await axios.delete(`${API_URL}/Admin/delete-poliklinik/${hastaneId}/${poliklinikId}/${bolumId}`, getHeaders());
        return response.data;
    } catch (error) {
        console.error(`Hastaneye ait poliklinik silinirken bir hata oluştu (Hastane ID: ${hastaneId}, Poliklinik ID: ${poliklinikId}): ` + error.message);
        throw error;
    }
};

export const updatePoliklinikByHastaneID = async (newBolum, hastaneId, poliklinikId) => {
    try {
        const response = await axios.put(`${API_URL}/Admin/update-poliklinik/${hastaneId}/${poliklinikId}`, newBolum, getHeaders());
        return response.data;
    } catch (error) {
        console.error(`Hastaneye ait poliklinik güncellenirken bir hata oluştu (Hastane ID: ${hastaneId}, Poliklinik ID: ${poliklinikId}): ` + error.message);
        throw error;
    }
};

// ### Doktor İşlemleri
export const getDoktorlarByHastaneID = async (hastaneId) => {
    try {
        const response = await axios.get(`${API_URL}/Admin/doktorlar/${hastaneId}`, getHeaders());
        return response;
    } catch (error) {
        console.error(`Hastane doktorları getirilirken bir hata oluştu (ID: ${hastaneId}): ` + error.message);
        throw error;
    }
};

export const getDoktorlarByPoliklinikID = async (poliklinikId) => {
    try {
        const response = await axios.get(`${API_URL}/Admin/poliklinik-doktorlar/${poliklinikId}`, getHeaders());
        return response;
    } catch (error) {
        console.error(`Poliklinik doktorları getirilirken bir hata oluştu (Poliklinik ID: ${poliklinikId}): ` + error.message);
        throw error;
    }
};

export const addDoktorByPoliklinikID = async (data, hastaneId, poliklinikId) => {
    try {
        const response = await axios.post(`${API_URL}/Admin/add-doktor/${hastaneId}/${poliklinikId}`, data, getHeaders());
        return response.data;
    } catch (error) {
        console.error(`Hastaneye yeni doktor eklenirken bir hata oluştu (Hastane ID: ${hastaneId}, Poliklinik ID: ${poliklinikId}): ` + error.message);
        throw error;
    }
};

export const deleteDoktorByPoliklinikID = async (doktorTC) => {
    try {
        const response = await axios.delete(`${API_URL}/Admin/delete-doktor/${doktorTC}`, getHeaders());
        return response.data;
    } catch (error) {
        console.error(`Doktor silinirken bir hata oluştu (TC: ${doktorTC}): ` + error.message);
        throw error;
    }
};

export const updateDoktorByPoliklinikID = async (data, doktorTC) => {
    try {
        const response = await axios.put(`${API_URL}/Admin/update-doktor/${doktorTC}`, data, getHeaders());
        return response.data;
    } catch (error) {
        console.error(`Doktor bilgileri güncellenirken bir hata oluştu (TC: ${doktorTC}): ` + error.message);
        throw error;
    }
};

// ### Randevu İşlemleri
export const getTumRandevular = async (hastaneId) => {
    try {
        const response = await axios.get(`${API_URL}/Admin/randevular/${hastaneId}`, getHeaders());
        return response;
    } catch (error) {
        console.error(`Hastane randevuları getirilirken bir hata oluştu (ID: ${hastaneId}): ` + error.message);
        throw error;
    }
};

export const deleteRandevu = async (randevuId) => {
    try {
        const response = await axios.delete(`${API_URL}/Admin/delete-randevu/${randevuId}`, getHeaders());
        return response.data;
    } catch (error) {
        console.error(`Randevu silinirken bir hata oluştu (Randevu ID: ${randevuId}): ` + error.message);
        throw error;
    }
};

// ### Mesai İşlemleri
export const getMesailerByDoktorTC = async (hastaneId, doktorTC) => {
    try {
        const response = await axios.get(`${API_URL}/Admin/get-mesailer-by-doktor-tc/${hastaneId}/${doktorTC}`, getHeaders());
        return response;
    } catch (error) {
        console.error(`Doktor mesaileri getirilirken bir hata oluştu (Hastane ID: ${hastaneId}, Doktor TC: ${doktorTC}): ` + error.message);
        throw error;
    }
};

export const addDoktorMesai = async (doktorTC, data) => {
    try {
        const response = await axios.post(`${API_URL}/Admin/add-doktor/${doktorTC}/mesai`, data, getHeaders());
        return response.data;
    } catch (error) {
        console.error(`Doktor mesaisi eklenirken bir hata oluştu (Doktor TC: ${doktorTC}): ` + error.message);
        throw error;
    }
};

export const deleteAllMesaiByDoktor = async (hastaneId, doktorTC) => {
    try {
        const response = await axios.delete(`${API_URL}/Admin/delete-all-mesai-by-doktor/${hastaneId}/${doktorTC}/mesai`, getHeaders());
        return response.data;
    } catch (error) {
        console.error(`Doktorun tüm mesaileri silinirken bir hata oluştu (Hastane ID: ${hastaneId}, Doktor TC: ${doktorTC}): ` + error.message);
        throw error;
    }
};

export const deleteMesaiByDoktor = async (hastaneId, doktorTC, mesaiId) => {
    try {
        const response = await axios.delete(`${API_URL}/Admin/delete-mesai-by-doktor/${hastaneId}/${doktorTC}/${mesaiId}/mesai`, getHeaders());
        return response.data;
    } catch (error) {
        console.error(`Doktor mesaisi silinirken bir hata oluştu (Hastane ID: ${hastaneId}, Doktor TC: ${doktorTC}, Mesai ID: ${mesaiId}): ` + error.message);
        throw error;
    }
};

// ### İl ve İlçe Bilgisini Alma
export const getIlveIlceDatas = async () => {
    try {
        const response = await axios.get(`${API_URL}/unauth/city-district-information/`, getHeaders());
        return response.data;
    } catch (error) {
        console.error(`İl ve İlce bilgileri getirilirken bir soun oluştu: ` + error.message);
        throw error;
    }
};

// ### İl ve İlçe Bilgisini Alma
export const getIller = async () => {
    try {
        const response = await axios.get(`${API_URL}/admin/get-il-ilce-information/`, getHeaders());
        return response;
    } catch (error) {
        console.error(`İl bilgileri getirilirken bir sorun oluştu: ` + error.message);
        throw error;
    }
};

export const addIl = async (ilAdi) => {
    try {
        const response = await axios.post(`${API_URL}/admin/add-il/${ilAdi}`, getHeaders());
        return response.data;
    } catch (error) {
        console.error(`Belirtilen TC ve randevu ID ile randevu detayı getirilirken bir hata oluştu (TC: ${hastaTC}, Randevu ID: ${randevuID}): ` + error.message);
        throw error;
    }
};

export const addIlce = async (ilId, ilceAdi) => {
    try {
        const response = await axios.post(`${API_URL}/admin/add-ilce/${ilId}/${ilceAdi}`, getHeaders());
        return response.data;
    } catch (error) {
        console.error(`Belirtilen TC ve randevu ID ile randevu detayı getirilirken bir hata oluştu (TC: ${hastaTC}, Randevu ID: ${randevuID}): ` + error.message);
        throw error;
    }
};

export const updateIlById = async (ilId, yeniIlAdi) => {
    try {
        const response = await axios.put(
            `${API_URL}/admin/update-il/${ilId}/${yeniIlAdi}`,
            {},
            getHeaders()
        );
        return response.data;
    } catch (error) {
        console.error(`İl güncellenirken hata oluştu (İl ID: ${ilId}, Yeni Adı: ${yeniIlAdi}): ` + error.message);
        throw error;
    }
};

export const updateIlceById = async (ilceId, yeniIlceAdi) => {
    try {
        const response = await axios.put(
            `${API_URL}/admin/update-ilce/${ilceId}/${yeniIlceAdi}`,
            {},
            getHeaders()
        );
        return response.data;
    } catch (error) {
        console.error(`İlce güncellenirken hata oluştu (İlce ID: ${ilId}, Yeni Adı: ${yeniIlAdi}): ` + error.message);
        throw error;
    }
};

export const deleteIlById = async (ilId) => {
    try {
        const response = await axios.delete(`${API_URL}/admin/delete-il/${ilId}`, getHeaders());
        return response.data;
    } catch (error) {
        console.error(`İl silinirken bir hata oluştu (İl ID: ${ilId}): ` + error.message);
        throw error;
    }
};

export const deleteIlceById = async (ilceId) => {
    try {
        const response = await axios.delete(`${API_URL}/admin/delete-ilce/${ilceId}`, getHeaders());
        return response.data;
    } catch (error) {
        console.error(`İlce silinirken bir hata oluştu (İl ID: ${ilceId}): ` + error.message);
        throw error;
    }
};

// ### Uzmanlık bilgisi alma
export const getUzmanlikDatas = async () => {
    try {
        const response = await axios.get(`${API_URL}/unauth/doktor-uzmanliklar/`, getHeaders());
        return response.data;
    } catch (error) {
        console.error(`Doktor uzamanlıklar getirilirken bir sorun oluştu:` + error.message);
        throw error;
    }
};