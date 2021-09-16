import { createStore } from "vuex";
import AuthState from "./modules/auth";
import BaseState from "./modules/base";

export default createStore({
  modules: {
    auth: AuthState,
    base: BaseState,
  },
});
