<script setup>
import CryptoJS from "crypto-js";
import useService from "@/hooks/useService";
import { useAuthStore } from "@/stores/auth";
import { useUserStore } from "@/stores/user";
import { useTimerStore } from "@/stores/timer";
import { useDateFormat, useNow } from "@vueuse/core";

const now = useNow(); //ya es reactivo
const nowDateTest = new Date(); //ya es reactivo

const day = useDateFormat(now, "DD-MM-YYYY");
const time = useDateFormat(now, "HH:mm:ss");
const totalSeconds = ref(0);
let intervalId = null;
//const dayOfWeekNumber = now.value.getDay();
const dayOfWeekNumber = 4
const {
  signIn,
  signOut,
  getTimetable,
  timetableData,
  isCurrentTimetableSuccess,
  getCurrentTimetable,
  currentTimetableData,
  getArrayCheck,
  checkData,
  getHoliday,
  holidayData,
  getHolidays,
  holidaysData,
  issignInSuccess,issignInLoading
} = useService();

const auth = useAuthStore();
const user = useUserStore();
const timer = useTimerStore();

const encryptData = (data) =>
  CryptoJS.AES.encrypt(data, import.meta.env.VITE_CRYPTO_KEY).toString();


const encryptedDataTest = computed(()=>encryptData(`"${JSON.stringify({
      iduser: user.id,
      date: useNow().value.toISOString(),
      optionId: 8,
      origin: 2,
    }).replace(/"/g, '\\"')}"`))


const checkIn = async () => {
  const entryDate = getTimeInSeconds(new Date());
  timer.entryTimeInSeconds = entryDate;
  timer.timerRunning = true;
  timer.lastCheckOut = null;

  const message = ref(
    `"${JSON.stringify({
      iduser: user.id,
      date: new Date().toISOString(),
      optionId: 8,
      origin: 2,
    }).replace(/"/g, '\\"')}"`
  );

  try {
    const encryptedMessage = encryptData(message.value);
    //TODO: quitar ejecucion asincrona
    //eliminar try catch
    await signIn(encryptedMessage, auth.token);
  } catch (error) {
    console.error("error en el fichaje: " + error);
  }
  season();
};
//TODO: pasar a computada
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};
//TODO:Pasar a computada
const normalizeDate = (fecha) => {
  if (!fecha) return null;
  const partes = fecha.split("-" || "/");
  return new Date(partes[2], partes[1] - 1, partes[0]);
};

const dataTodayTimeTable = ref([]);
const dataCurrentTimeTable = ref([]);
const dataCheck = ref([]);
const totalDiffSeconds = ref(0);
const totalDiffCheck = ref("00h 00min");
const dataHoliday = ref([]);
const dataHolidays = ref([]);
const upcomingVacationRequests = ref([]);
const vacationRequests = ref([]);
const upComingHoliday = ref([]);
const firstHoliday = ref(null);

//TODO: Eliminar esta función.
//Las funciones solo deben de hacer una UNICA cosa
//Setea ciertos valores de la store, hace una llamadas a la api, hace cálculos....

