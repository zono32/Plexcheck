import { defineStore } from "pinia";

const token = ref();
const tokenData = ref();
const tokenDuration = ref();

//10 horas = 36000

const setTokens = (tokenData, encryptedData = '', timeTokenExpire =300) => {
  token.value = tokenData;
  //   tokenData.value = encryptedData;
  tokenDuration.value = Date.now() + timeTokenExpire * 1000;
  setTimeout(() => {
    clearTokens();
  }, timeTokenExpire*1000);
};

const clearTokens = () => {
  token.value = null;
  tokenData.value = null;
  tokenDuration.value = null;
};
export const useAuthStore = defineStore(
  "auth",
  () => ({
    setTokens,
    tokenData,
    token,
  }),
  { persist: {} }//el persist es por que si no lo tengo cuando hago un cambio en el codigo me va a la pagina de login
);
