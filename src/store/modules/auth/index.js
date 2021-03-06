import Types from "./types";
import BaseTypes from "@/store/modules/base/types";
import Firebase from "@/services/Firebase";

export default {
  namespaced: true,
  state: {
    user: null,
  },
  getters: {
    getUserId(state) {
      return state.user?.uid;
    },
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
        commit("base/" + BaseTypes.SET_WORDS, [], { root: true });
        commit("base/" + BaseTypes.SET_LANGUAGES, [], { root: true });
        commit("base/" + BaseTypes.SET_GROUPS, [], { root: true });
        commit("base/" + BaseTypes.SET_SELECTED_GROUP_NAME, null, {
          root: true,
        });
        commit("base/" + BaseTypes.SET_LANGUAGE, null, { root: true });
        commit("base/" + BaseTypes.SET_WORDS_PAGES_COUNT, null, { root: true });
        commit("base/" + BaseTypes.SET_STILL_GETTING_WORDS, true, {
          root: true,
        });
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
          if (payload.byRoot) return {};
          const data = await Firebase.loginUser({ ...payload });
          if (data.error) throw data.error;
          userData = data;
        }
        commit(Types.SET_USER_DATA, userData);
        const isLangError = await dispatch("base/getLanguage", userData.uid, {
          root: true,
        });
        const isLanguagesError = await dispatch(
          "base/setLanguages",
          userData.uid,
          {
            root: true,
          }
        );
        const isGroupError = await dispatch("base/setGroups", userData.uid, {
          root: true,
        });
        if (isLangError.error || isLanguagesError.error || isGroupError.error)
          throw (
            isLangError.error || isGroupError.error || isLanguagesError.error
          );
        return {};
      } catch (err) {
        console.error(err);
        return { error: err };
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
    async addWord({ state, rootState }, payload) {
      const { lang, arm, groupName } = payload;
      const { error, data } = await Firebase.addWord(
        rootState.base.lang,
        lang,
        arm,
        state.user.uid,
        groupName
      );
      return { error, data };
    },
    async addGroup({ state, commit, rootState }, payload) {
      const { groupName } = payload;
      const { error, data } = await Firebase.addGroup(
        rootState.base.lang,
        groupName,
        state.user.uid
      );
      if (!error) {
        commit(
          "base/" + BaseTypes.SET_GROUPS,
          [...(rootState.base.groups || []), groupName],
          { root: true }
        );
      }
      return { error, data };
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
