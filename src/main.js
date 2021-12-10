import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import VueDaumPostcode from "vue-daum-postcode"
import { storage } from "./resources/storage/storage"

Vue.config.productionTip = false

Vue.use(VueDaumPostcode)


if(window.location.href.indexOf(process.env.VUE_APP_DOMAIN) > -1){
  Vue.prototype.$production = true
  Vue.prototype.$production_title = process.env.VUE_APP_TITLE
}else{
  Vue.prototype.$production = false
  Vue.prototype.$production_title = process.env.VUE_APP_TITLE_DEV
}

Vue.prototype.$storage = storage

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
