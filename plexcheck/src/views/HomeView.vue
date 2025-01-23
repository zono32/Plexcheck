<script setup>
import CryptoJS from "crypto-js";
import { useAuthStore } from "@/stores/auth";
import { useUserStore } from "@/stores/user";
import useService from "@/hooks/useService";
import { useNow } from "@vueuse/core";
import useTimetable from "@/composables/useTimetable";

const {
  normalizeDate,
  formatDate,
  getTimeInSeconds,
  formatTime,
  formatTimeSeconds,
  today,
  numberDay,
  date,
  hour,
  now,
  month,
} = useTimetable();

const auth = useAuthStore();
const user = useUserStore();

const {
  signIn,
  issignInLoading,
  signOut,
  issignOutSuccess,
  issignInSuccess,
  getArrayCheck,
  checkData,
  getTimetable,
  timetableData,
  getCurrentTimetable,
  currentTimetableData,
  getVacation,
  vacationData,
  getHoliday,
  holidayData,
} = useService();

const encryptData = (data) =>
  CryptoJS.AES.encrypt(data, import.meta.env.VITE_CRYPTO_KEY).toString();

const encriptedDataSinIn = computed(() =>
  encryptData(
    `"${JSON.stringify({
      iduser: user.id,
      date: useNow().value.toISOString(),
      optionId: 8,
      origin: 2,
    }).replace(/"/g, '\\"')}"`
  )
);

const idCheck = computed(() => {
  if (checkData.value && checkData.value.data) {
    return checkData.value.data.checks?.find((check) => !check.checkout)?.id;
  }
  return null;
});

const encriptedDataSinOut = computed(() =>
  encryptData(
    `"${JSON.stringify({
      id: idCheck.value,
      iduser: user.id,
      date: useNow().value.toISOString(),
      optionId: 8,
      origin: 2,
    }).replace(/"/g, '\\"')}"`
  )
);

onMounted(() => {
  getArrayCheck(user.companyId, user.id, date, auth.token);
  getTimetable(user.companyId, user.id, auth.token);
});

watch(
  () => issignInSuccess.value,
  () => getArrayCheck(user.companyId, user.id, date, auth.token)
);
watch(
  () => issignOutSuccess.value,
  () => getArrayCheck(user.companyId, user.id, date, auth.token)
);

const firstCheckIn = ref();

const firstCheck = computed(() => {
  const checks = checkData.value?.data?.checks || [];
  return checks[0];
});

watch(
  () => firstCheck.value?.checkin,
  (newCheckin) => {
    if (newCheckin) firstCheckIn.value = getTimeInSeconds(newCheckin) + 3600;
    else firstCheckIn.value = null;
  },
  { immediate: true }
);

const lastCheck = computed(() => {
  const checks = checkData.value?.data?.checks || [];
  return checks[checks.length - 1];
});

const showboton = computed(() => {
  const checks = checkData.value?.data?.checks || [];
  if (checks.length === 0) return true;
  const activeCheck = checks.find((check) => check.checkin && !check.checkout);
  if (activeCheck) {
    return false;
  }
  return true;
});

const lastCheckOut = ref();

watch(
  () => lastCheck.value?.checkout,
  (newCheckout) => {
    newCheckout
      ? (lastCheckOut.value = getTimeInSeconds(newCheckout) + 3600)
      : (lastCheckOut.value = null);
  }
);

const todayNormalized = normalizeDate(date);

const scheduleFound = computed(() => {
  if (!timetableData.value || !Array.isArray(timetableData.value.timetable))
    return null;
  return timetableData.value.timetable.find((item) => {
    const inicio = item.init_date
      ? normalizeDate(formatDate(item.init_date))
      : null;
    const fin = item.end_date ? normalizeDate(formatDate(item.end_date)) : null;

    return inicio && fin && todayNormalized >= inicio && todayNormalized <= fin;
  });
});

const idTable = computed(() => {
  const timetable = Array.isArray(timetableData.value?.timetable)
    ? timetableData.value.timetable
    : [];
  return (
    (scheduleFound.value && scheduleFound.value.id) ??
    timetable.find((item) => !item.init_date && !item.end_date)?.id
  );
});

