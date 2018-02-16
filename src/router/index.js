import Vue from "vue";
import Router from "vue-router";
import Setup from "../components/Setup";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "Login",
      component: Setup
    }
  ]
});
