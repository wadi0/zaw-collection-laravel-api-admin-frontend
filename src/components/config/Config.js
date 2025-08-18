// // config/environment.js
// const isDevelopment = process.env.NODE_ENV === 'development';
//
// export const API_CONFIG = {
//     // API Base URLs
//     BASE_URL: isDevelopment
//         ? 'http://127.0.0.1:8000/api/'
//         : 'https://first-e-commerce-api-create-laravel.onrender.com/api/',
//
//     // Image/Storage URLs
//     STORAGE_URL: isDevelopment
//         ? 'http://127.0.0.1:8000/storage'
//         : 'https://first-e-commerce-api-create-laravel.onrender.com/storage',
// };
//
// // Utility function to get image URL
// export const getImageUrl = (imagePath) => {
//     if (!imagePath) return null;
//
//     if (imagePath.startsWith('http')) {
//         return imagePath; // Already a full URL
//     }
//
//     // Handle Laravel storage paths
//     return `${API_CONFIG.STORAGE_URL}/${imagePath}`;
// };
//
// // Utility function to handle broken images
// export const handleImageError = (event, fallbackUrl = '/placeholder-image.png') => {
//     event.target.src = fallbackUrl;
//     event.target.onerror = null; // Prevent infinite loop
// };
//
// export default API_CONFIG;