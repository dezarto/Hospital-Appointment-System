import axios from 'axios';

const API_URL = 'https://localhost:7004/api';

const getHeaders = () => ({
    headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json',
    },
});

// ### Giriş İşlemi
export const login = async (updatedData) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, updatedData, getHeaders());
        return response.data;
    } catch (error) {
        console.error("Giriş işlemi sırasında bir hata oluştu: " + error.message);
        throw error;
    }
};

// ### Hasta Şifre Güncelleme
export const updateHastaPassword = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/auth/update-password`, data, getHeaders());
        return response;
    } catch (error) {
        console.error("Hasta şifresi güncellenirken bir hata oluştu: " + error.message);
        throw error;
    }
};

// ### Kayıt İşlemi
export const register = async (updatedData) => {
    try {
        const response = await axios.post(`${API_URL}/Auth/hasta-register`, updatedData, getHeaders());
        return response.data;
    } catch (error) {
        console.error("Kayıt işlemi sırasında bir hata oluştu: " + error.message);
        throw error;
    }
};

// ### Tüm Hastaneleri Alma
export const getAllHastane = async () => {
    try {
        const response = await axios.get(`${API_URL}/UnAuth/get-all-hastane`, getHeaders());
        return response.data;
    } catch (error) {
        console.error("Hastane listesi alınırken bir hata oluştu: " + error.message);
        throw error;
    }
};

// ### Hastaneye kayıtlı tüm doktorlar
export const getAllDoktorsByHastaneId = async (hastaneId) => {
    try {
        const response = await axios.get(`${API_URL}/UnAuth/get-doktors-by-hastane-id/${hastaneId}`, getHeaders());
        return response.data;
    } catch (error) {
        console.error("Hastaneye bağlı doktorlar alınırken bir hata oluştu: " + error.message);
        throw error;
    }
};

// ### Hastane Tüm Bilgilerini Alma
export const getHastaneAllInformationByHastaneId = async (hastaneId) => {
    try {
        const response = await axios.get(`${API_URL}/UnAuth/get-by-hastane-id-all-information/${hastaneId}`, getHeaders());
        return response.data;
    } catch (error) {
        console.error(`Belirtilen ID ile hastane bilgileri getirilirken bir hata oluştu (ID: ${hastaneId}): ` + error.message);
        throw error;
    }
};

// ### Hastane İletişim Bilgilerini Alma
export const getHastaneCommunicationByHastaneId = async (hastaneId) => {
    try {
        const response = await axios.get(`${API_URL}/UnAuth/get-by-hastane-id/${hastaneId}`, getHeaders());
        return response.data;
    } catch (error) {
        console.error(`Hastane iletişim bilgileri getirilirken bir hata oluştu (ID: ${hastaneId}): ` + error.message);
        throw error;
    }
};

// ### Hastane Hakkında Bilgilerini Alma
export const getHastaneAboutUsByHastaneId = async (hastaneId) => {
    try {
        const response = await axios.get(`${API_URL}/UnAuth/get-about-us-by-hastane-id/${hastaneId}`, getHeaders());
        return response.data;
    } catch (error) {
        console.error(`Hastane hakkında bilgi getirilirken bir hata oluştu (ID: ${hastaneId}): ` + error.message);
        throw error;
    }
};

// ### Slider, Etkinlik, Duyuru ve Haber Bilgilerini Alma
export const getAllSlidersAndEtkinlikAndDuyuruAndHaberByHastaneId = async (hastaneId) => {
    try {
        const response = await axios.get(`${API_URL}/UnAuth/get-AllSlidersAndEtkinlikAndDuyuruAndHaber-by-hastane-id/${hastaneId}`, getHeaders());
        return response.data;
    } catch (error) {
        console.error(`Hastane slider, etkinlik, duyuru ve haber bilgileri getirilirken bir hata oluştu (ID: ${hastaneId}): ` + error.message);
        throw error;
    }
};

// ### Randevu Arama Bilgilerini Alma
export const getRandevuAra = async () => {
    try {
        const response = await axios.get(`${API_URL}/Hasta/get-randevu-data`, getHeaders());
        return response.data;
    } catch (error) {
        console.error("Randevu arama bilgileri getirilirken bir hata oluştu: " + error.message);
        throw error;
    }
};

// ### Randevu Onaylama
export const postRandevuOnayla = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/Hasta/confirm-randevu`, data, getHeaders());
        return response;
    } catch (error) {
        console.error("Randevu onaylama işlemi sırasında bir hata oluştu: " + error.message);
        throw error;
    }
};

// ### Hasta Randevularını Alma
export const getRandevularim = async (hastaTC) => {
    try {
        const response = await axios.get(`${API_URL}/Hasta/get-randevularim/${hastaTC}`, getHeaders());
        return response;
    } catch (error) {
        console.error(`Belirtilen TC ile hasta randevuları getirilirken bir hata oluştu (TC: ${hastaTC}): ` + error.message);
        throw error;
    }
};

// ### Hasta Bilgilerini Alma
export const getHastaDatas = async (hastaTC) => {
    try {
        const response = await axios.get(`${API_URL}/Hasta/get-hasta-datas/${hastaTC}`, getHeaders());
        return response;
    } catch (error) {
        console.error(`Belirtilen TC ile hasta bilgileri getirilirken bir hata oluştu (TC: ${hastaTC}): ` + error.message);
        throw error;
    }
};

// ### Hasta Bilgilerini Güncelleme
export const updateHastaDatas = async (hastaTC, data) => {
    try {
        const response = await axios.put(`${API_URL}/Hasta/update-hasta-datas/${hastaTC}`, data, getHeaders());
        return response;
    } catch (error) {
        console.error(`Hasta bilgileri güncellenirken bir hata oluştu (TC: ${hastaTC}): ` + error.message);
        throw error;
    }
};

// ### Randevu Detaylarını Alma
export const getRandevuDatas = async (hastaTC, randevuID) => {
    try {
        const response = await axios.get(`${API_URL}/Hasta/get-randevu-datas/${hastaTC}/${randevuID}`, getHeaders());
        return response.data;
    } catch (error) {
        console.error(`Belirtilen TC ve randevu ID ile randevu detayı getirilirken bir hata oluştu (TC: ${hastaTC}, Randevu ID: ${randevuID}): ` + error.message);
        throw error;
    }
};

// ### İl ve İlçe Bilgisini Alma
export const getIlveIlceDatas = async () => {
    try {
        const response = await axios.get(`${API_URL}/unauth/city-district-information/`, getHeaders());
        return response.data;
    } catch (error) {
        console.error(`İl ve ilçeler getirilirken bir sorun oluştu: ` + error.message);
        throw error;
    }
};