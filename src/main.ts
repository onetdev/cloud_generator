import Vue from "vue";
import BootstrapVue from "bootstrap-vue";
import App from "./App.vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faSync,
  faDice,
  faCloudDownloadAlt,
  faHistory
} from "@fortawesome/free-solid-svg-icons";
import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import "./app.scss";

Vue.config.productionTip = false;
Vue.use(BootstrapVue);

library.add(faQuestionCircle);
library.add(faSync);
library.add(faDice);
library.add(faCloudDownloadAlt);
library.add(faHistory);
Vue.component("font-awesome-icon", FontAwesomeIcon);

new Vue({
  render: h => h(App)
}).$mount("#app");
