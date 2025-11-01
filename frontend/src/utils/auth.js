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

export function handleTokenError(status) {
  if (status === 401 || status === 403) {
    console.warn("⚠️ Token érvénytelen vagy lejárt, kijelentkeztetés...");
    localStorage.removeItem("user");

    // 🔹 Egyéni event a React Context értesítéséhez
    window.dispatchEvent(new Event("userLogout"));
  }
}

// auth.js végére írd ezt
export function isTokenExpired() {
  const token = getToken();
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const exp = payload.exp * 1000;
    return Date.now() > exp;
  } catch {
    return true;
  }
}

export function logoutIfExpired(navigate) {
  if (isTokenExpired()) {
    console.warn("⚠️ Token lejárt, kijelentkeztetés...");
    localStorage.removeItem("user");
  }
}
