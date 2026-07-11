const API_URL = "http://localhost:5000";

export const getImageUrl = (path) => {

    if (!path) return null;

    return `${API_URL}${path}`;

};