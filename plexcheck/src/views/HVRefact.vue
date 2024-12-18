<script setup>
import CryptoJS from "crypto-js";
import { useAuthStore } from "@/stores/auth";
import { useUserStore } from "@/stores/user";
import { useTimerStore } from "@/stores/timer";
import useService from "@/hooks/useService";
import { useDateFormat, useNow } from "@vueuse/core";
import { computed, watch } from "vue";

const auth = useAuthStore();
const user = useUserStore();
const timer = useTimerStore();

const now = useNow();
const today = useDateFormat(now, "dddd");
const date = useDateFormat(now, "DD-MM-YYYY");
const hour = useDateFormat(now, "HH:mm:ss");

const normalizeDate = (fecha) => {
  if (!fecha) return null;
  const partes = fecha.split("-" || "/");
  return new Date(partes[2], partes[1] - 1, partes[0]);
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const getTimeInSeconds = (date) => {
  const d = new Date(date);
  return d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds();
};

//computada
const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${String(hours).padStart(2, "0")}h ${String(minutes).padStart(
    2,
    "0"
  )}min`;
};

const {
  signIn,
  issignInLoading,
  signOut,
  getArrayCheck,
  checkData,
  getTimetable,
  timetableData,
  getCurrentTimetable,
  currentTimetableData,
  getVacation,
    vacationData,
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

const firstCheckIn = ref();

const firstCheck = computed(() => {
  const checks = checkData.value?.data?.checks || [];
  return checks[0]; 
});

watch(() => firstCheck.value?.checkin, (newCheckin) => {
    if (newCheckin)      
      firstCheckIn.value = getTimeInSeconds(newCheckin)+3600
    else 
      firstCheckIn.value = null;     
  },
  { immediate: true } 
);

const lastCheckOut = ref();

const lastCheck = computed(() => {
  const checks = checkData.value?.data?.checks || [];
  return checks[checks.length - 1];
});

watch(() => lastCheck.value?.checkout, (newCheckout) => {
  if (newCheckout) {
lastCheckOut.value = getTimeInSeconds(newCheckout)+3600
  }
});

const todayNormalized = normalizeDate(date.value);

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

const dataTable = ref([]);

watch(idTable, async (newId) => {
  if (!newId) return;
  await getCurrentTimetable(user.companyId, newId, auth.token);
  dataTable.value = Array.isArray(currentTimetableData.value?.times)
    ? currentTimetableData.value
    : [];
});

const dayOfWeekNumber = now.value.getDay();

const todaySchedule = computed(() => {
  const times = Array.isArray(dataTable.value.times)
    ? dataTable.value.times
    : [];
  const filtered = times.filter((item) => item.week_day === dayOfWeekNumber);
  return filtered;
});

const totalBreakSeconds = computed(() => {
  if (checkData.value && checkData.value.data) {
    const checks = checkData.value?.data?.checks || [];
    let totalBreak = 0;
    let breack = 0;

  for (let i = 1; i < checks.length; i++) {
    breack = ((getTimeInSeconds(checks[i]?.checkin)-getTimeInSeconds(checks[i - 1]?.checkout)) );    
    totalBreak += breack;    
  }
  return totalBreak  }
});

const diffHoursInSeconds = computed(() => {
  const item = todaySchedule.value[0];
  if (!item) return 0;
  const [hours, minutes] = item.working_time.split(":").map(Number);
  return hours * 3600 + minutes * 60 - item.lunch_time * 60;
});

const exitHour = computed(() => {
  return formatTime(
    firstCheckIn.value + diffHoursInSeconds.value + totalBreakSeconds.value
  );
});

const lastCheckIn = ref();

watch(() => lastCheck.value?.checkin, (newCheckin) => {
  if (newCheckin) {
lastCheckIn.value = getTimeInSeconds(newCheckin)+3600
  }
});

const formatTimeSeconds = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${String(hours).padStart(2, "0")}h ${String(minutes).padStart(
    2,
    "0"
  )}min ${String(secs).padStart(2, "0")}seg`;
};

const ahoraSeg = computed(() => getTimeInSeconds(useNow().value));

const temporizador = computed(() => {
  let totalSeconds = 0; 
  if (lastCheck)
    totalSeconds = ahoraSeg.value - firstCheckIn.value - totalBreakSeconds.value; 
  return totalSeconds
});

const remainingTime = computed(() => {
  const remaining = diffHoursInSeconds.value - temporizador.value;
  if (remaining <= 0) {
    return "¡Tiempo completado!";
  }
  return formatTimeSeconds(remaining);
});

