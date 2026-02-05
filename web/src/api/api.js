const API_URL = "/api";

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("accessToken");

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (res.status === 401) {
    localStorage.removeItem("accessToken");
    localStorage.setItem("loginMessage", "Session expirée. Vous avez été déconnecté.");
    window.location.href = "/";
    return;
  }


  // Si 204 No Content, pas de JSON à lire
  const data = res.status === 204 ? null : await res.json();

  if (!res.ok) {
    // On remonte l’erreur proprement
    throw data || { message: "API error" };
  }

  return data;
}
