import { defineStore } from "pinia";

const token = ref(null); // Token reactivo en memoria
const tokenDuration = ref(null); // Tiempo de expiración del token
const userData = ref(null); // Información del usuario autenticado

const setTokens = (tokenData, switchState = false, timeTokenExpire = 1200) => {
  const duration = switchState ? 36000 : timeTokenExpire;
  token.value = tokenData;
  tokenDuration.value = Date.now() + duration * 1000;
  setTimeout(() => {
    clearTokens();
  }, duration * 1000);
};

const refreshToken = async () => {
  try {
    const response = await someRefreshTokenService(token.value);
    if (response.success) {
      setTokens(response.data.token, 300); // Renovar el token
      return true;
    }
  } catch (error) {
    console.error("Error al refrescar el token:", error);
  }
  clearTokens(); 
  return false;
};

const clearTokens = () => {
  token.value = null;
  tokenDuration.value = null;
  userData.value = null;
};

const isTokenValid = () => {
  if (!token.value || !tokenDuration.value) return false;
  return Date.now() < tokenDuration.value;
};

const setUser = (user) => {
  userData.value = user;
};

export const useAuthStore = defineStore("auth", () => ({
  token,
  tokenDuration,
  userData,
  setTokens,
  clearTokens,
  isTokenValid,
  setUser,
  refreshToken,
}));