const dataTable = computed(() => {
  return Array.isArray(currentTimetableData.value?.times)
    ? currentTimetableData.value
    : [];
});

watch(
  idTable,
  (newId) => {
    if (!newId) return;
    getCurrentTimetable(user.companyId, newId, auth.token);
  },
  { immediate: true }
);

const dayOfWeekNumber = now.value.getDay();

const todaySchedule = computed(() => {
  const times = Array.isArray(dataTable.value.times)
    ? dataTable.value.times
    : [];
  const filtered = times.filter((item) => item.week_day === dayOfWeekNumber);
  return filtered;
});

const totalBreakSeconds = computed(() => {
  const checks = checkData.value?.data?.checks || [];
  if (checkData.value && checkData.value.data && checks.length > 1) {  
    let totalBreak = 0;
    let breack = 0;

    for (let i = 1; i < checks.length; i++) {
      breack =
        getTimeInSeconds(checks[i]?.checkin) -
        getTimeInSeconds(checks[i - 1]?.checkout);
      totalBreak += breack;
    }
    return totalBreak;
  }
  return 0;
});

const diffHoursInSeconds = computed(() => {
  const item = todaySchedule.value[0];
  if (!item) return 0;
  const [hours, minutes] = item.working_time.split(":").map(Number);
  return hours * 3600 + minutes * 60 - item.lunch_time * 60;
});

const exitHour = computed(() => {
  return (
    firstCheckIn.value + diffHoursInSeconds.value + totalBreakSeconds.value
  );
});

const lastCheckIn = ref();

watch(
  () => lastCheck.value?.checkin,
  (newCheckin) => {
    if (newCheckin) {
      lastCheckIn.value = getTimeInSeconds(newCheckin) + 3600;
    }
  }
);

const ahoraSeg = computed(() => getTimeInSeconds(useNow().value));

const timerActive = ref(true);
const handleCheckIn = () => (timerActive.value = true);
const handleCheckOut = () => (timerActive.value = false);

const totalSeconds = ref();

const getNowStop = () => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  return hours * 3600 + minutes * 60 + seconds;
};

const temporizador = computed(() => {
  return timerActive.value
    ? (totalSeconds.value =
        ahoraSeg.value - firstCheckIn.value - (totalBreakSeconds.value || 0))
    : (totalSeconds.value =
        getNowStop() - firstCheckIn.value - totalBreakSeconds.value);
});

const remainingTime = computed(() => {
  const remaining = diffHoursInSeconds.value - temporizador.value;
  if (remaining <= 0) {
    return "¡Tiempo completado!";
  }
  return formatTimeSeconds(remaining);
});

getVacation(user.companyId, user.id, auth.token);

const vacations = computed(() => {
  const vacation = vacationData.value?.requests || [];
  return vacation;
});

let nextVacation = ref([]);
const upcomingVacation = ref([]);

watch(
  () => vacations.value,
  (newVacation) => {
    if (newVacation && newVacation.length > 0) {
      const sortedVacations = newVacation.sort(
        (a, b) => new Date(a.init_date) - new Date(b.init_date)
      );
      nextVacation.value = sortedVacations.map((req) => {
        const initDate = formatDate(req.init_date);
        const endDate = formatDate(req.end_date);
        return {
          ...req,
          displayDate:
            req.init_date === req.end_date
              ? initDate
              : `del ${initDate} al ${endDate}`,
        };
      });

      const today = new Date();
      upcomingVacation.value = nextVacation.value.filter((req) => {
        const reqDate = new Date(req.init_date);
        return reqDate >= today;
      });
    } else {
      nextVacation.value = [];
      upcomingVacation.value = [];
    }
  }
);

getHoliday(user.companyId, user.localityId, auth.token);

const nextHoliday = computed(() => {
  const today = new Date();

  if (!Array.isArray(holidayData.value)) return null;

  const upcomingHolidays = holidayData.value.filter((holiday) => {
    const holidayDate = new Date(holiday.begins);
    return holidayDate > today;
  });
  upcomingHolidays.sort((a, b) => new Date(a.begins) - new Date(b.begins));
  return upcomingHolidays.length > 0 ? upcomingHolidays[0] : null;
});

