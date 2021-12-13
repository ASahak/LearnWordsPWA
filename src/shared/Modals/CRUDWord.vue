<template>
  <div class="backdrop-wrapper">
    <div class="modal-container">
      <WordExamples
        :word="exampleWordValue"
        v-if="exampleWordValue"
        @goBackCRUD="goBackFromExample"
      />
      <div v-else>
        <h3 class="title" v-if="!state.groupView">
          Edit word
          <span
            class="lnr lnr-cross modal-close-icon"
            @click.stop="closeDialog"
          ></span>
        </h3>
        <font-awesome-icon
          v-else
          icon="arrow-left"
          @click.stop="goBack"
          class="back-btn"
        />
        <div v-if="!state.groupView">
          <div
            :class="[
              'input-container',
              { 'error-field': v$.lang.$error || state.ifExistingSameWord },
            ]"
          >
            <label>{{ currentLangCapitalize }}</label>
            <font-awesome-icon icon="file-word" class="input-icon" />
            <input
              name="text-lang"
              type="text"
              :placeholder="'Type the word by ' + currentLang"
              v-model="state.lang"
              @keyup="debounce(checkExisting, 500)"
            />
            <p
              v-if="v$.lang.$error || state.ifExistingSameWord"
              class="error-msg"
            >
              {{ v$.lang.$errors[0]?.$message || state.ifExistingSameWord }}
            </p>
          </div>
          <div :class="['input-container', { 'error-field': v$.arm.$error }]">
            <label>Arm</label>
            <font-awesome-icon icon="file-word" class="input-icon" />
            <input
              name="text-lang"
              type="text"
              placeholder="Type the word by arm"
              v-model="state.arm"
            />
            <p v-if="v$.arm.$error" class="error-msg">
              {{ v$.arm.$errors[0].$message }}
            </p>
          </div>
          <div
            class="like-input-container"
            @click.stop="goToGroupView"
            v-if="groups.length"
          >
            <label>Group name</label>
            <p :class="{ 'value--selected': state.groupName }">
              <font-awesome-icon icon="object-group" class="input-icon" />
              {{ state.groupName || "Choose group name" }}
              <span
                v-if="state.groupName"
                class="lnr lnr-cross cancel-value"
                @click.stop="resetGroupName"
              ></span>
            </p>
          </div>
          <div class="like-input-container input--date-created">
            <label>Date created</label>
            <p :class="{ 'value--selected': dataWord.publication }">
              <font-awesome-icon icon="calendar-day" class="input-icon" />
              {{ format(dataWord.publication, "DD/MM/YY") }}
            </p>
          </div>
          <label for="learned" class="input-like-label-checkbox">
            <input
              type="checkbox"
              id="learned"
              :checked="dataWord.isLearned"
              v-model="state.isLearned"
            />
            I have learned this already
          </label>
          <b class="examples-btn" @click.stop="goToExamples">EXAMPLES</b>
          <div class="modal-actions-wrapper">
            <loading-spinner :active="state.isDeleting" dir="center">
              <button
                class="btn btn--danger modal-btn"
                @click.stop="deleteWord"
              >
                {{ state.isDeleting ? "" : "Delete" }}
              </button>
            </loading-spinner>
            <loading-spinner :active="state.isUpdating" dir="center">
              <button
                class="btn btn--default modal-btn"
                @click.stop="updateWord"
              >
                {{ state.isUpdating ? "" : "Update" }}
              </button>
            </loading-spinner>
          </div>
        </div>
        <div class="group-list" v-else>
          <div class="groups-list">
            <label
              v-for="groupName in groups"
              :key="groupName"
              class="groups-list__item"
            >
              <input
                type="radio"
                name="group-name"
                :checked="state.groupName === groupName"
                @change="changeGroupName(groupName)"
              />
              <p class="paragraphs">{{ groupName }}</p>
            </label>
          </div>
          <div class="modal-actions-wrapper">
            <button
              :disabled="!state.groupName"
              class="btn btn--default modal-btn"
              @click.stop="selectGroupName"
            >
              Select
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { computed, reactive, toRef, watch } from "vue";
import { useStore } from "vuex";
import useVuelidate from "@vuelidate/core";
import { createToast } from "mosha-vue-toastify";
import { required } from "@vuelidate/validators";
import { format } from "date-fns";
import { LANG } from "@/utils/constants";
import { createDebounce } from "@/utils/handlers";
import { LoadingSpinner } from "@/shared/UI";
import Firebase from "@/services/Firebase";
import EmitterBus from "@/utils/eventBus";
import WordExamples from "@/shared/Modals/WordExamples";
import Types from "@/store/modules/base/types";

