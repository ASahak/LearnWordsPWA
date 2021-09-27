import Types from "./types";
import Firebase from "@/services/Firebase";

export default {
  namespaced: true,
  state: {
    user: null,
  },
  mutations: {
    [Types.SET_USER_DATA](state, payload) {
      state.user = payload;
    },
  },
  actions: {
    async logout({ commit }, payloadCallBack) {
      try {
        await Firebase.logOut();
        commit(Types.SET_USER_DATA, null);
        payloadCallBack();
      } catch (err) {
        console.error(err);
      }
    },
    async setUserData({ commit, dispatch }, payload) {
      try {
        let userData = null;
        const loggedUser = await Firebase.getLoggedUser();
        if (loggedUser) {
          const { displayName, uid } = loggedUser;
          userData = { displayName, uid };
        } else {
          if (payload.byRoot) return;
          const data = await Firebase.loginUser({ ...payload });
          if (data.error) throw data.error;
          userData = data;
        }
        commit(Types.SET_USER_DATA, userData);
        dispatch("base/setLanguages", userData.uid, { root: true });
        dispatch("base/setGroups", userData.uid, { root: true });
      } catch (err) {
        console.error(err);
      }
    },
    async registerUser(_ctx, payload) {
      try {
        const { email, password, username } = payload;
        return await Firebase.registerUser({
          email,
          password,
          username,
        });
      } catch (err) {
        console.error(err);
      }
    },
    async resetPassword(_ctx, payload) {
      try {
        const { email } = payload;
        return await Firebase.passwordReset(email);
      } catch (err) {
        console.error(err);
      }
    },
  },
};
