import { createApp } from 'vue';
import App from './App.vue';
import { createVuetify } from 'vuetify';
//import Calendar from 'v-calendar';
import 'vuetify/styles';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import '@mdi/font/css/materialdesignicons.css'
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import './assets/main.css';
import router from './router.js';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
});

const app = createApp(App);
app.use(vuetify);
app.use(router);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(pinia);

//app.use(Calendar, {});

app.mount('#app');


// import { createApp } from 'vue';
// import App from './App.vue';
// import vuetify from './plugins/vuetify'; // Usa la configuración de Vuetify desde vuetify.js
// import 'vuetify/styles';
// import './assets/main.css';
// import router from './router.js';
// import { createPinia } from 'pinia';
// import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

// // Configura Pinia
// const pinia = createPinia();
// pinia.use(piniaPluginPersistedstate);

// // Crea la app
// const app = createApp(App);

// app.use(vuetify); // Usa Vuetify
// app.use(router);  // Usa el router
// app.use(pinia);   // Usa Pinia

// app.mount('#app'); // Monta la app
