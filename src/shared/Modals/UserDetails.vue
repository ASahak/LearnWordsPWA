<template>
  <div class="backdrop-wrapper">
    <div class="modal-container">
      <div v-if="state.modalContent === 'main'">
        <h3 class="title">{{ userDetails.displayName }}</h3>
        <p class="paragraphs" @click.stop="goToLangContent('add-language')">
          Add language
        </p>
        <p
          class="paragraphs"
          v-if="languages.length > 1"
          @click.stop="goToLangContent('switch-language')"
        >
          Switch language
        </p>
        <p class="paragraphs" @click.stop="logOut">Log out</p>
        <button class="btn btn--default modal-btn" @click.stop="closeDialog">
          Close
        </button>
      </div>
      <!-- ADD LANGUAGE CONTENT      -->
      <div v-else-if="state.modalContent === 'add-language'">
        <font-awesome-icon
          icon="arrow-left"
          @click.stop="goToMain"
          class="back-btn"
        />
        <p v-if="!userLangsForAdding">No Languages</p>
        <div v-else class="languages-list">
          <label
            v-for="lang in userLangsForAdding"
            :key="lang.value"
            class="languages-list__item"
          >
            <template v-if="currentLang !== lang.value">
              <input
                type="radio"
                name="language"
                :checked="state.checkedLang === lang.value"
                @change="setLanguage(lang.value)"
              />
              <p class="paragraphs">{{ lang.title }}</p>
            </template>
          </label>
          <div ref="indicatorRef" class="indicator-container">
            <button
              :disabled="!state.checkedLang"
              class="btn btn--default modal-btn"
              @click.stop="addLanguage"
            >
              {{ !state.isLoading ? "Add" : "" }}
            </button>
          </div>
        </div>
      </div>
      <!-- SWITCH LANGUAGE CONTENT      -->
      <div v-else-if="state.modalContent === 'switch-language'">
        <font-awesome-icon
          icon="arrow-left"
          @click.stop="goToMain"
          class="back-btn"
        />
        <div class="languages-list">
          <label
            v-for="lang in userLangsForSwitching"
            :key="lang.value"
            class="languages-list__item"
          >
            <input
              type="radio"
              name="language"
              :checked="currentLang === lang.value"
              @change="setLanguage(lang.value)"
            />
            <p class="paragraphs">{{ lang.title }}</p>
          </label>
          <loading-spinner :active="state.isLoading" dir="center">
            <button
              :disabled="
                !state.checkedLang || currentLang === state.checkedLang
              "
              class="btn btn--default modal-btn"
              @click.stop="switchLanguage"
            >
              {{ !state.isLoading ? "Switch" : "" }}
            </button>
          </loading-spinner>
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
import { LoadingSpinner } from "@/shared/UI";
import { LANG, LANGUAGES } from "@/utils/constants";

export default {
  name: "user-details-modal",
  components: {
    LoadingSpinner,
  },
  setup() {
    const store = useStore();
    const { dispatch } = store;

    const state = reactive({
      modalContent: "main",
      checkedLang: null,
      isLoading: false,
    });

    const router = useRouter();

    const userDetails = computed(() => {
      return store.state.auth?.user || {};
    });

    const currentLang = computed(() => {
      return store.state.base?.lang || LANG;
    });

    const userLangsForAdding = computed(() => {
      return getMutatedLangs("add");
    });

    const userLangsForSwitching = computed(() => {
      return getMutatedLangs("switch");
    });

    const languages = computed(() => {
      return store.state.base?.languages;
    });

    const getMutatedLangs = (type) => {
      if (!store.state.base?.languages) return null;
      return Object.keys(LANGUAGES).reduce((acc, item) => {
        if (
          type === "switch"
            ? store.state.base.languages.indexOf(item) > -1
            : store.state.base.languages.indexOf(item) === -1
        ) {
          acc.push({ value: item, title: LANGUAGES[item] });
        }
        return acc;
      }, []);
    };

    const logOut = () => {
      const { dispatch } = store;
      dispatch("auth/logout", () => {
        EmitterBus.$emit("toggle-modal", null);
        router.push("login");
      });
    };

    const goToLangContent = (contentType) => {
      state.modalContent = contentType;
    };

    const goToMain = () => {
      state.checkedLang = null;
      state.modalContent = "main";
    };

    const switchLanguage = () => {
      state.isLoading = true;
      dispatch("base/changeLanguage", {
        lang: state.checkedLang,
        cb: () => {
          dispatch("base/setGroups", userDetails.value.uid);
          state.isLoading = false;
          state.modalContent = "main";
          closeDialog();
        },
      });
    };

    const addLanguage = () => {
      state.isLoading = true;
      dispatch("base/addLanguage", {
        lang: state.checkedLang,
        cb: () => {
          state.isLoading = false;
          state.modalContent = "main";
        },
      });
    };

    const setLanguage = (v) => {
      state.checkedLang = v;
    };

    const closeDialog = () => {
      EmitterBus.$emit("toggle-modal", null);
    };

    return {
      state,
      userDetails,
      userLangsForAdding,
      userLangsForSwitching,
      languages,
      currentLang,
      logOut,
      goToLangContent,
      goToMain,
      addLanguage,
      switchLanguage,
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
  height: 28px;
}

.indicator-container {
  display: inline-block;
  float: right;
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
