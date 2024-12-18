import authService from "@/services/authService";
import usersService from "@/services/usersService";
import singService from "@/services/signingsService";
import useAPI from "./useApi";

// Llamada para obtener el token de autenticación
const {
  isLoading: isAuthLoading,
  isError: isAuthError,
  isSuccess: isAuthSuccess,
  execute: authExecute,
  data: authData,
} = useAPI(authService.getToken);

// Llamada para obtener horarios y datos de usuario
const {
  isLoading: isTimetableLoading,
  isError: isTimetableError,
  isSuccess: isTimetableSuccess,
  execute: getTimetable,
  data: timetableData,
} = useAPI(usersService.getTimetable);
const{
isLoading: isCurrentTimetableLoading,
isError: isCurrentTimetableError,
isSuccess: isCurrentTimetableSuccess,
execute: getCurrentTimetable,
data:     currentTimetableData,
} = useAPI(usersService.getCurrentTimetable);
const curretTimeTable = useAPI(usersService.getCurrentTimetable);
// Llamada para obtener días festivos
const {
  isLoading: isHolidayLoading,
  isError: isHolidayError,
  isSuccess: isHolidaySuccess,
  execute: getHoliday,
  data: holidayData,
} = useAPI(usersService.getHoliday);

const {
  isLoading: isVacationLoading,
  isError: isVacationError,
  isSuccess: isVacationSuccess,
  execute: getVacation,
  data: vacationData,
} = useAPI(usersService.getVacation);

// Llamadas para gestionar el registro de entradas/salidas
const {  
  isLoading: issignInLoading,
  isError: issignInError,
  isSuccess: issignInSuccess,
  execute: signIn,
  data: singInData,
} = useAPI(singService.singIn);

const {  
  isLoading: issignOutLoading,
  isError: issignOutError,
  isSuccess: issignOutSuccess,
  execute: signOut,
  data: singOutData,
} = useAPI(singService.singOut);

const {
  isLoading: isArrayCheckLoading,
  isError: isArrayCheckError,
  isSuccess: isArrayCheckSuccess,
  execute: getArrayCheck,
  data: checkData,
} = useAPI(singService.getArrayCheck);

export default function useService() {
  // Aquí puedes manejar errores globales, spinners o conversiones según sea necesario.
  return {
    isAuthSuccess,
    authExecute,
    authData,
    isTimetableSuccess,
    getTimetable,
    timetableData,
    isCurrentTimetableSuccess,
    getCurrentTimetable,
    currentTimetableData,
    isHolidaySuccess,
    getHoliday,
    holidayData,
    isVacationSuccess,
    getVacation,
    vacationData,
    issignInSuccess,
    issignInLoading,
    signIn,
    singInData,
    issignOutSuccess,
    signOut,
    singOutData,
    isArrayCheckSuccess,
    getArrayCheck,
    checkData,
    curretTimeTable,

  };
}
