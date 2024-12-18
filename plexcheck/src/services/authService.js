import axios from 'axios';
const apikey = 'APwXk+7JM7yvqHNNGeeBj8XSRq!$U*@-zKVtQfp_97DJL-bJ3vcW!!AfaTn!eBX47cYk+BPRa94p%e3ZEs2hpV2K=hrwcHsJasZLhX7ycgd6JJ+u4rw?eezAPKUv^TrB2aQXcJSj+Tv#nkL*CF+pm5gx$xGwSznZNZF#VZvfEmnMQ-KuM$D5zADEPS&V*Hah!DgE#-4qB7c25XaDnve_66a=WVBJtjrY^GUMztbuW3_2SdxfUs!TjuBL&Q$5!gHU';
const url = import.meta.env.VITE_BASE_API_URL;

const authService = {
 getToken : async (tokenData) =>
  await axios.put(
    `${url}/admin/login`,
    { value: tokenData },
    { headers: { "api-key": apikey } }
  )
}
export default authService;
