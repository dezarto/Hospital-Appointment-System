import axios from 'axios';

const API_URL_DOKTOR = 'https://localhost:7004/api/doktor';
const API_URL_UNAUTH = 'https://localhost:7004/api/unauth';

const getHeaders = () => ({
    headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json',
    },
});

// ### Doktor Şifre Güncelleme
export const updateDoktorPassword = async (data) => {
    try {
        const response = await axios.post(`https://localhost:7004/api/auth/update-password`, data, getHeaders());
        return response;
    } catch (error) {
        console.error("Doktor şifresi güncellenirken bir hata oluştu: " + error.message);
        throw error;
    }
};

// ### Doktor Bilgileri Alma
export const getDoktorDatas = async (doktorTC) => {
    try {
        const response = await axios.get(`${API_URL_DOKTOR}/get-doktor-datas/${doktorTC}`, getHeaders());
        return response;
    } catch (error) {
        console.error(`Belirtilen TC ile doktor bilgileri getirilirken bir hata oluştu (TC: ${doktorTC}): ` + error.message);
        throw error;
    }
};

// ### Doktor Bilgileri Güncelleme
export const updateDoktorDatas = async (doktorTC, data) => {
    try {
        const response = await axios.put(`${API_URL_DOKTOR}/update-doktor-datas/${doktorTC}`, data, getHeaders());
        return response;
    } catch (error) {
        console.error(`Doktor bilgileri güncellenirken bir hata oluştu (TC: ${doktorTC}): ` + error.message);
        throw error;
    }
};

// ### Doktor Mesaileri Alma
export const getDoktorMesailer = async (doktorTC) => {
    try {
        const response = await axios.get(`${API_URL_DOKTOR}/get-mesai/${doktorTC}`, getHeaders());
        return response.data;
    } catch (error) {
        console.error(`Doktor mesaileri getirilirken bir hata oluştu (TC: ${doktorTC}): ` + error.message);
        throw error;
    }
};

// ### Doktor Randevuları Alma
export const getDoktorRandevular = async (doktorTC) => {
    try {
        const response = await axios.get(`${API_URL_DOKTOR}/get-randevular/${doktorTC}`, getHeaders());
        return response.data;
    } catch (error) {
        console.error(`Doktor randevuları getirilirken bir hata oluştu (TC: ${doktorTC}): ` + error.message);
        throw error;
    }
};

// ### Doktor Randevu Detayı Alma
export const getDoktorRandevuDatas = async (doktorTC, randevuID) => {
    try {
        const response = await axios.get(`${API_URL_DOKTOR}/get-randevu-datas/${doktorTC}/${randevuID}`, getHeaders());
        return response.data;
    } catch (error) {
        console.error(`Belirtilen TC ve randevu ID ile randevu detayı getirilirken bir hata oluştu (TC: ${doktorTC}, Randevu ID: ${randevuID}): ` + error.message);
        throw error;
    }
};

// ### İl ve İlçe Bilgisini Alma
export const getIlveIlceDatas = async () => {
    try {
        const response = await axios.get(`${API_URL_UNAUTH}/city-district-information/`, getHeaders());
        return response.data;
    } catch (error) {
        console.error(`Il ve ilçeler getirilirken bir sorun oluştu: ` + error.message);
        throw error;
    }
};

// ### Hasta randevu notu güncelleme
export const updateHastaRandevuNotu = async (doktorTC, randevuId, randevuNotu) => {
    try {
        const response = await axios.put(`${API_URL_DOKTOR}/update-randevu-datas/${doktorTC}/${randevuId}/${randevuNotu}`, null, getHeaders());
        return response.data;
    } catch (error) {
        console.error(`Hasta randevu notu güncellenirken bir sorun oluştu (DC: ${doktorTC}, Randevu ID: ${randevuId}, Randevu Notu: ${randevuNotu}): ` + error.message);
        throw error;
    }
};

// ### Uzmanlık bilgisi alma
export const getUzmanlikDatas = async () => {
    try {
        const response = await axios.get(`${API_URL_UNAUTH}/doktor-uzmanliklar/`, getHeaders());
        return response.data;
    } catch (error) {
        console.error(`Doktor uzamanlıklar getirilirken bir sorun oluştu:` + error.message);
        throw error;
    }
};