export default {
  name: "crud-word-modal",
  components: {
    LoadingSpinner,
    WordExamples,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();
    const dataWord = toRef(props, "data");

    const state = reactive({
      lang: "",
      arm: "",
      groupName: null,
      ifExistingSameWord: null,
      isUpdating: false,
      isDeleting: false,
      isLearned: false,
      groupView: false,
    });

    const currentLang = computed(() => {
      return store.getters["base/getCurrentLang"] || LANG;
    });

    const exampleWordValue = computed(() => {
      return store.getters["base/getExampleWordTitle"];
    });

    const groups = computed(() => {
      return store.getters["base/getGroups"] || [];
    });

    const currentLangCapitalize = computed(() => {
      return (
        currentLang.value.charAt(0).toUpperCase() + currentLang.value.slice(1)
      );
    });

    watch(
      () => [dataWord.value, currentLang.value],
      () => {
        state.lang = dataWord.value[currentLang.value];
        state.arm = dataWord.value.arm;
        state.groupName = dataWord.value.groupName;
        state.isLearned = dataWord.value.isLearned;
      },
      { immediate: true }
    );

    const userId = computed(() => {
      return store.getters["auth/getUserId"];
    });

    const rules = computed(() => ({
      arm: { required },
      lang: { required },
    }));

    const changeGroupName = (groupName) => {
      state.groupName = groupName;
    };

    const selectGroupName = () => {
      state.groupView = false;
    };

    const closeDialog = () => {
      EmitterBus.$emit("toggle-modal", null);
    };

    const goBack = () => {
      state.groupName = dataWord.value.groupName;
      state.groupView = false;
    };
    const resetGroupName = () => {
      state.groupName = null;
    };

    const goToGroupView = () => {
      state.groupView = true;
    };

    const checkExisting = async () => {
      try {
        if (state.lang === dataWord.value[currentLang.value]) return;
        const { error } = await Firebase.checkExistingWord(
          currentLang.value,
          state.lang,
          userId.value
        );
        if (error) throw error;
        state.ifExistingSameWord = null;
      } catch (err) {
        console.error(err);
        state.ifExistingSameWord = err.message || err;
      }
    };

    const deleteWord = async () => {
      try {
        state.isDeleting = true;
        const { error } = await store.dispatch("base/deleteWord", {
          userId: userId.value,
          publication: dataWord.value.publication,
          lang: currentLang.value,
        });
        if (error) throw error;
        EmitterBus.$emit("toggle-modal", null);
      } catch (err) {
        createToast(err.message || err, {
          type: "danger",
          hideProgressBar: true,
        });
      } finally {
        state.isDeleting = false;
      }
    };

    const goToExamples = () => {
      store.dispatch("base/getWordExamples", state.lang);
    };

    const goBackFromExample = () => {
      store.commit("base/" + Types.SET_EXAMPLE_WORDS, {
        value: null,
        list: [],
        status: "not-fulfilled",
      });
    };

    const updateWord = async () => {
      try {
        const { isLearned, arm, lang, groupName } = state;
        state.isUpdating = true;
        const { error } = await store.dispatch("base/updateWord", {
          isLearned,
          word1: lang.toLowerCase(),
          word2: arm.toLowerCase(),
          groupName,
          userId: userId.value,
          publication: dataWord.value.publication,
          lang: currentLang.value,
        });
        if (error) throw error;
        EmitterBus.$emit("toggle-modal", null);
      } catch (err) {
        createToast(err.message || err, {
          type: "danger",
          hideProgressBar: true,
        });
      } finally {
        state.isUpdating = false;
      }
    };

    const v$ = useVuelidate(rules, state);

    return {
      dataWord,
      v$,
      currentLang,
      groups,
      checkExisting,
      changeGroupName,
      selectGroupName,
      goToGroupView,
      goBack,
      closeDialog,
      updateWord,
      deleteWord,
      resetGroupName,
      goToExamples,
      goBackFromExample,
      exampleWordValue,
      format,
      state,
      currentLangCapitalize,
      debounce: createDebounce(),
    };
  },
};
</script>
<style lang="scss" scoped>
.modal-close-icon {
  position: absolute;
  right: 10px;
  font-weight: 900;
  cursor: pointer;
  font-size: 18px;
}

.modal-actions-wrapper {
  margin: 20px 0 5px;
  display: flex;
  justify-content: flex-end;
  & .btn {
    height: 100%;
  }
  & .btn--danger {
    margin-right: 10px;
  }
}

.examples-btn {
  margin: 16px 0 0;
  display: block;
  font-size: 13px;
  text-decoration: underline;
  font-style: italic;
  cursor: pointer;
}

.title {
  text-align: left;
  margin-top: 10px;
  margin-bottom: 10px;
}

.like-input-container {
  @extend .input-container_extend;
  & > p {
    cursor: pointer;
    border: none;
    margin: 0;
    font-size: 13px;
    border-bottom: 2px solid #3333;
    width: 100%;
    outline: none;
    color: rgb(117, 117, 117);
    padding: 10px 10px 10px 30px;
    position: relative;
    & .cancel-value {
      font-size: 13px;
      position: absolute;
      right: 5px;
      font-weight: 900;
      cursor: pointer;
      top: 0;
      bottom: 0;
      margin: auto;
      height: 13px;
    }
    &.value--selected {
      color: #000;
    }
  }
  &.input--date-created {
    & > p {
      cursor: not-allowed;
      color: #a5a0a0;
    }
  }
}

.input-like-label-checkbox {
  font-size: 14px;
  line-height: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  & input {
    width: 15px;
    height: 15px;
    margin: 0 10px 0 0;
  }
}

.groups-list {
  margin: 10px 0;
  max-height: 250px;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    width: 4px;
    background-color: #efefef;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: #c9c9d3;
  }
  & p {
    margin: 5px 10px;
  }
}

.groups-list__item {
  display: flex;
  align-items: center;
  cursor: pointer;
  & input {
    cursor: pointer;
    margin: 0;
  }
}

.back-btn {
  margin-top: 10px;
  cursor: pointer;
}
</style>
