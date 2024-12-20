import { useDateFormat, useNow } from "@vueuse/core";
import useService from "@/hooks/useService";

const { currentTimetableData } = useService();

export default function useTimetable() {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const normalizeDate = (fecha) => {
    if (!fecha || typeof fecha !== "string") return null;
    const partes = fecha.includes("-") ? fecha.split("-") : fecha.split("/");
    if (partes.length !== 3) return null;
    return new Date(partes[2], partes[1] - 1, partes[0]);
  };

  const getTimeInSeconds = (date) => {
    const d = new Date(date);
    return d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds();
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${String(hours).padStart(2, "0")}h ${String(minutes).padStart(
      2,
      "0"
    )}min`;
  };

  const formatTimeSeconds = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, "0")}h ${String(minutes).padStart(
      2,
      "0"
    )}min ${String(secs).padStart(2, "0")}seg`;
  };

  const weekDay = computed(() => {
    const dayOfWeek = new Date().getDay();
    const times = currentTimetableData.value?.times;
    return times?.find((time) => dayOfWeek == time.week_day);
  });

  const dayOfWeek = [ "Domingo", "Lunes", "Martes", "Miércoles", "Jueves",  "Viernes", "Sábado",
  ];

  const now = useNow();
  const today = useDateFormat(now, "dddd");
  const month = useDateFormat(now, "MMM");
  const numberDay = useDateFormat(now, "DD");
  const date = useDateFormat(now, "DD-MM-YYYY");
  const hour = useDateFormat(now, "HH:mm:ss");
  const year = useDateFormat(now, "YYYY");

  return {
    formatDate, normalizeDate, getTimeInSeconds, formatTime, formatTimeSeconds, today, numberDay, date, hour, year, now, month, weekDay, dayOfWeek,};
}
