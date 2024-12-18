import axios from "axios";
import { useDateFormat, useNow } from "@vueuse/core";
const apikey =
  "APwXk+7JM7yvqHNNGeeBj8XSRq!$U*@-zKVtQfp_97DJL-bJ3vcW!!AfaTn!eBX47cYk+BPRa94p%e3ZEs2hpV2K=hrwcHsJasZLhX7ycgd6JJ+u4rw?eezAPKUv^TrB2aQXcJSj+Tv#nkL*CF+pm5gx$xGwSznZNZF#VZvfEmnMQ-KuM$D5zADEPS&V*Hah!DgE#-4qB7c25XaDnve_66a=WVBJtjrY^GUMztbuW3_2SdxfUs!TjuBL&Q$5!gHU";
const url = import.meta.env.VITE_BASE_API_URL;
const formatted = ref(useDateFormat(useNow(), "DD-MM-YYYY"));

//TODO: SACAR A .ENV

const singService = {
//ESTANDAR ES RESTFUL ... api rest (https://www.ibm.com/es-es/topics/rest-apis)
  //AXIOS REQUEST (HEADER, BODY, PARAMS) & RESPONSE (STATUS, CODE, MESSAGE, DATA...)


//POST crea --> recibe body
//PUT modifica --> recibe body
//GET lee --> NO recibe body
//DELETE borra (modifica) --> NO recibe body
//PATCH modifica parcialmente --> recibe body

  singIn: async (singInData, token) => 
    await axios.put(
      `${url}/checkin_noloc`,      
      { value: singInData },
      { headers: { "api-key": apikey, Authorization: token } },
    ),
  
  singOut : async (singOutData, token) =>       
    await axios.put(
      `${url}/checkout_noloc`, 
      { value: singOutData },
      { headers: { "api-key": apikey, Authorization: token } }
    ),
        
  getArrayCheck : async (company, id, formatted, token) =>      
    await axios.get(
    `${url}/admin/company/${company}/users/${id}/day/${formatted.value}}`,
    { headers: { "api-key": apikey, Authorization: token } }
    ),

      
}
export default singService;

