import Types from "./types";
import Firebase from "@/services/Firebase";
import { LANG } from "@/utils/constants";

export default {
  namespaced: true,
  state: {
    languages: [],
    groups: [],
    selectedGroup: null,
    lang: LANG,
  },
  getters: {
    getGroups(state) {
      return state.groups;
    },
    getCurrentLang(state) {
      return state.lang;
    },
    getSelectedGroupName(state) {
      return state.selectedGroup;
    },
  },
  mutations: {
    [Types.SET_LANGUAGES](state, payload) {
      state.languages = payload;
    },
    [Types.SET_GROUPS](state, payload) {
      state.groups = payload;
    },
    [Types.SWITCH_LANGUAGE](state, payload) {
      state.lang = payload;
    },
    [Types.SET_SELECTED_GROUP_NAME](state, payload) {
      state.selectedGroup = payload;
    },
  },
  actions: {
    async addLanguage({ commit, rootState }, payload) {
      try {
        const { data, error } = await Firebase.addLanguage({
          userId: rootState.auth.user.uid,
          lang: payload.lang,
        });
        if (error) throw error;
        commit(Types.SET_LANGUAGES, data);
        payload.cb();
      } catch (err) {
        console.error(err);
      }
    },
    async setLanguages({ commit }, payloadId) {
      try {
        const { data, error } = await Firebase.getLanguages(payloadId);
        if (error) throw error;
        commit(Types.SET_LANGUAGES, data);
      } catch (err) {
        console.error(err);
      }
    },
    async setGroups({ commit, state }, payloadId) {
      try {
        const { data, error } = await Firebase.getGroups(state.lang, payloadId);
        if (error) throw error;
        commit(Types.SET_GROUPS, data);
      } catch (err) {
        console.error(err);
      }
    },
  },
};
