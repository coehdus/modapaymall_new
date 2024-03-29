import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import VueDaumPostcode from "vue-daum-postcode"
import { storage } from "./resources/storage/storage"
import { common } from '@/assets/js/common'

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
Vue.prototype.$pdt_img_url = ''
Vue.prototype.$server_url = process.env.VUE_APP_SERVER
Vue.prototype.$common = common

Vue.prototype.$bus = new Vue()

Vue.prototype.$shop_logo = '/images/' + process.env.VUE_APP_SHOP + '/' + process.env.VUE_APP_LOGO

let location = window.location.hostname

Vue.prototype.$https = 'https://' + location

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
