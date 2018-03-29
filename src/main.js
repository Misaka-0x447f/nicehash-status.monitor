// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./host";
import router from "./router";

import MdProgress from "vue-material";

Vue.use(MdProgress);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
    el: "#app",
    router,
    components: {App},
    template: "<App/>"
});
