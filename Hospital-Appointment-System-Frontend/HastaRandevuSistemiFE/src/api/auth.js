import { jwtDecode } from "jwt-decode";

// Kullanıcı rolünü alma
export const getUserRole = () => {
    const token = sessionStorage.getItem('token');
    if (!token) return null;

    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp && decoded.exp < currentTime) {
            sessionStorage.removeItem('token');
            return null;
        }

        return decoded.role;
    } catch (error) {
        console.error("Token çözümleme hatası: " + error.message);
        sessionStorage.removeItem('token');
        return null;
    }
};

// Kullanıcı ID'sini alma
export const getUserId = () => {
    const token = sessionStorage.getItem('token');
    if (!token) return null;

    try {
        const decoded = jwtDecode(token);
        return decoded.unique_name || null;
    } catch (error) {
        console.error("Token çözümleme hatası: " + error.message);
        sessionStorage.removeItem('token');
        return null;
    }
};
