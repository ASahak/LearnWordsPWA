<template>
  <div class="main-view-grid">
    <NavigationHeader title="Reset password" prev="/login" />
    <div class="entry-container">
      <div class="title-container">
        <h1>Reset Password</h1>
        <p>Send your email for reset!</p>
      </div>
      <form @submit.prevent="onSubmit" class="grid-view__form">
        <font-awesome-icon icon="key" class="entry-icon" />
        <div :class="['input-container', { 'error-field': v$.email.$error }]">
          <label>E-mail</label>
          <font-awesome-icon icon="at" class="input-icon" />
          <input
            name="email"
            type="email"
            placeholder="Type your email"
            v-model="state.email"
          />
          <p v-if="v$.email.$error" class="error-msg">
            {{ v$.email.$errors[0].$message }}
          </p>
        </div>
        <loading-spinner :active="state.isLoading" dir="center">
          <input
            type="submit"
            :value="!state.isLoading ? 'Send' : ''"
            class="entry-btn"
          />
        </loading-spinner>
      </form>
    </div>
  </div>
</template>
<script>
import { reactive, computed } from "vue";
import { useStore } from "vuex";
import useVuelidate from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
import { createToast } from "mosha-vue-toastify";
import NavigationHeader from "@/shared/NavigationHeader";
import { LoadingSpinner } from "@/shared/UI";
import { resetState } from "@/utils/handlers";

export default {
  name: "reset-password",
  components: {
    LoadingSpinner,
    NavigationHeader,
  },
  setup() {
    const store = useStore();

    const state = reactive({
      email: "",
      isLoading: false,
    });

    const rules = computed(() => ({
      email: { required, email },
    }));

    const v$ = useVuelidate(rules, state);

    return { state, v$, store };
  },
  methods: {
    async onSubmit() {
      try {
        const isValid = await this.v$.$validate();
        if (!isValid) return;
        const { dispatch } = this.store;
        this.state.isLoading = true;
        const { msg, error } = await dispatch("auth/resetPassword", {
          email: this.state.email,
        });
        if (error) throw error;
        createToast(msg, {
          type: "default",
          hideProgressBar: true,
        });
      } catch (err) {
        createToast(err.message || err, {
          type: "danger",
          hideProgressBar: true,
        });
      } finally {
        resetState(this.state, ["email"]);
        await this.$nextTick(() => {
          this.state.isLoading = false;
          this.v$.$reset();
        });
      }
    },
  },
};
</script>
<style scoped lang="scss">
.entry-container {
  @extend .entry-container_extend;
}

.title-container {
  @extend .title-entry-container_extend;
}

.entry-btn {
  @extend .btn-submit_extend;
}

.entry-icon {
  @extend .entry-icon_extend;
}
</style>
