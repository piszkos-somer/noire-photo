// ============================
// 🔐 Token kezelés segédfüggvények
// ============================

export function getToken() {
  const userData = localStorage.getItem("user");
  if (!userData) return null;

  try {
    const parsed = JSON.parse(userData);
    if (!parsed.token || parsed.token === "null" || parsed.token === "undefined") {
      return null;
    }
    return parsed.token;
  } catch {
    return null;
  }
}

export function getAuthHeader() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function handleTokenError(status, navigate) {
  // Ha 401 vagy 403 -> újrabejelentkezés
  if (status === 401 || status === 403) {
    console.warn("⚠️ Token érvénytelen vagy lejárt, kijelentkeztetés...");
    localStorage.removeItem("user");
    navigate("/Registration");
  }
}
