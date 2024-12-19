<script setup>
import CryptoJS from "crypto-js";
import { useUserStore } from "@/stores/user";
import { useAuthStore } from "@/stores/auth";
import useService from "@/hooks/useService";

const encryptedLogin = (name, pass) =>
  CryptoJS.AES.encrypt(
    `"${JSON.stringify({
      email: name,
      password: pass,
    }).replace(new RegExp('"', "g"), '\\"')}"`,
    import.meta.env.VITE_CRYPTO_KEY
  ).toString();

const userData = ref({ name: "", pass: "" });
const switchState = ref(true);

const { setTokens } = useAuthStore();
const { setUser } = useUserStore();
const router = useRouter();
const { authExecute, authData, isAuthSuccess } = useService();

const encryptedData = computed(() =>
  encryptedLogin(userData.value.name, userData.value.pass)
);

watch(isAuthSuccess, () => {
  router.push("/");
  setTokens(authData.value.data.token);
  setUser(authData.value.data, switchState.value && encryptedData.value);
});
</script>

<template>
  <form class="content-form">
    <div class="content-title">Iniciar sesión</div>

    <AppInput
      class="input-field-name"
      v-model="userData.name"
      label="Nombre"
      placeholder="Introduzca su nombre de usuario"
      type="text"
    />
    <AppInput
      class="input-field-pass"
      v-model="userData.pass"
      label="Contraseña"
      placeholder="Introduzca su contraseña"
      type="password"
    />
    <AppSwitch
      class="switch-field"
      v-model="switchState"
      label="Mantener la sesión iniciada"
    />
    <AppButton
      class="submit-btn"
      :disabled="!userData.name || !userData.pass"
      title="Enviar"
      @click="authExecute(encryptedData)"
      style="background-color: #003356; color: white"
    />
  </form>
</template>

<style scoped>
.content-form {
  background-color: #f4f6f8;
  padding: 2%;
  width: 40%;
  margin: auto;
  margin-top: 50px;
  border-radius: 0.5em;
  box-shadow: 0 0.5em 1em rgba(0, 0, 0, 0.1);
  font-family: "Arial", sans-serif;
}

.content-title {
  font-size: 2.8em;
  font-weight: bold;
  color: #003356;
  text-align: center;
  margin-bottom: 50px;
  border-bottom: 3px solid #d16c6d;
}

.switch-field {
  margin-bottom: 1.5em;
  display: flex;
  align-items: center;
  gap: 0.5em;
  font-size: 1em;
  color: #003356;
}

.submit-btn {
  text-align: center;
  margin-bottom: 30px;
}

@media (max-width: 768px) {
  .content-form {
    max-width: 90%;
  }
}

@media (max-width: 480px) {
  .content-form {
    width: 95%;
  }
}
</style>
