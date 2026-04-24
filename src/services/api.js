import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1"
});

export async function fetchMainSetlists() {
  const { data } = await api.get("/setlists");
  return data;
}

export async function fetchChordSheet(id) {
  const { data } = await api.get(`/chord-sheets/${id}`);
  return data;
}

export async function fetchSetlist(id) {
  const { data } = await api.get(`/setlists/${id}`);
  return data;
}

export async function reorderSetlist(id, orderedItemIds, token) {
  const { data } = await api.put(
    `/setlists/${id}/reorder`,
    { ordered_item_ids: orderedItemIds },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
}
