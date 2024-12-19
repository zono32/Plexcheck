<script setup>
import useService from "@/hooks/useService";
import { useAuthStore } from "@/stores/auth";
import { useUserStore } from "@/stores/user";
import useTimetable from "@/composables/useTimetable";

const {
  normalizeDate,
  formatDate,
  weekDay,
  dayOfWeek,
  date,
  year,
} = useTimetable();

const {
  isTimetableSuccess,
  getTimetable,
  timetableData,
  isCurrentTimetableSuccess,
  getCurrentTimetable,
  currentTimetableData,
  getVacation,
  vacationData,
} = useService();

const auth = useAuthStore();
const user = useUserStore();

const workingDay = computed(
  () =>
    ` Hoy es ${dayOfWeek[weekDay.value?.week_day]}, Hora de entrada: ${
      weekDay.value?.hour_in
    }, Hora de salida: ${weekDay.value?.hour_out}`
);

//console.log(day.value)
//const fechaPrueba = '15-08-2024';
const todayNormalized = normalizeDate(date);

const scheduleFound = computed(() => {
  if (!timetableData.value || !Array.isArray(timetableData.value.timetable)) {
    return null;
  }
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
  const foundSchedule = scheduleFound.value;
  return (
    (foundSchedule && foundSchedule.id) ??
    timetable.find((item) => !item.init_date && !item.end_date)?.id
  );
});

onMounted(() => {
  getTimetable(user.companyId, user.id, auth.token);
  getCurrentTimetable(user.companyId, idTable.value, auth.token);
  getVacation(user.companyId, user.id, auth.token);
});

const idsTimeTable = computed(() => {
  return timetableData?.value?.timetable
    ? timetableData.value.timetable.map((item) => item.id)
    : [];
});

const dataTables = ref([]);

onMounted(async () => {
  for (let i = 0; i < idsTimeTable.value.length; i++) {
    const id = idsTimeTable.value[i] || 0;
    //console.log("id", id);
    await getCurrentTimetable(user.companyId, id, auth.token);
    dataTables.value.push(currentTimetableData.value);
  }
});

//console.log(dataTables.value);

const dataTable = ref([]);
dataTable.value = timetableData.value?.timetable;
</script>

