import './assets/main.scss';
import 'primeicons/primeicons.css';
import 'tippy.js/dist/tippy.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import VueTippy from 'vue-tippy';

import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(VueTippy, {
  defaultProps: {
    placement: 'top',
    arrow: true,
  },
});
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      prefix: 'p',
      darkModeSelector: 'none',
    },
  },
});

app.mount('#app');
