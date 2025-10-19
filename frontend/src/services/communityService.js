const API_BASE_URL = 'http://localhost:5000/api/posts';

const handleResponse = async (response) => {
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'An API error occurred.');
    }
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json();
    }
    return { success: true }; // For responses with no body
};

export const getPhotos = async () => fetch(API_BASE_URL).then(handleResponse);

export const addPhoto = async (photoData, token) => fetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(photoData),
}).then(handleResponse);

export const deletePhoto = async (photoId, token) => fetch(`${API_BASE_URL}/${photoId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
}).then(handleResponse);

export const toggleLike = async (photoId, token) => fetch(`${API_BASE_URL}/${photoId}/like`, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${token}` },
}).then(handleResponse);

export const addComment = async (photoId, text, token) => fetch(`${API_BASE_URL}/${photoId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ text }),
}).then(handleResponse);

// ** NEW **
export const deleteComment = async (photoId, commentId, token) => fetch(`${API_BASE_URL}/${photoId}/comments/${commentId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
}).then(handleResponse);

// ** NEW **
export const addReply = async (photoId, commentId, text, token) => fetch(`${API_BASE_URL}/${photoId}/comments/${commentId}/replies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ text }),
}).then(handleResponse);