<template>
  <div class="container">
    <div class="title">Horarios activos</div>
    <div class="working-day">{{ workingDay }}</div>
    <div class="data-tables">
      <div v-if="isCurrentTimetableSuccess">
        <div v-for="item in dataTables" :key="item.id" class="table-item">
          <div class="table-name">{{ item.name }}</div>
          <div class="table-description">Jornada de {{ item.description }}</div>
          <div v-if="isTimetableSuccess">
            <div v-for="itemTable in dataTable" :key="itemTable.id">
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

    <div class="vacation-summary" v-if="vacationData?.resume">
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
            <td>{{ vacationData.resume.pending_days }}</td>
          </tr>
          <tr>
            <td>Días pendientes de aprobar</td>
            <td>{{ vacationData.resume.pending_req }}</td>
          </tr>
          <tr>
            <td>Días aprobados</td>
            <td>{{ vacationData.resume.days_approved }}</td>
          </tr>
          <tr>
            <td>Días compensación por disfrutar este año</td>
            <td>{{ vacationData.resume.compensation_pending_req }}</td>
          </tr>
          <tr>
            <td>Días compensación pendientes de aprobar</td>
            <td>{{ vacationData.resume.pending_compensation_days }}</td>
          </tr>
          <tr>
            <td>Días compensación aprobados</td>
            <td>{{ vacationData.resume.compensation_days_approved }}</td>
          </tr>
          <tr>
            <td>Días anuales de vacaciones</td>
            <td>{{ vacationData.resume.days_year }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.container {
  font-family: "Arial", sans-serif;
  margin: 1em;
  background-color: #f4f6f8;
  padding: 1.5em;
  border-radius: 0.5em;
}

.title {
  font-size: 2.5em;
  font-weight: 600;
  color: #003356;
  margin-bottom: 1em;
  text-align: center; /* Cambiado para centrarse en pantallas pequeñas */
  border-bottom: 2px solid #d16c6d;
  padding-bottom: 0.3em;
}

.working-day {
  font-size: 1.5em;
  text-align: center;
  margin-bottom: 2em;
  color: #d16c6d;
}

.data-tables {
  display: flex;
  width: 90%;
  margin: auto;
  flex-direction: column;
  gap: 1.5em;
}

.table-item {
  margin-bottom: 10px;
  border-radius: 1em;
  box-shadow: 0 0.5em 1em rgba(0, 0, 0, 0.15);
  background-color: #ffffff;
  padding: 1.5em;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-left: 5px solid #003356;
}

.table-item:hover {
  transform: translateY(-0.3em);
  box-shadow: 0 0.5em 1.5em rgba(0, 0, 0, 0.2);
}

.table-name {
  text-align: center;
  font-size: 1.8em;
  font-weight: bold;
  color: #003356;
  margin-bottom: 0.5em;
  letter-spacing: 0.05em;
}

.flex-container {
  margin: auto;
  width: 90%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1em;
  margin-top: 3em;
  margin-bottom: 3em;
}

.table-description {
  font-size: 1.5em;
  color: #003356;
}

.date-name {
  font-size: 1.2em;
}

.day-item {
  background-color: #f2f4f6;
  border-radius: 1em;
  padding: 1em;
  width: calc(20% - 1em); /* Ancho dinámico para tabletas */
  box-sizing: border-box;
  text-align: center;
  box-shadow: 0 0.2em 0.5em rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s;
}

.day-item:hover {
  background-color: #e0e2e5;
}

.day-of-week {
  font-size: 1.5em;
  font-weight: bold;
  color: #d16c6d;
  margin-bottom: 0.5em;
}

.time-detail {
  font-size: 1.2em;
  color: #003356;
  margin-bottom: 0.3em;
}

.break-time {
  font-size: 1.1em;
  color: #d16c6d;
}

.table-title {
  font-size: 1.2em;
  font-weight: bold;
  color: #d16c6d;
  margin-bottom: 10px;
}

.vacation-summary {
  width: 60%;
  margin: auto;
  margin-top: 2em;
  background-color: #ffffff;
  border-radius: 0.5em;
  padding: 1.5em;
  box-shadow: 0 0.5em 1em rgba(0, 0, 0, 0.1);
}

.vacation-table {
  width: 100%; /* Cambiado a 100% para mejor ajuste en móviles */
  margin: auto;
  border-collapse: collapse;
  font-size: 1.5em;
  color: #003356;
}

.vacation-table thead {
  background-color: #003356;
  color: #ffffff;
}

.vacation-table th,
.vacation-table td {
  padding: 0.8em;
  text-align: left;
  border-bottom: 1px solid #f2f2f2;
}

.vacation-table td:nth-child(2) {
  text-align: center;
  font-weight: bold;
  color: #d16c6d;
}

/* Media Queries */
@media (max-width: 768px) {
  .container {
    margin: 0em;
    padding: 0.5em;
  }

  .title {
    font-size: 1.8em;
    text-align: center;
  }
  .table-description {
    font-size: 1em;
    font-weight: bold;
  }

  .data-tables {
    width: 100%;
  }
  .working-day {
    font-size: 1em;
  }
  .flex-container {
    width: 95%;
  }
  .day-item {
    font-size: 0.8em;
    width: calc(50% - 1em);
  }

  .vacation-summary{
    width: 90%;
  }

  .vacation-table th,
  .vacation-table td {
    padding: 0.5em;
    font-size: 0.6em;
  }

  .date-name {
  font-size: 0.9em;
}
}

@media (max-width: 480px) {
  .title {
    font-size: 1.5em;
  }

  .day-item {
    padding: 1em;
  }

  .working-day {
    font-size: 1em;
    margin-bottom: 1.5em;
  }

  .table-item {
    padding: 1em;
  }
}
</style>
