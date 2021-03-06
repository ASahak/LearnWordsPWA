<template>
  <div class="main-view-grid">
    <NavigationHeader title="Login" />
    <div class="entry-container">
      <div class="title-container">
        <h1>Welcome back</h1>
        <p>Sign in to continue</p>
      </div>
      <form @submit.prevent="onSubmit" class="grid-view__form">
        <font-awesome-icon icon="user" class="entry-icon" />
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
        <div
          class="input-container"
          :class="['input-container', { 'error-field': v$.password.$error }]"
        >
          <label>Password</label>
          <font-awesome-icon icon="lock" class="input-icon" />
          <input
            name="password"
            type="password"
            placeholder="Type your password"
            v-model="state.password"
          />
          <p v-if="v$.password.$error" class="error-msg">
            {{ v$.password.$errors[0].$message }}
          </p>
        </div>
        <loading-spinner :active="state.isLoading" dir="center">
          <input
            type="submit"
            :value="!state.isLoading ? 'Sign In' : ''"
            class="entry-btn"
          />
        </loading-spinner>
        <router-link to="/reset-password" class="entry-links"
          >Forgot password?</router-link
        >
        <p class="dont-have-account">
          Don't have an account? &nbsp;
          <router-link to="/register" class="entry-links"> Sign Up</router-link>
        </p>
      </form>
    </div>
  </div>
</template>
<script>
import { reactive, computed } from "vue";
import { useStore, mapActions } from "vuex";
import useVuelidate from "@vuelidate/core";
import { resetState } from "@/utils/handlers";
import { createToast } from "mosha-vue-toastify";
import { required, email } from "@vuelidate/validators";
import { LoadingSpinner } from "@/shared/UI";
import NavigationHeader from "@/shared/NavigationHeader";

export default {
  name: "login",
  components: {
    LoadingSpinner,
    NavigationHeader,
  },
  setup() {
    const store = useStore();

    const state = reactive({
      email: "",
      password: "",
      isLoading: false,
    });

    const rules = computed(() => ({
      password: { required },
      email: { required, email },
    }));

    const v$ = useVuelidate(rules, state);

    return { store, state, v$ };
  },
  methods: {
    ...mapActions("auth", ["setUserData"]),
    async onSubmit() {
      let allowingReset = true;
      try {
        const isValid = await this.v$.$validate();
        if (!isValid) {
          allowingReset = false;
          return;
        }
        this.state.isLoading = true;
        const { error } = await this["setUserData"]({
          email: this.state.email,
          password: this.state.password,
        });
        if (error) throw error;
        await this.$router.push("/");
      } catch (err) {
        console.error(err);
        createToast(err.message || err, {
          type: "danger",
          hideProgressBar: true,
        });
      } finally {
        if (allowingReset) {
          resetState(this.state, ["email", "password"]);
          await this.$nextTick(() => {
            this.state.isLoading = false;
            this.v$.$reset();
          });
        }
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

.dont-have-account {
  @extend .dont-have-account_extend;
  margin: 0;
}

.entry-links {
  @extend .entry-link_extend;
}
</style>
