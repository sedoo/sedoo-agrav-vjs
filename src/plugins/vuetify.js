import '@fortawesome/fontawesome-free/css/all.css'
import '@mdi/font/css/materialdesignicons.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import '@mdi/js';
import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'mdiSvg' || 'mdi' || 'md' || 'fa',
  },
});
