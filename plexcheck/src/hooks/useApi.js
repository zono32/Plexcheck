export default function useAPI(callback) {
  const state = reactive({
    isLoading: false,
    isError: false,
    isSuccess: false,
    errorMessage: "",
  });
  const data = ref();

  const fetchData = async (...param) => {
    try {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = true;
      state.errorMessage = "";
      data.value = (await callback(...param));
      state.isSuccess = true;
    } catch (error) {
      //console.log(data.value)
      console.error("Error en fetchData:", error.response ? error.response.data : error.message);
      state.errorMessage = error.response ? error.response.data : error.message;
      state.isError = true;
    } finally {
      state.isLoading = false;
      //console.log(data.value)
    }
  };
  

  const execute = async (...params) => await fetchData(...params);
  return {
    execute,
    ...toRefs(state),
    data,
  };
}
