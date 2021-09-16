import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import ResetPassword from "../views/ResetPassword.vue";
import Firebase from "@/services/Firebase";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: { ifLoggedRedirectToHome: true },
  },
  {
    path: "/reset-password",
    name: "ResetPassword",
    component: ResetPassword,
    meta: { ifLoggedRedirectToHome: true },
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { ifLoggedRedirectToHome: true },
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
