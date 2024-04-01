
import axios from 'axios';
// export const API_BASE_URL = 'http://localhost:8080/';
export const API_BASE_URL = 'https://readingstudioapp-cc8d242ea8d4.herokuapp.com/';
export const apiClient = axios.create({baseURL:API_BASE_URL});

export async function convertSoundToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]); // เฉพาะส่วนข้อมูล Base64
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}
export async function convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]); // เฉพาะส่วนข้อมูล Base64
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}
