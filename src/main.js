// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import Host from "./host";
import router from "./router";

import MdProgress from "vue-material";

Vue.use(MdProgress);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
    el: "#host",
    router,
    components: {Host},
    template: "<Host/>"
});
