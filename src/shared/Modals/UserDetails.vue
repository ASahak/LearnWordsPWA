<template>
  <div class="backdrop-wrapper">
    <div class="modal-container">
      <div v-if="state.modalContent === 'main'">
        <h3 class="title">{{ userDetains?.displayName }}</h3>
        <p class="paragraphs" @click="goToAddLang">Add language</p>
        <p class="paragraphs" v-if="languages.length > 1">Switch language</p>
        <p class="paragraphs" @click="logOut">Log out</p>
        <button class="btn-default modal-btn" @click="closeDialog">
          Close
        </button>
      </div>
      <div v-else-if="state.modalContent === 'add-language'">
        <font-awesome-icon
          icon="arrow-left"
          @click="goToMain"
          class="back-btn"
        />
        <p v-if="!userLangsForAdding">No Languages</p>
        <div v-else class="languages-list">
          <label
            v-for="lang in userLangsForAdding"
            :key="lang.value"
            class="languages-list__item"
          >
            <template v-if="currentLang !== lang">
              <input
                type="radio"
                name="language"
                :checked="state.checkedLang === lang.value"
                @change="setLanguage(lang.value)"
              />
              <p class="paragraphs">{{ lang.title }}</p>
            </template>
          </label>
          <button
            :disabled="!state.checkedLang"
            class="btn-default modal-btn"
            @click="addLanguage"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { computed, reactive } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import EmitterBus from "@/utils/eventBus";
import { LANG, LANGUAGES } from "@/utils/constants";

export default {
  name: "user-details-modal",
  setup() {
    const store = useStore();
    const state = reactive({
      modalContent: "main",
      checkedLang: null,
    });

    const router = useRouter();

    const userDetains = computed(() => {
      return store.state.auth?.user;
    });

    const currentLang = computed(() => {
      return store.state.base?.lang || LANG;
    });

    const userLangsForAdding = computed(() => {
      if (!store.state.base?.languages) return null;
      return Object.keys(LANGUAGES).reduce((acc, item) => {
        if (store.state.base.languages.indexOf(item) === -1) {
          acc.push({ value: item, title: LANGUAGES[item] });
        }
        return acc;
      }, []);
    });

    const languages = computed(() => {
      return store.state.base?.languages;
    });

    const logOut = () => {
      const { dispatch } = store;
      dispatch("auth/logout", () => {
        EmitterBus.$emit("toggle-modal", null);
        router.push("login");
      });
    };

    const goToAddLang = () => {
      state.modalContent = "add-language";
    };

    const goToMain = () => {
      state.modalContent = "main";
    };

    const addLanguage = () => {
      console.log("addLanguage");
    };

    const setLanguage = (v) => {
      state.checkedLang = v;
    };

    const closeDialog = () => {
      EmitterBus.$emit("toggle-modal", null);
    };

    return {
      state,
      userDetains,
      userLangsForAdding,
      languages,
      currentLang,
      logOut,
      goToAddLang,
      goToMain,
      addLanguage,
      setLanguage,
      closeDialog,
    };
  },
};
</script>
<style lang="scss" scoped>
.title {
  text-align: left;
  margin-top: 10px;
}

.paragraphs {
  text-align: left;
  cursor: pointer;
  margin: 8px 0;
}

.back-btn {
  cursor: pointer;
}

.modal-btn {
  margin-left: auto;
  display: block;
}

.languages-list {
  padding-top: 10px;
  & p {
    margin: 5px 10px;
  }
}

.languages-list__item {
  display: flex;
  align-items: center;
  cursor: pointer;
  & input {
    cursor: pointer;
    margin: 0;
  }
}
</style>