const season = async () => {
  //TODO: eliminar asincronia
  await getArrayCheck(user.companyId, user.id, day, auth.token);
  //esto es redundante
  dataCheck.value = checkData.value.data;
  const checks = checkData.value.data.checks;
  let totalBreakSeconds = 0;
  let lastCheckoutDate = null;

  if (checks.length > 0) {
    const firstEntryDate = new Date(checks[0].checkin);
    firstEntryDate.setHours(firstEntryDate.getHours() + 1);
    timer.firstCheckIn = firstEntryDate;

    const ongoingCheck = checks.find((check) => check.checkout === null);
    if (ongoingCheck) {
      timer.hasCheckedIn = true;
      const entryDate = new Date(ongoingCheck.checkin);
      entryDate.setHours(entryDate.getHours() + 1);

      const now = new Date();
      const elapsedSeconds = (now - entryDate) / 1000;

      totalSeconds.value = Math.floor(elapsedSeconds);
      timer.entryTimeInSeconds = getTimeInSeconds(entryDate);
      timer.timerRunning = true;
    } else {
      timer.hasCheckedIn = false;
    }

    let diffInSecondsTotal = 0;
    const formattedChecks = checks.map((check) => {
      const entryDate = new Date(check.checkin);
      entryDate.setHours(entryDate.getHours() + 1);
      const formattedCheckin = useDateFormat(entryDate, "HH:mm").value;

      let formattedCheckout = "No registrada";
      let formattedDiff = "No disponible";
      let exitDate = null;

      if (check.checkout) {
        exitDate = new Date(check.checkout);
        exitDate.setHours(exitDate.getHours() + 1);
        formattedCheckout = useDateFormat(exitDate, "HH:mm").value;

        const diffInSeconds = Math.floor((exitDate - entryDate) / 1000);
        formattedDiff = formatTime(diffInSeconds);
        diffInSecondsTotal += diffInSeconds;
        totalSeconds.value += diffInSeconds;
      }

      if (lastCheckoutDate && entryDate) {
        const breakInSeconds = Math.floor(
          (entryDate - lastCheckoutDate) / 1000
        );
        totalBreakSeconds += breakInSeconds;
      }

      if (exitDate) {
        lastCheckoutDate = exitDate;
        timer.timerRunning
          ? (timer.lastCheckOut = null)
          : (timer.lastCheckOut = lastCheckoutDate);
      }

      return { formattedCheckin, formattedCheckout, formattedDiff };
    });

    totalDiffSeconds.value = diffInSecondsTotal;
    totalDiffCheck.value = formatTime(diffInSecondsTotal);
    timer.checkHistory = formattedChecks;

    timer.totalBreakTime = formatTime(totalBreakSeconds);
    timer.totalBreakSeconds = totalBreakSeconds;
  } else {
    timer.totalTime = "00:00:00";
    timer.checkHistory = [];
    timer.totalBreakTime = "00:00:00";
    timer.totalBreakSeconds = 0;
  }
};

