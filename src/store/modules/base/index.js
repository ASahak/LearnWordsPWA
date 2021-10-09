import Types from "./types";
import Firebase from "@/services/Firebase";
import { LANG, BASE } from "@/utils/constants";

export default {
  namespaced: true,
  state: {
    languages: [],
    groups: [],
    selectedGroup: null,
    lang: LANG,
    words: [],
    wordsCount: null,
    stillGetting: true,
  },
  getters: {
    getStillGetting(state) {
      return state.stillGetting;
    },
    getGroups(state) {
      return state.groups;
    },
    getCurrentLang(state) {
      return state.lang;
    },
    getSelectedGroupName(state) {
      return state.selectedGroup;
    },
    getWordsCount(state) {
      return state.wordsCount;
    },
    getFilteredList:
      (state) =>
      ({ page, filters }) => {
        // console.log(page, filters, "GETTERS");
        let words = [...state.words];
        if (filters.isGroup) {
          words = words.filter((e) => e.groupName === filters.key);
        } else if (filters.key === "learned") {
          words = words.filter((e) => e.isLearned);
        } else if (filters.key === "not-learned") {
          words = words.filter((e) => !e.isLearned);
        } else if (filters.key === "z-a") {
          words = words.sort((a, b) => {
            if (a[state.lang] > b[state.lang]) {
              return -1;
            }
            if (a[state.lang] < b[state.lang]) {
              return 1;
            }
            return 0;
          });
        } else if (filters.key === "a-z") {
          words = words.sort((a, b) => {
            if (a[state.lang] < b[state.lang]) {
              return -1;
            }
            if (a[state.lang] > b[state.lang]) {
              return 1;
            }
            return 0;
          });
        } else if (filters.key === "increase-date") {
          words = words.sort((a, b) => {
            if (a.publication < b.publication) {
              return -1;
            }
            if (a.publication > b.publication) {
              return 1;
            }
            return 0;
          });
        } else if (filters.key === "decrease-date") {
          words = words.sort((a, b) => {
            if (a.publication > b.publication) {
              return -1;
            }
            if (a.publication < b.publication) {
              return 1;
            }
            return 0;
          });
        }
        if (filters.searchValue) {
          words = words.filter(
            (e) =>
              (e[state.lang] || "")
                .toLowerCase()
                .indexOf((filters.searchValue || "").toLowerCase()) > -1 ||
              (e.arm || "")
                .toLowerCase()
                .indexOf((filters.searchValue || "").toLowerCase()) > -1
          );
        }
        return {
          length: words.length,
          data: words.splice(--page * BASE.listLimit, BASE.listLimit),
        };
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
    [Types.SET_WORDS](state, payload) {
      state.words = payload;
    },
    [Types.UPDATE_WORD](state, payload) {
      const wordsClone = [...state.words];
      const findItemIndex = wordsClone.findIndex(
        (e) => e.publication === payload.publication
      );
      if (findItemIndex > -1) {
        wordsClone[findItemIndex] = {
          isLearned: payload.isLearned,
          groupName: payload.groupName,
          [payload.lang]: payload.word1,
          arm: payload.word2,
          publication: payload.publication,
        };
      }
      state.words = wordsClone;
    },
    [Types.SET_WORDS_PAGE_COUNT](state, payload) {
      state.wordsCount = payload;
    },
    [Types.SET_STILL_GETTING_WORDS](state, payload) {
      state.stillGetting = payload;
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
        return {};
      } catch (err) {
        console.error(err);
        return { error: err };
      }
    },
    async setGroups({ commit, state }, payloadId) {
      try {
        const { data, error } = await Firebase.getGroups(state.lang, payloadId);
        if (error) throw error;
        commit(Types.SET_GROUPS, data);
        return {};
      } catch (err) {
        console.error(err);
        return { error: err };
      }
    },
    async getList({ state, rootState, commit }) {
      try {
        const { error, words } = await Firebase.getList(
          rootState.auth.user.uid,
          state.lang
        );
        if (error) throw error;
        commit(
          Types.SET_WORDS_PAGE_COUNT,
          Math.ceil(words.length / BASE.listLimit)
        );
        commit(Types.SET_WORDS, words);
        return {};
      } catch (err) {
        console.error(err);
        return { error: err };
      } finally {
        commit(Types.SET_STILL_GETTING_WORDS, false);
      }
    },
    async updateWord({ commit }, payload) {
      try {
        const { error } = await Firebase.updateWord({ ...payload });
        if (error) throw error;
        commit(Types.UPDATE_WORD, { ...payload });
        return {};
      } catch (err) {
        console.error(err);
        return { error: err };
      }
    },
  },
};