</script>

<template>
  <div class="content_body">
    <div class="content_itens">
      <div class="wellcome">Tu Jornada</div>
      <div class="content_date">
        <div class="today">Hoy es: {{ today }} {{ numberDay }} de {{ month }}.</div>
        <div class="hour">Hora: {{ hour }}</div>
      </div>

      <!-- <div class="weader">Tiempo</div> -->
    </div>

    <div class="content_itens">
      <div class="title-section" >Control de horas:</div>
      <div v-if="dataTable && dataTable.description">
        <div class="active_hours" v-for="item in todaySchedule" :key="item.id">
          Horario activo {{ dataTable.description }}
          <div class="estimated_time">({{ item.working_time }} horas)</div>
          <!-- <div class="hours_in_out">
            <div class="hour_in">Hora de entrada: {{ item.hour_in }}</div>
            <div class="hour_out">Hora de salida: {{ item.hour_out }}</div>
          </div> -->
        </div>
      </div>

      <div class="estimated_exit_hour">
        Hora estimada de salida: {{ formatTime(exitHour) }}
      </div>

      
      
      <div class="content_diffHours">
        <div class="acumulated_time">
          Llevas: {{ formatTimeSeconds(temporizador) }}
        </div>
        <div class="remaining_time">Restan: {{ remainingTime }}</div>
      </div>

      <div class="content_check_buton">
        <AppButton
          v-if="showboton"
          title="Fichar entrada"
          :disabled="issignInLoading"
          @click="
            () => {
              handleCheckIn(), signIn(encriptedDataSinIn, auth.token);
            }
          "
          color="orange"
          rounded="xl"
        />
        <AppButton
          v-else
          title="Fichar salida"
          :disabled="issignInLoading"
          @click="
            () => {
              handleCheckOut();
              signOut(encriptedDataSinOut, auth.token);
            }
          "
          color="#003252"
          rounded="xl"

        />
        <div v-if="issignInLoading">Procesando tu solicitud...</div>
      </div>

      <div class="realcheck_in_out">
        <div class="realcheck_in">
          Primera entrada del día:
          {{ firstCheckIn ? formatTime(firstCheckIn) : "No registrada" }}
        </div>
        <div class="realcheck_out">
          Última salida del día:
          {{ lastCheckOut ? formatTime(lastCheckOut) : "No registrada" }}
        </div>
      </div>

    </div>

    

    <div class="content_itens">
      <div class="title-section">Próximos eventos:</div>
      <div class="content_hollidays">
        <div class="hollidays">
          <div v-if="upcomingVacation.length > 0">
            Vacaciones pendientes:
            <div v-for="vacation in upcomingVacation" :key="vacation.id">
              {{ vacation.displayDate }}
            </div>
          </div>
          <div v-else>No hay próximas solicitudes de vacaciones.</div>
        </div>

        <div class="holiday">
          <div v-if="nextHoliday">
            <div>Próximo festivo:</div>
            <p>
              {{ nextHoliday.name }}: el día
              {{ formatDate(nextHoliday.begins) }}
            </p>
          </div>
          <div v-else>
            <p>No hay festivos próximos.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

.content_body {
  background: linear-gradient(135deg, #e3f2fd, #f1f8e9);
  color: #003053;
  padding: 25px;
  font-size: 1.5em;
}

.content_date {
  display: flex;
  justify-content: space-around;
  margin-bottom: 10px;
}

.title-section {
  font-size: 1.5rem;
  font-weight: bold;
  text-shadow: 5px 5px 20px rgb(120, 119, 119);
  margin-bottom: 20px;
}

.today, .hour {
  font-size: 1.2em;
}

.content_itens {
  width: 90%;
  padding: 30px;
  margin: auto;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0px 5px 15px #ddd;
  border-left: 5px solid #003356;
  margin-bottom: 20px;
}
.wellcome {
  text-align: center;
  font-weight:bold ;
  font-size: 1.8rem;
  text-shadow: 5px 5px 20px rgb(120, 119, 119);
}
 .active_hours {
  text-align: center;
  margin-bottom: 20px;
}/*
.hours_in_out {
  display: flex;
  height: 100px;
}

.hour_in, .hour_out {
  width: 150px;
  margin: auto;
} */
.estimated_time {
  text-align: center;
}

.realcheck_in_out {
  display: flex;
  margin-bottom: 30px;
}

.realcheck_in, .realcheck_out {
  margin: auto;
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);  
}

