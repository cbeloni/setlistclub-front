import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1"
});

// Configura o token de autenticação padrão nas requisições do Axios
export function setAuthHeader(token) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}

let unauthorizedHandler = null;

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = typeof handler === "function" ? handler : null;
}

// Inicializa o header caso já exista o token salvo no localStorage
const savedToken = localStorage.getItem("access_token");
if (savedToken) {
  setAuthHeader(savedToken);
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && unauthorizedHandler) {
      unauthorizedHandler();
    }
    return Promise.reject(error);
  }
);

/* ==========================================
   AUTHENTICATION ENDPOINTS
   ========================================== */

export async function register(email, displayName, password) {
  const { data } = await api.post("/auth/register", {
    email,
    display_name: displayName,
    password
  });
  return data;
}

export async function login(email, password) {
  const { data } = await api.post("/auth/login", {
    email,
    password
  });
  return data;
}

export async function fetchGoogleAuthUrl() {
  const { data } = await api.get("/auth/google/url");
  return data.url;
}

export async function loginGoogleCallback(idToken) {
  const { data } = await api.post("/auth/google/callback", {
    id_token: idToken
  });
  return data;
}

/* ==========================================
   SETLISTS ENDPOINTS
   ========================================== */

export async function fetchMainSetlists() {
  const { data } = await api.get("/setlists");
  return data;
}

export async function fetchSetlist(id) {
  const { data } = await api.get(`/setlists/${id}`);
  return data;
}

export async function createSetlist(name, description) {
  const { data } = await api.post("/setlists", {
    name,
    description
  });
  return data;
}

export async function deleteSetlist(id) {
  await api.delete(`/setlists/${id}`);
}

export async function reorderSetlist(id, orderedItemIds) {
  const { data } = await api.put(`/setlists/${id}/reorder`, {
    ordered_item_ids: orderedItemIds
  });
  return data;
}

export async function addSongToSetlist(setlistId, chordSheetId) {
  const { data } = await api.post(`/setlists/${setlistId}/items`, {
    chord_sheet_id: chordSheetId
  });
  return data;
}

export async function removeSongFromSetlist(setlistId, itemId) {
  const { data } = await api.delete(`/setlists/${setlistId}/items/${itemId}`);
  return data;
}

/* ==========================================
   CHORD SHEETS ENDPOINTS
   ========================================== */

export async function fetchChordSheets() {
  const { data } = await api.get("/chord-sheets");
  return data;
}

export async function fetchChordSheet(id) {
  const { data } = await api.get(`/chord-sheets/${id}`);
  return data;
}

export async function createChordSheet(title, artist, keySignature, content, youtubeUrl, scrollSpeed = 1) {
  const { data } = await api.post("/chord-sheets", {
    title,
    artist,
    key_signature: keySignature || null,
    content,
    youtube_url: youtubeUrl || null,
    scroll_speed: scrollSpeed
  });
  return data;
}

export async function updateChordSheet(
  id,
  title,
  artist,
  keySignature,
  content,
  youtubeUrl,
  scrollSpeed = 1
) {
  const { data } = await api.put(`/chord-sheets/${id}`, {
    title,
    artist,
    key_signature: keySignature || null,
    content,
    youtube_url: youtubeUrl || null,
    scroll_speed: scrollSpeed
  });
  return data;
}

export async function updateChordSheetScrollSpeed(id, scrollSpeed) {
  const { data } = await api.put(`/chord-sheets/${id}/scroll-speed`, {
    scroll_speed: scrollSpeed
  });
  return data;
}

export async function deleteChordSheet(id) {
  await api.delete(`/chord-sheets/${id}`);
}
