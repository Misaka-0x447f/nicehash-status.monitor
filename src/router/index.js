import Vue from "vue";
import Router from "vue-router";
import SetupIndex from "../components/Setup/Index";
import GeneralInfoIndex from "../components/GeneralInfo/Index";

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: "/",
            name: "general-info-index",
            component: GeneralInfoIndex
        },
        {
            path: "/setup",
            name: "setup-index",
            component: SetupIndex
        }
    ]
});
