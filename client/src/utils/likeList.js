import axiosInstance from "./baseUrl";

// Generate or retrieve a persistent device ID for anti-spam tracking
const getDeviceId = () => {
    let deviceId = localStorage.getItem('menu_deviceId');
    if (!deviceId) {
        deviceId = (typeof crypto !== 'undefined' && crypto.randomUUID) 
            ? crypto.randomUUID() 
            : 'device-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now();
        localStorage.setItem('menu_deviceId', deviceId);
    }
    return deviceId;
};

// 1. שמירה/הסרה מהרשימה המקומית
export const toggleLikeLocal = (dishId) => {
    let favorites = JSON.parse(localStorage.getItem('menu_favorites') || '[]');
    
    if (favorites.includes(dishId)) {
        favorites = favorites.filter(id => id !== dishId);
    } else {
        favorites.push(dishId);
    }
    
    localStorage.setItem('menu_favorites', JSON.stringify(favorites));
    window.dispatchEvent(new CustomEvent('favoritesUpdated', { detail: { dishId, favorites } }));
    return favorites;
};

// 2. עדכון ה-DB למעקב אנליטי (Backend call)
export const reportLikeToDB = async (dishId) => {
    try {
        const deviceId = getDeviceId();
        await axiosInstance.post('/analytics/like', {
            dishId, 
            deviceId,
            timestamp: new Date().toISOString() 
        });
    } catch (err) {
        // בדר"כ באנליטיקה לא נרצה להקפיץ שגיאה למשתמש, רק לרשום בלוגים
        console.warn("Analytics sync failed", err);
    }
};