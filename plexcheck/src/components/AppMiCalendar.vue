<script>
export default {
  data() {
    return {
      currentMonth: new Date().getMonth(),
      currentYear: new Date().getFullYear(),
      daysOfWeek: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
      monthNames: [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 
        'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ],
    };
  },
  computed: {
    daysInMonth() {
      return new Date(
        this.currentYear, 
        this.currentMonth + 1, 
        0
      ).getDate();
    },
    blankDays() {
      const firstDay = new Date(
        this.currentYear, 
        this.currentMonth, 
        1
      ).getDay();
      return Array.from({ length: firstDay === 0 ? 6 : firstDay - 1 }); // Adjusting for Monday start
    },
  },
  methods: {
    nextMonth() {
      if (this.currentMonth === 11) {
        this.currentMonth = 0;
        this.currentYear++;
      } else {
        this.currentMonth++;
      }
    },
    previousMonth() {
      if (this.currentMonth === 0) {
        this.currentMonth = 11;
        this.currentYear--;
      } else {
        this.currentMonth--;
      }
    },
    isWeekend(day) {
      const date = new Date(this.currentYear, this.currentMonth, day);
      const dayOfWeek = date.getDay();
      return dayOfWeek === 0 || dayOfWeek === 6; // Check for Sunday (0) and Saturday (6)
    },
  },
};
</script>
<template>
    <div class="calendar">
      <div class="calendar-header">
        <button @click="previousMonth">Anterior</button>
        <h2>{{ monthNames[currentMonth] }} {{ currentYear }}</h2>
        <button @click="nextMonth">Siguiente</button>
      </div>
      <div class="calendar-grid">
        <div v-for="day in daysOfWeek" :key="day" class="day-header">{{ day }}</div>
        <div
          v-for="day in blankDays"
          :key="'blank' + day"
          class="day blank"
        ></div>
        <div
          v-for="day in daysInMonth"
          :key="'day' + day"
          :class="['day', { 'weekend': isWeekend(day) }]"
        >
          {{ day }}
        </div>
      </div>
    </div>
  </template>
  <style scoped>
  .calendar {
    max-width: 500px;
    margin: 0 auto;
  }
  .calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 5px;
  }
  .day-header,
  .day {
    text-align: center;
    padding: 10px;
    border: 1px solid #ddd;
  }
  .blank {
    visibility: hidden;
  }
  
  .day {
    transition: background-color 0.2s;
  }
  
  .day:hover {
    background-color: #f0f0f0;
  }
  
  /* Estilo para los sábados y domingos */
  .weekend {
    background-color: #d59494;
  }
  
  </style>
  