const dataTimeTable = ref([]);
//TODO: eliminar ciclo de vida innecesario
onMounted(async () => {
  //eliminar asincronia
  await getTimetable(user.companyId, user.id, auth.token);
  //esto es redundante
  dataTimeTable.value = timetableData.value?.timetable;
  //PASAR a computada
  timer.idsTimeTable = dataTimeTable.value.map((item) => item.id);

  const todayNormalized = normalizeDate(day.value);

  const scheduleFound = dataTimeTable.value.find((item) => {
    const inicio = item.init_date
      ? normalizeDate(formatDate(item.init_date))
      : null;
    const fin = item.end_date ? normalizeDate(formatDate(item.end_date)) : null;

    return inicio && fin && todayNormalized >= inicio && todayNormalized <= fin;
  });
  //esto es una computada
  timer.idTimeTable = scheduleFound
    ? scheduleFound.id
    : dataTimeTable.value.find((item) => !item.init_date && !item.end_date)?.id;

  await season();

  //esta llamada es dependiente de otro valor, que es reactivo, por lo que debemos escuchar la computada para actuar(watch)
  await getCurrentTimetable(user.companyId, timer.idTimeTable, auth.token);
  //la respuesta vendra cuando venga, por lo que pasa a una computada si hacemos cosas con ella
  dataTodayTimeTable.value = Array.isArray(currentTimetableData.value?.times)
    ? currentTimetableData.value.times
    : [];
  dataCurrentTimeTable.value = currentTimetableData.value;
  //esta sale fuera del ciclo sin asincronia, ya trabajaremos la respuesta cuando este disponible
  await getHoliday(user.companyId, user.localityId, auth.token);
  //redundante
  dataHoliday.value = holidayData.value;
  //doble redundante
  const holiday = dataHoliday.value;
  //para sacar el dia de hoy, vamos a usar la composable de vueUse de useNow(), que nos garantiza la reactividad del dato
  //const today = useNow();
  const today = new Date();
  const uniqueHolidayNames = new Set();
  //computada
  const filteredHoliday = holiday
    .filter((holiday) => {
      const holidayDate = new Date(holiday.begins);
      if (holidayDate >= today) {
        if (!uniqueHolidayNames.has(holiday.name)) {
          uniqueHolidayNames.add(holiday.name);
          return true;
        }
      }
      return false;
    })
    .sort((a, b) => new Date(a.begins) - new Date(b.begins));
  upComingHoliday.value = filteredHoliday;

  if (filteredHoliday.length > 0) {
    firstHoliday.value = filteredHoliday[0];
  } else {
    firstHoliday.value = null;
  }
  //renombrar funciones para que digan lo que hacen. Si es festivos...
  //DEEPL es una herramienta de lenguaje natural que usa IA para la traducción
  //ejecutamos fuera del ciclo de vida
  await getHolidays(user.companyId, user.id, auth.token);
  //este seteo es redundante
  dataHolidays.value = holidaysData.value;
  //esto es una computada porque holidaysData es reactivo y hacemos un calculo
  vacationRequests.value = dataHolidays.value.requests
    .sort((a, b) => new Date(a.init_date) - new Date(b.init_date))
    .map((req) => {
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
  //otra computada que depende de otra computada (dependeria de la computada anterior)
  upcomingVacationRequests.value = vacationRequests.value.filter((req) => {
    const reqDate = new Date(req.init_date);
    return reqDate >= today;
  });
});

const idCheck = computed(
  () => dataCheck.value?.checks?.find((check) => !check.checkout)?.id
);

const checkOut = async () => {
  timer.timerRunning = false;
  clearInterval(intervalId);
  intervalId = null;

  const message = ref(
    `"${JSON.stringify({
      id: idCheck.value,
      iduser: user.id,
      date: new Date().toISOString(),
      optionId: 8,
      origin: 2,
    }).replace(/"/g, '\\"')}"`
  );
//la funcion checkout solo debe de ejecutarse y nos olvidamos de ella
  try {
    const encryptedMessage = encryptData(message.value);
    await signOut(encryptedMessage, auth.token);
    //para ejecutar esto podemos vamos a usar un watch, signout tiene cosas reactivas (isSuccess, isLoading, isError) de la funcion useAPI que usamos en el useService, tan solo hay retornalo
    await season();//escuchando isSuccess de signOut
  } catch (error) {
    console.error("Error en el fichaje: " + error);
  }
};

const todaySchedule = computed(() =>
  dataTodayTimeTable.value.filter((item) => item.week_day === dayOfWeekNumber)
);

const diffHoursInSeconds = computed(() => {
  const item = todaySchedule.value[0];
  if (!item) return 0;
  const [hours, minutes] = item.working_time.split(":").map(Number);
  return (hours * 3600 + minutes * 60)-(item.lunch_time*60);
});

const exitHour = computed(() => {
  return formatTime(
    getTimeInSeconds(timer.firstCheckIn) +
      diffHoursInSeconds.value +
      timer.totalBreakSeconds
  );
});

//TODO CON ALEX: esto es una funcion auxiliar que nos devuelve cosas (pasará a un hook)
// YA LO IREMOS VIENDO pero mantenemos siempre la reactividad
//opcion 1: const {getTimeInSeconds } = useDateUtils(date)
//opcion 2: geTimeInSeconds(date)
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

var totalSecondsTemp = ref(0);

//computada
const formatTimeSeconds = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${String(hours).padStart(2, "0")}h ${String(minutes).padStart(
    2,
    "0"
  )}min ${String(secs).padStart(2, "0")}seg`;
};

//las computadas no deberian tener sideEffects
const temporizador = computed(() => {
  let totalSeconds = 0;
  if (dataCheck.value?.checks?.length) {
    const checks = dataCheck.value.checks;
    const lastCheckIn = checks[checks.length - 1];

    if (lastCheckIn.checkin) {
      const checkinDate = new Date(lastCheckIn.checkin);
      checkinDate.setHours(checkinDate.getHours() + 1);

      let elapsedSeconds = 0;

      if (timer.timerRunning) {
        elapsedSeconds = Math.floor((now.value - checkinDate) / 1000);
      }
      totalSecondsTemp.value = elapsedSeconds + totalDiffSeconds.value;
    }
    totalSeconds = totalSecondsTemp.value;
  }
  //SIDE EFFECT DETECTADO!!!!!!
  timer.temporizadorPersist = totalSeconds || 0;

  return totalSeconds || 0;
});


/* 
const funcionTest = (data) =>{
blablabla...
  timer.temporizadorPersist = data || 0;
}
*/
const remainingTime = computed(() => {

  const totalRemainingTime = diffHoursInSeconds.value - temporizador.value;
  if (totalRemainingTime <= 0) {
    return "¡Tiempo completado!";
  }
  return formatTimeSeconds(totalRemainingTime);
});

/* 
LO QUE ESTAS HACIENDO:
1) declarar una variable reactiva --> temporizador = ref()
2) calcular el dato y setearlo en la variable --> temporizador.value = calculo
3) guardas esa variable en la store  --> store.temporizador = temporizador.value
4) visualizando el dato de la store --> <div>{{ store.temporizador }}</div>
5a) definimos const {resp, executeLoQueSea} = useService();
5) ejecutamos funciones asincronas en funcion del calculo --> await executeLoQueSea(); const temp = resp; calculo += temp
---------------------
LO QUE PASAMOS:
1)creamos computadas con el calculo --> const temporizador = computed(()=> calculo += resp)
2)usamos computadas en la vista --> <div> {{ temporizador }} </div>
3a) definimos const {resp, executeLoQueSea} = useService();
3)usamos watchers para hacer cosas determinadas por el cálculo --> watch(temporizador, ()=> executeLoQueSea())

*/
</script>

<template>
  <div class="content_body">
    <div class="content_itens">
      <div class="wellcome">Tu Jornada: {{ nowDateTest }}</div>
      <div class="wellcome">Tu Jornada reactiva: {{ now }}</div>
      <div class="today">Hoy es: {{ day }} y son las {{ time }}</div>
      <div class="weader">Tiempo</div>
    </div>

    <div class="content_itens">
      <div>control de horas</div>
      <div v-if="isCurrentTimetableSuccess && todaySchedule.length">
        <div class="active_hours" v-for="item in todaySchedule" :key="item.id">
          Horario activo {{ dataCurrentTimeTable.description }}
          <div class="estimated_time">({{ item.working_time }} horas)</div>
          <div class="hours_in_out">
            <div class="hour_in">Hora de entrada: {{ item.hour_in }}</div>
            <div class="hour_out">Hora de salida: {{ item.hour_out }}</div>
          </div>
        </div>

        <div class="estimated_exit_hour">
          Hora estimada de salida: {{ exitHour }}
        </div>

        <div class="content_check_buton">
          <AppButton
         v-if="!issignInLoading"
            title="Fichar entrada reactiva"
            @click="signIn(encryptedDataTest, auth.token)"
            :color="!issignInSuccess?'red':'blue'"
            rounded="xl"
          />
          <AppButton
            v-if="!timer.hasCheckedIn"
            title="Fichar entrada"
            @click="checkIn"
            color="orange"
            rounded="xl"
          />
          <AppButton
            v-else
            title="Fichar salida"
            @click="checkOut"
            color="#003252"
            rounded="xl"
          />
        </div>

        <div class="realcheck_in_out">
          <div class="realcheck_in">
            Primera entrada del día:
            {{
              timer.firstCheckIn
                ? useDateFormat(timer.firstCheckIn, "HH:mm")
                : "No registrada"
            }}
          </div>
          <div class="realcheck_out">
            Última salida del día:
            {{
              timer.lastCheckOut
                ? useDateFormat(timer.lastCheckOut, "HH:mm")
                : "No registrada"
            }}
          </div>
        </div>
      </div>

      <div class="content_diffHours">
        <div class="acumulated_time">
          Llevas: {{ formatTimeSeconds(temporizador) }}
          Llevas: {{ formatTimeSeconds(timer.temporizadorPersist) }}
        </div>
        <div class="remaining_time">Te quedan: {{ remainingTime }}</div>
      </div>
    </div>
  </div>

  <div class="content_itens">
    Próximos eventos:
    <div class="content_hollidays">
      <div class="hollidays">
        <div v-if="upcomingVacationRequests.length > 0">
          Vacaciones pendientes:
          <div v-for="(req, index) in upcomingVacationRequests" :key="index">
            {{ req.displayDate }} {{ req.name }}
          </div>
        </div>
        <div v-else>No hay próximas solicitudes de vacaciones.</div>
      </div>

      <div class="holiday">
        <div v-if="firstHoliday">
          Festivos:
          {{ useDateFormat(new Date(firstHoliday.begins), "DD-MM-YYYY").value }}
        </div>
        <div v-else>No hay festivos próximos</div>
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
