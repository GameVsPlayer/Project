import '@fortawesome/fontawesome-free/css/all.min.css'
import 'bootstrap-css-only/css/bootstrap.min.css'
import 'mdbvue/lib/css/mdb.min.css'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueAnalytics from 'vue-analytics'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserSecret } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import VueMeta from 'vue-meta'
import { VueReCaptcha } from 'vue-recaptcha-v3'
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueReCaptcha, { siteKey: '6LeJA8oUAAAAAKbysPFsF4Y-3aFnyPNgiWBLfPe7', theme: 'dark' })
Vue.use(VueAxios, axios)

Vue.use(VueMeta, {
  keyName: 'metaInfo',
  ssrAttribute: 'data-vue-meta-server-rendered',
  tagIDKeyName: 'vmid',
  refreshOnceOnNavigation: true
})

library.add(faUserSecret)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')


router.afterEach((to) => {
  Vue.nextTick(() => {
    let headTitle = document.querySelector('head');
    let setFavicon = document.createElement('link');
    let manifest = document.createElement('link');
    manifest.setAttribute('rel', 'manifest');
    manifest.setAttribute('href', '/manifest.json');
    setFavicon.setAttribute('rel', 'shortcut icon');
    setFavicon.setAttribute('href', '/favicon.png');
    headTitle.appendChild(setFavicon);
    headTitle.appendChild(manifest);
    if (to.matched[0].components.default.name === 'PageNotFound') {
      store.commit('setError', true);
    } else {
      store.commit('setError', false);
    }
  });
})

Vue.use(VueAnalytics, {
  id: "UA-150630037-1",
  checkDuplicatedScript: true,
  router
})