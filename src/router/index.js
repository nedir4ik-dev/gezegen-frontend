import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import TicketsView from "../views/TicketsView.vue";

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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
