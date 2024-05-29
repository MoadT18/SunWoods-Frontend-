import Vue from 'vue';
import App from './App.vue';
import VueRouter from 'vue-router';
import './assets/tailwind.css';
import VCalendar from 'v-calendar';

// Import the Auth0 configuration
import { domain, clientId } from '../auth_config.json';

// Import the plugin here
import { Auth0Plugin } from './auth';
import router from './router'; // Import the router instance

Vue.use(VueRouter);

Vue.use(VCalendar, {
  componentPrefix: 'vc',
});

// Install the authentication plugin here
Vue.use(Auth0Plugin, {
  domain,
  clientId,
  onRedirectCallback: appState => {
    router.push(
      appState && appState.targetUrl
        ? appState.targetUrl
        : window.location.pathname
    ).catch(err => {
      if (err.name !== 'NavigationDuplicated') {
        throw err;
      }
    });
  }
});

Vue.config.productionTip = false;

new Vue({
  router, // Inject the router into your Vue instance
  render: h => h(App)
}).$mount('#app');
