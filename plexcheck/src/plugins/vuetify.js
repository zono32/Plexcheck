import { createVuetify } from 'vuetify';
import { VCalendar } from 'vuetify/labs/VCalendar';
import 'vuetify/styles';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import es from 'vuetify/lib/locale/es';


import '@mdi/font/css/materialdesignicons.css';

import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

// Crea la instancia de Vuetify con toda la configuración
const vuetify = createVuetify({
  components: {
    VCalendar, 
  },
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
  theme: {
    themes: {
      light: {
        primary: '#42a5f5',
        secondary: '#e91e63',
        accent: '#ff5722',
      },
    },
  },
  locale: {
    current: 'es', // Establece el idioma en español
  },
  lang: {
    locales: { es },
    current: 'es', // Asegúrate de que el idioma esté correctamente asignado
  },
});

export default vuetify;
