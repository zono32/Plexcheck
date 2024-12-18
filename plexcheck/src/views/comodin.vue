<script setup>
import useService from "@/hooks/useService";
import { useAuthStore } from "@/stores/auth";
import { useUserStore } from "@/stores/user";
import { onMounted } from "vue";

const auth = useAuthStore();
const user = useUserStore();

const { 
  getCurrentTimetable,
  currentTimetableData
} = useService();

const dataTables = ref([]);

const ids = [8, 30];
onMounted(async () => {
  for (let i = 0; i < ids.length; i++) {
  const id = ids[i];
  console.log("id", id);
  await getCurrentTimetable(user.companyId, id, auth.token);
    if (currentTimetableData.value) {
      dataTables.value.push({ ...currentTimetableData.value });
      console.log(currentTimetableData.value);
    }
}  
})
console.log(dataTables.value);

</script>

<template>  
{{ dataTables }}
</template>

<style scoped></style>
