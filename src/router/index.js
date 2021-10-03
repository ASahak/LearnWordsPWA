import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import ResetPassword from "../views/ResetPassword.vue";
import AddWord from "../views/AddWord.vue";
import Page404 from "../views/404.vue";
import AddGroup from "../views/AddGroup.vue";
import Firebase from "@/services/Firebase";

const routes = [
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: Page404,
  },
  {
    path: "/",
    name: "home",
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: "/register",
    name: "register",
    component: Register,
    meta: { ifLoggedRedirectToHome: true },
  },
  {
    path: "/reset-password",
    name: "reset-password",
    component: ResetPassword,
    meta: { ifLoggedRedirectToHome: true },
  },
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: { ifLoggedRedirectToHome: true },
  },
  {
    path: "/add-word",
    name: "add-word",
    component: AddWord,
    meta: { requiresAuth: true },
  },
  {
    path: "/add-group",
    name: "add-group",
    component: AddGroup,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const ifLoggedRedirectToHome = to.matched.some(
    (record) => record.meta.ifLoggedRedirectToHome
  );
  const user = await Firebase.getLoggedUser();
  if (!user) {
    if (requiresAuth) {
      next("login");
    } else {
      next();
    }
  } else {
    if (ifLoggedRedirectToHome) {
      next("/");
    } else {
      next();
    }
  }
});

export default router;