.estimated_exit_hour {
  text-align: center;
  font-size: 3rem;
  text-shadow: 5px 5px 15px #003252;
  margin-bottom: 50px;
}
.content_diffHours {
  margin-top: 20px;
  display: flex;
}

.acumulated_time, .remaining_time {
  width: 45%;
  text-align: center;
  font-size: 2rem;
  text-shadow: 5px 5px 15px #003252;
  color: rgb(255, 225, 0);
  background-attachment: fixed;
  padding: 10px;
  margin: auto;
  border-radius: 5px;
  box-shadow: 0px 5px 15px #ddd;
  margin-bottom: 40px;
}

.acumulated_time {
  background: linear-gradient(90deg, #024f7e, rgb(245, 243, 244) 150%); 
}
.remaining_time {
  background: linear-gradient(90deg, rgb(245, 243, 244) -50%, #024f7e);
}

.content_check_buton {
  margin-top: 10px;
  margin-bottom: 30px;
  width: 100%;
  text-align: center;
}

.hollidays {
  text-align: center;
}
.holiday {
  text-align: center;
}
.content_hollidays {
  padding: 10px;
  margin: auto;
  border-radius: 50px;
  background-color: rgb(241, 246, 255);
  width: 70%;
  margin-bottom: 20px;
}
.close_sesion_buton {
  text-align: center;
}


@media (max-width: 768px) {
.content_body {
  background: linear-gradient(135deg, #e3f2fd, #f1f8e9);
  color: #003053;
  padding: 5px;
}

.content_date {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.title-section {
  font-size: 1.2rem;
  font-weight: bold;
  text-shadow: 5px 5px 20px rgb(120, 119, 119);
  margin-bottom: 20px;
}

.today, .hour {
  font-size: 0.7em;
}

.content_itens {
  width: 100%;
  padding: 10px;
  border-left:none;
}
.wellcome {
  text-align: center;
  font-size: 1.5rem;
  text-shadow: 5px 5px 20px rgb(120, 119, 119);
}
.active_hours {
  text-align: center;
  font-size: 0.6em;
}
.hours_in_out {
  display: flex;
  height: 100px;
}

.hour_in, .hour_out {
  width: 150px;
  margin: auto;
}
.estimated_time {
  text-align: center;
}

.realcheck_in_out {
  display: flex;
  margin-bottom: 30px;
}

.realcheck_in, .realcheck_out {
  margin: auto;
  font-size: 0.6em;
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  
}

.estimated_exit_hour {
  text-align: center;
  font-size: 2rem;
  text-shadow: 5px 5px 15px #003252;
}
.content_diffHours {
  margin-top: 20px;
  display: flex;
}

.acumulated_time, .remaining_time {
  width: 45%;
  text-align: center;
  font-size: 0.8rem;
  text-shadow: 5px 5px 15px #003252;
  color: aqua;
  background-attachment: fixed;
  padding: 10px;
  margin: auto;
  border-radius: 25px;
  box-shadow: 0px 5px 15px #ddd;
  margin-bottom: 10px;
}

.acumulated_time {
  background: linear-gradient(90deg, #024f7e, rgb(245, 243, 244) 150%); 
}
.remaining_time {
  background: linear-gradient(90deg, rgb(245, 243, 244) -50%, #024f7e);
}

.content_check_buton {
  margin-top: 10px;
  margin-bottom: 30px;
  width: 100%;
  text-align: center;
}

.hollidays {
  text-align: center;
}
.holiday {
  text-align: center;
}
.content_hollidays {
  padding: 10px;
  font-size: 0.6em;
  margin: auto;
  border-radius: 10px;
  background-color: rgb(241, 246, 255);
  width: 90%;
  margin-bottom: 20px;
}
.close_sesion_buton {
  text-align: center;
}
}
</style>
