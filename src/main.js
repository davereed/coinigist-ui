import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import PubNubVue from 'pubnub-vue';
import VueTimeago from 'vue-timeago';
import VuePersist from 'vue-persist';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;
Vue.use(BootstrapVue);
Vue.use(PubNubVue, { subscribeKey: 'sub-7af71ec5-22e6-11e1-82e5-3fcb8e5ea403' });

Vue.use(VueTimeago, {
  name: 'Timeago', // Component name, `Timeago` by default
  locale: 'en', // Default locale
});

Vue.use(VuePersist);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
