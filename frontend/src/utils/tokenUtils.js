import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "authToken";

export const tokenUtils = {
  setToken: ({ accessToken, expiresIn }) => {
    if (!accessToken) return;

    localStorage.setItem(TOKEN_KEY, accessToken);

    if (expiresIn) {
      const expiryTime = Date.now() + expiresIn * 1000;
      localStorage.setItem(`${TOKEN_KEY}_expiry`, expiryTime.toString());
    }
  },

  getToken: () => localStorage.getItem(TOKEN_KEY),

  clearToken: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(`${TOKEN_KEY}_expiry`);
  },

  isAuthenticated: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return false;

    const expiry = localStorage.getItem(`${TOKEN_KEY}_expiry`);
    if (expiry && Date.now() > Number(expiry)) {
      tokenUtils.clearToken();
      return false;
    }

    return true;
  },

  decodeToken: () => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      return token ? jwtDecode(token) : null;
    } catch {
      return null;
    }
  },
};
