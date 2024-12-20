import { defineStore } from "pinia";

const token = ref();
const tokenDuration = ref();
const userData = ref();

const initializeToken = () => {
};

initializeToken();

const setTokens = (tokenData, switchState = false, timeTokenExpire = 1200) => {
  const duration = switchState ? 36000 : timeTokenExpire;
  token.value = tokenData;
  tokenDuration.value = Date.now() + duration * 1000;

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

//falta hacer el refreshtoken

export const useAuthStore = defineStore("auth", () => ({
  token,
  tokenDuration,
  userData,
  setTokens,
  clearTokens,
  isTokenValid,
  setUser,
}),{persist: true}); // sin el persist al hacer algun cambio en el codigo me devuelve a la pagina de login y pierdo los datos de la sesion
