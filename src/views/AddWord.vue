<template>
  <div class="main-view-grid">
    <NavigationHeader title="Add word" prev="/" />
    <div class="entry-container">
      <div class="title-container">
        <h1>Add word</h1>
        <p>Add word and let's learn it together</p>
      </div>
      <form @submit.prevent="onSubmit" class="grid-view__form">
        <font-awesome-icon icon="book" class="entry-icon" />
        <div
          :class="[
            'input-container checking-same-word-field',
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
            @input="debounce(checkExisting, 50)"
          />
          <div
            ref="checkingIndicatorRef"
            class="indicator-container custom-indicator"
          ></div>
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
        <div class="like-input-container" v-if="groups.length">
          <label>Add to group</label>
          <p
            @click="openGroupsModal"
            :class="{ 'value--selected': selectedGroupName }"
          >
            <font-awesome-icon icon="object-group" class="input-icon" />
            {{ selectedGroupName || "Choose group name" }}
          </p>
        </div>
        <div ref="indicatorRef" class="indicator-container">
          <input
            type="submit"
            :value="!state.isLoading ? 'Add' : ''"
            class="entry-btn"
          />
        </div>
        <router-link to="/add-group" class="entry-links"
          >Do you want to create a new group?</router-link
        >
      </form>
    </div>
  </div>
</template>
<script>
import { computed, onUnmounted, reactive, ref, watch } from "vue";
import { required } from "@vuelidate/validators";
import { useStore } from "vuex";
import useVuelidate from "@vuelidate/core";
import { useLoading } from "vue3-loading-overlay";
import { createToast } from "mosha-vue-toastify";
import NavigationHeader from "@/shared/NavigationHeader";
import { LANG } from "@/utils/constants";
import EmitterBus from "@/utils/eventBus";
import { createDebounce, resetState } from "@/utils/handlers";
import Types from "@/store/modules/base/types";
import Firebase from "@/services/Firebase";

export default {
  name: "add-word",
  components: {
    NavigationHeader,
  },
  setup() {
    const store = useStore();
    let loader = useLoading();
    const indicatorRef = ref(null);
    const checkingIndicatorRef = ref(null);

    const state = reactive({
      lang: "",
      arm: "",
      isLoading: false,
      ifExistingSameWord: null,
      sameWordChecking: false,
    });

    watch(
      () => [state.isLoading, state.sameWordChecking],
      () => {
        if (state.sameWordChecking) {
          loader.show({
            container: checkingIndicatorRef.value,
            height: 14,
            width: 14,
            color: "#191675",
          });
        } else if (state.isLoading) {
          loader.show({
            container: indicatorRef.value,
            height: 18,
            width: 18,
            color: "#191675",
          });
        } else loader.hide();
      }
    );

    const currentLang = computed(() => {
      return store.getters["base/getCurrentLang"] || LANG;
    });

    const groups = computed(() => {
      return store.getters["base/getGroups"] || [];
    });

    const userId = computed(() => {
      return store.getters["auth/getUserId"];
    });

    const selectedGroupName = computed(() => {
      return store.getters["base/getSelectedGroupName"];
    });

    const currentLangCapitalize = computed(() => {
      return (
        currentLang.value.charAt(0).toUpperCase() + currentLang.value.slice(1)
      );
    });

    const rules = computed(() => ({
      arm: { required },
      lang: { required },
    }));

    const v$ = useVuelidate(rules, state);

    onUnmounted(() => {
      store.commit("base/" + Types.SET_SELECTED_GROUP_NAME, null);
    });

    onUnmounted(() => {
      EmitterBus.$emit("toggle-modal", null);
    });

    return {
      v$,
      checkingIndicatorRef,
      indicatorRef,
      state,
      currentLang,
      currentLangCapitalize,
      groups,
      selectedGroupName,
      userId,
      debounce: createDebounce(),
    };
  },
  methods: {
    async onSubmit() {
      let allowingReset = true;
      try {
        const isValid = await this.v$.$validate();
        if (
          !isValid ||
          this.state.ifExistingSameWord ||
          this.state.sameWordChecking
        ) {
          allowingReset = false;
          return;
        }
        this.state.isLoading = true;
        const { error } = await this.$store.dispatch("auth/addWord", {
          lang: this.state.lang,
          arm: this.state.arm,
          groupName: this.selectedGroupName,
        });
        if (error) throw error;
        createToast("New word added", {
          type: "default",
          hideProgressBar: true,
        });
        await this.$router.push("/");
      } catch (err) {
        console.error(err);
        createToast(err.message || err, {
          type: "danger",
          hideProgressBar: true,
        });
      } finally {
        if (allowingReset) {
          resetState(this.state, ["lang", "arm"]);
          await this.$nextTick(() => {
            this.state.isLoading = false;
            this.v$.$reset();
          });
        }
      }
    },
    async checkExisting() {
      try {
        this.state.sameWordChecking = true;
        const { error } = await Firebase.checkExistingWord(
          this.currentLang,
          this.state.lang,
          this.userId
        );
        if (error) throw error;
        this.state.ifExistingSameWord = null;
      } catch (err) {
        console.error(err);
        this.state.ifExistingSameWord = err.message || err;
      } finally {
        this.state.sameWordChecking = false;
      }
    },
    openGroupsModal() {
      EmitterBus.$emit("toggle-modal", "groups-modal", { data: this.groups });
    },
  },
};
</script>
<style lang="scss" scoped>
.entry-container {
  @extend .entry-container_extend;
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
    &.value--selected {
      color: #000;
    }
  }
}

.custom-indicator {
  height: 14px;
  width: 14px;
  position: absolute;
  right: 0;
}

.checking-same-word-field {
  & input {
    padding-right: 18px;
  }
}

.title-container {
  @extend .title-entry-container_extend;
}

.entry-icon {
  @extend .entry-icon_extend;
}

.entry-btn {
  @extend .btn-submit_extend;
}

.entry-links {
  @extend .entry-link_extend;
}
</style>
