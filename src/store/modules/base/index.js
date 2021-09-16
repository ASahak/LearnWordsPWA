import Types from "./types";
import Firebase from "@/services/Firebase";
import { LANG } from "@/utils/constants";

export default {
  namespaced: true,
  state: {
    languages: [],
    groups: [],
    lang: LANG,
  },
  mutations: {
    [Types.SET_LANGUAGES](state, payload) {
      state.languages = payload;
    },
    [Types.SET_GROUPS](state, payload) {
      state.groups = payload;
    },
  },
  actions: {
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
