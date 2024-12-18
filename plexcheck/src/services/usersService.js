import axios from "axios";
const apikey =
  "APwXk+7JM7yvqHNNGeeBj8XSRq!$U*@-zKVtQfp_97DJL-bJ3vcW!!AfaTn!eBX47cYk+BPRa94p%e3ZEs2hpV2K=hrwcHsJasZLhX7ycgd6JJ+u4rw?eezAPKUv^TrB2aQXcJSj+Tv#nkL*CF+pm5gx$xGwSznZNZF#VZvfEmnMQ-KuM$D5zADEPS&V*Hah!DgE#-4qB7c25XaDnve_66a=WVBJtjrY^GUMztbuW3_2SdxfUs!TjuBL&Q$5!gHU";
const url = import.meta.env.VITE_BASE_API_URL;

const usersService = {
  getTimetable: async (company, id, token) => {
    return await axios
      .get(`${url}/admin/company/${company}/users/${id}/timetable`, {
        headers: { "api-key": apikey, Authorization: token },
      })
      .then((response) => response.data); // Se asegura de retornar los datos
  },

  getCurrentTimetable: async (company, id, token) => {
    const response = await axios.get(
      `${url}/admin/company/${company}/timetable/${id}`,
      { headers: { "api-key": apikey, Authorization: token } }
    );
    return response.data;
  },

  getHoliday: async (company, locality, token) => {
    return await axios
      .get(`${url}/admin/company/${company}/locality/${locality}/holidays`, {
        headers: { "api-key": apikey, Authorization: token },
      })
      .then((response) => response.data);
  },

  getVacation: async (company, id, token) => {
    const currentYear = new Date().getFullYear();
    return await axios
      .get(
        `${url}/vacations/company/${company}/user/${id}?begin=${currentYear}-01-01&end=${currentYear}-12-31`,
        { headers: { "api-key": apikey, Authorization: token } }
      )
      .then((response) => response.data);
  },
};

export default usersService;
