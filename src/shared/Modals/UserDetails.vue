<template>
  <div class="backdrop-wrapper">
    <div class="modal-container">
      <div v-if="state.modalContent === 'main'">
        <h3 :class="classes.title">{{ userDetains?.displayName }}</h3>
        <p :class="classes.paragraphs" @click="goToAddLang">Add language</p>
        <p :class="classes.paragraphs" v-if="languages.length > 1">
          Switch language
        </p>
        <p :class="classes.paragraphs" @click="logOut">Log out</p>
        <button
          :class="[gClasses['btn-default'], classes['modal-btn']]"
          @click="closeDialog"
        >
          Close
        </button>
      </div>
      <div v-else-if="state.modalContent === 'add-language'">
        <font-awesome-icon
          icon="arrow-left"
          @click="goToMain"
          :class="classes['back-btn']"
        />
        <p v-if="!userLangsForAdding">No Languages</p>
        <div v-else :class="classes['languages-list']">
          <label
            v-for="lang in userLangsForAdding"
            :key="lang.value"
            :class="classes['languages-list__item']"
          >
            <input
              type="radio"
              name="language"
              :checked="state.checkedLang === lang.value"
              @change="setLanguage(lang.value)"
            />
            <p :class="classes.paragraphs">{{ lang.title }}</p>
          </label>
          <button
            :disabled="!state.checkedLang"
            :class="[gClasses['btn-default'], classes['modal-btn']]"
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
import { createUseStyles } from "vue-jss";
import EmitterBus from "@/utils/eventBus";
import { LANGUAGES } from "@/utils/constants";

const useStyles = createUseStyles({
  title: {
    textAlign: "left",
    marginTop: 10,
  },
  paragraphs: {
    textAlign: "left",
    cursor: "pointer",
    margin: "8px 0",
  },
  "back-btn": {
    cursor: "pointer",
  },
  "modal-btn": {
    marginLeft: "auto",
    display: "block",
  },
  "languages-list": {
    paddingTop: 10,
    "& p": {
      margin: "5px 10px",
    },
  },
  "languages-list__item": {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    "& input": {
      cursor: "pointer",
      margin: 0,
    },
  },
});

export default {
  name: "user-details-modal",
  setup() {
    const state = reactive({
      modalContent: "main",
      checkedLang: null,
    });

    const store = useStore();
    const classes = useStyles();
    const router = useRouter();

    const userDetains = computed(() => {
      return store.state.auth?.user;
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
      classes,
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
