<script setup>
import useService from "@/hooks/useService";
import { useAuthStore } from "@/stores/auth";
import { useUserStore } from "@/stores/user";
import { useTimerStore } from "@/stores/timer";
import { useDateFormat, useNow } from "@vueuse/core";
import { ref } from "vue";
import AppCalendar from "@/components/AppCalendar.vue";
import AppMiCalendar from "@/components/AppMiCalendar.vue";

const now = useNow();
const day = useDateFormat(now, "DD-MM-YYYY");
const year = useDateFormat(now, "YYYY");
const {
  isTimetableSuccess,
  getTimetable,
  timetableData,
  isCurrentTimetableSuccess,
  getCurrentTimetable,
  currentTimetableData,
  curretTimeTable,
  getVacation,
  vacationData,
} = useService();

const auth = useAuthStore();
const user = useUserStore();
const timer = useTimerStore();
const dataTimeTable = ref([]);
const dataCurrentTimeTable = ref([]);
const dataTables = ref([]);
const vacationRequest = ref([]);

const weekDay = computed(() => {
  const dayOfWeek = new Date().getDay();
  const times = currentTimetableData.value?.times;
  return times?.find((time) => dayOfWeek == time.week_day);
});

const dayOfWeek = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

const workingDay = computed(
  () =>
    ` Hoy es ${dayOfWeek[weekDay.value?.week_day]}, Hora de entrada: ${
      weekDay.value?.hour_in
    }, Hora de salida: ${weekDay.value?.hour_out}`
);

onMounted(async () => {
  await getTimetable(user.companyId, user.id, auth.token);
  dataTimeTable.value = timetableData.value?.timetable || [];
  timer.idsTimeTable = dataTimeTable.value.map((item) => item.id);

  // console.log(day.value)
  // const fechaPrueba = '15-08-2024';
  const todayNormalized = normalizeDate(day.value);

  const scheduleFound = dataTimeTable.value.find((item) => {
    const inicio = item.init_date
      ? normalizeDate(formatDate(item.init_date))
      : null;
    const fin = item.end_date ? normalizeDate(formatDate(item.end_date)) : null;

    return inicio && fin && todayNormalized >= inicio && todayNormalized <= fin;
  });
  timer.idTimeTable = scheduleFound
    ? scheduleFound.id
    : dataTimeTable.value.find((item) => !item.init_date && !item.end_date)?.id;

  await getCurrentTimetable(user.companyId, timer.idTimeTable, auth.token),
    (dataCurrentTimeTable.value = currentTimetableData.value);
  dataTables.value = [];

  timer.idsTimeTable.map(async (id) => {
    const { execute, data: dataTotalTables } = curretTimeTable;
    await execute(user.companyId, id, auth.token);
    if (dataTotalTables.value) {
      dataTables.value.push(dataTotalTables.value);
    }
  });

  await getVacation(user.companyId, user.id, auth.token),
    (vacationRequest.value = vacationData.value);
});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const normalizeDate = (fecha) => {
  if (!fecha) return null;
  const partes = fecha.split("-" || "/");
  return new Date(partes[2], partes[1] - 1, partes[0]);
};
</script>

