import { defineStore } from "pinia";

const tokenData = ref();
const companyId = ref();
const firstname = ref();
const userName = ref();
const id = ref();
const localityId = ref();
const setUser = (
  { company_id, name, user_id, username, locality_id },
  encryptedData
) => {
  companyId.value = company_id;
  firstname.value = name;
  id.value = user_id;
  userName.value = username;
  localityId.value = locality_id;
  tokenData.value = encryptedData;
};

export const useUserStore = defineStore(
  "user",
  () => ({
    tokenData,
    firstname,
    userName,
    id,
    companyId,   
    localityId,
    setUser,
  }),
  { persist: {} }
);
