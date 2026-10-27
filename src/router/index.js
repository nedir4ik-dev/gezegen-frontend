import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import TicketsView from "../views/TicketsView.vue";
import AboutView from "../views/AboutView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/tickets",
    name: "tickets",
    component: TicketsView,
  },
  {
    path: "/about",
    name: "about",
    component: AboutView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