<template>
  <div class="container">
    <div class="title">Horarios activos</div>
    <div class="working-day">{{ workingDay }}</div>

    <div class="data-tables">
      <div v-if="isCurrentTimetableSuccess && dataTables.length">
        <div v-for="item in dataTables" :key="item.id" class="table-item">
          <div v-if="isTimetableSuccess && dataTimeTable.length">
            <div v-for="itemTable in dataTimeTable" :key="itemTable.id">
              <div
                class="date-name"
                v-if="itemTable.init_date !== null && item.id === itemTable.id"
              >
                Período:
                {{ formatDate(itemTable.init_date) }}
                /
                {{ formatDate(itemTable.end_date) }}
              </div>
              <div
                class="date-name"
                v-if="itemTable.init_date !== null && item.id !== itemTable.id"
              >
                Horario por defecto
              </div>
            </div>
          </div>
          <div class="table-name">{{ item.name }}</div>

          <div class="table-description">Jornada de {{ item.description }}</div>

          <div class="datatables" v-if="item.times && item.times.length">
            <div class="flex-container">
              <div v-for="time in item.times" :key="time.id" class="day-item">
                <div class="day-of-week">{{ dayOfWeek[time.week_day] }}</div>
                <div class="time-detail">Entrada: {{ time.hour_in }}</div>
                <div class="time-detail">Salida: {{ time.hour_out }}</div>
                <div class="break-time" v-if="time.break_time !== 0">
                  Descanso: {{ time.break_time }} minutos
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <p>No hay horarios definidos para este ítem.</p>
      </div>
    </div>

    <div class="vacation-summary" v-if="vacationRequest?.resume">
      <div class="table-title">Mi saldo de vacaciones {{ year }}</div>
      <table class="vacation-table">
        <thead>
          <tr>
            <th>Descripción</th>
            <th>Días</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Días por disfrutar este año</td>
            <td>{{ vacationRequest.resume.pending_days }}</td>
          </tr>
          <tr>
            <td>Días pendientes de aprobar</td>
            <td>{{ vacationRequest.resume.pending_req }}</td>
          </tr>
          <tr>
            <td>Días aprobados</td>
            <td>{{ vacationRequest.resume.days_approved }}</td>
          </tr>
          <tr>
            <td>Días compensación por disfrutar este año</td>
            <td>{{ vacationRequest.resume.compensation_pending_req }}</td>
          </tr>
          <tr>
            <td>Días compensación pendientes de aprobar</td>
            <td>{{ vacationRequest.resume.pending_compensation_days }}</td>
          </tr>
          <tr>
            <td>Días compensación aprobados</td>
            <td>{{ vacationRequest.resume.compensation_days_approved }}</td>
          </tr>
          <tr>
            <td>Días anuales de vacaciones</td>
            <td>{{ vacationRequest.resume.days_year }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <AppCalendar />
    <AppMiCalendar />
  </div>
</template>

<style scoped>
.container {
  font-family: "Arial", sans-serif;
  margin: 2em;
  background-color: #f4f6f8;
  padding: 2em;
  border-radius: 0.5em;
}

.title {
  font-size: 2em;
  font-weight: 600;
  color: #003356;
  margin-bottom: 1.2em;
  text-align: left;
  border-bottom: 2px solid #d16c6d;
  padding-bottom: 0.3em;
}

.working-day {
  font-size: 1.5em;
  text-align: center;
  margin-bottom: 2.5em;
  color: #d16c6d;
}

.data-tables {
  display: flex;
  flex-direction: column;
  gap: 2em;
}

.table-item {
  margin-bottom: 10px;
  border-radius: 1em;
  box-shadow: 0 0.5em 1em rgba(0, 0, 0, 0.15);
  background-color: #ffffff;
  padding: 2em;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-left: 5px solid #003356;
}

.table-item:hover {
  transform: translateY(-0.3em);
  box-shadow: 0 0.5em 1.5em rgba(0, 0, 0, 0.2);
}

.date-name {
  font-size: 1.2em;
  font-weight: bold;
  color: #003356;
  margin-bottom: 1em;
  text-transform: uppercase;
}

.table-name {
  text-align: center;
  font-size: 1.4em;
  font-weight: bold;
  color: #003356;
  margin-bottom: 0.5em;
  letter-spacing: 0.05em;
}

.table-description {
  text-align: center;
  font-size: 1em;
  color: #7f8c8d;
  margin-bottom: 1.2em;
  font-style: italic;
}

.datatables {
  display: flex;
  flex-direction: column;
}

.flex-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1.5em;
  margin-top: 1.5em;
}

.day-item {
  background-color: #f2f4f6;
  border-radius: 1em;
  padding: 1.5em;
  width: 17%;
  box-sizing: border-box;
  text-align: center;
  box-shadow: 0 0.2em 0.5em rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s;
}

.day-item:hover {
  background-color: #e0e2e5;
}

.day-of-week {
  font-size: 1.1em;
  font-weight: bold;
  color: #d16c6d;
  margin-bottom: 0.5em;
}

.time-detail {
  font-size: 0.95em;
  color: #003356;
  margin-bottom: 0.3em;
}

.break-time {
  font-size: 0.9em;
  color: #d16c6d;
}

.vacation-summary {
  margin-top: 2em;
  background-color: #ffffff;
  border-radius: 0.5em;
  padding: 1.5em;
  box-shadow: 0 0.5em 1em rgba(0, 0, 0, 0.1);
}

.table-title {
  font-size: 1.8em;
  font-weight: bold;
  color: #003356;
  text-align: center;
  margin-bottom: 1.5em;
}

.vacation-table {
  width: 50%;
  margin: auto;
  border-collapse: collapse;
  font-size: 1em;
  color: #003356;
}

.vacation-table thead {
  background-color: #003356;
  color: #ffffff;
}

.vacation-table th,
.vacation-table td {
  padding: 1em;
  text-align: left;
  border-bottom: 1px solid #f2f2f2;
}

.vacation-table tbody tr:hover {
  background-color: #f4f6f8;
}

.vacation-table th {
  text-transform: uppercase;
  font-weight: bold;
  letter-spacing: 0.05em;
}

.vacation-table td {
  font-size: 0.95em;
}

.vacation-table td:nth-child(2) {
  text-align: center;
  font-weight: bold;
  color: #d16c6d;
}
</style>