getVacation(user.companyId, user.id, auth.token)

const vacations = computed(() => {
  const vacation = vacationData.value?.requests || [];
  return vacation
})

let nextVacation = ref([]);
const upcomingVacation = ref([]);

watch(() => vacations.value, (newVacation) => {
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
  }, 
);




</script>

<template>
  <div class="content_body">
    <div class="content_itens">
      <div class="wellcome">Tu Jornada</div>
      <div class="today">
        Hoy es {{ today }} {{ date }} y son las {{ hour }}
      </div>
      <div class="weader">Tiempo</div>
    </div>
    <div class="content_itens">
      <div>control de horas</div>
      <div v-if="dataTable && dataTable.description">
        <div class="active_hours" v-for="item in todaySchedule" :key="item.id">
          Horario activo {{ dataTable.description }}
          <div class="estimated_time">({{ item.working_time }} horas)</div>
          <div class="hours_in_out">
            <div class="hour_in">Hora de entrada: {{ item.hour_in }}</div>
            <div class="hour_out">Hora de salida: {{ item.hour_out }}</div>
          </div>
        </div>
      </div>

      <div class="estimated_exit_hour">
        Hora estimada de salida: {{ exitHour }}
      </div>

      <div class="content_check_buton">
        <AppButton
          
          title="Fichar entrada reactiva"
          :disabled="issignInLoading"
          @click="signIn(encriptedDataSinIn, auth.token)"
          color="orange"
          rounded="xl"
        />
        <AppButton
         
          title="Fichar salida reactiva"
          :disabled="issignInLoading"
          @click="signOut(encriptedDataSinOut, auth.token)"
          color="#003252"
          rounded="xl"
        />
        <div v-if="issignInLoading">Procesando tu solicitud...</div>
      </div>
      <div class="realcheck_in_out">
        <div class="realcheck_in">
          Primera entrada del día:
          {{
            firstCheckIn
              ? formatTime(firstCheckIn)
              : "No registrada"
          }}
        </div>
        <div class="realcheck_out">
          Última salida del día:
          {{
            lastCheckOut
              ?  formatTime(lastCheckOut)
              : "No registrada"
          }}
        </div>
      </div>
      <div class="content_diffHours">
        <div class="acumulated_time">
          Llevas: {{ formatTimeSeconds(temporizador) }}
        </div>
        <div class="remaining_time">Te quedan: {{ (remainingTime) }}</div>
      </div>
    </div>

    <div class="content_itens">
    Próximos eventos:
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
        <!-- <div v-if="firstHoliday">
          Festivos:
          {{ useDateFormat(new Date(firstHoliday.begins), "DD-MM-YYYY").value }}
        </div>
        <div v-else>No hay festivos próximos</div> -->
      </div>
    </div>
  </div>
  </div>
</template>

<style scoped>
.content_body {
  background-color: rgb(245, 252, 250);
  color: #003053;
}
.content_itens {
  padding: 10px;
  margin: auto;
  background-color: white;
  width: 90%;
  border-radius: 5px;
  box-shadow: 0px 5px 15px #ddd;
  margin-bottom: 30px;
}
.wellcome {
  text-align: center;
  font-size: 1.5rem;
  text-shadow: 5px 5px 20px rgb(120, 119, 119);
}
.active_hours {
  text-align: center;
}
.hours_in_out {
  display: flex;
  height: 100px;
}

.hour_in {
  width: 150px;
  margin: auto;
}

.hour_out {
  width: 150px;
  margin: auto;
}
.estimated_time {
  text-align: center;
}
.realcheck_in_out {
  display: flex;
  margin-top: 50px;
}
.realcheck_in {
  margin: auto;
}
.realcheck_out {
  margin: auto;
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
.acumulated_time {
  background: linear-gradient(90deg, #024f7e, rgb(245, 243, 244) 75%);
  color: aqua;
  background-attachment: fixed;
  padding: 20px;
  margin: auto;
  border-radius: 25px;
  box-shadow: 0px 5px 15px #ddd;
  margin-bottom: 50px;
}
.remaining_time {
  background: linear-gradient(90deg, rgb(245, 243, 244) 25%, #024f7e);
  color: aqua;
  background-attachment: fixed;
  padding: 20px;
  margin: auto;
  border-radius: 25px;
  box-shadow: 0px 5px 15px #ddd;
  margin-bottom: 50px;
}

.content_check_buton {
  margin-top: 30px;
  margin-bottom: 50px;
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
</style>
