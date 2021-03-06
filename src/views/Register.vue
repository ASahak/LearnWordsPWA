<template>
  <div class="main-view-grid">
    <NavigationHeader title="Register" prev="/login" />
    <div class="entry-container">
      <div class="title-container">
        <h1>Create an account</h1>
        <p>Create to make your life easy</p>
      </div>
      <form @submit.prevent="onSubmit" class="grid-view__form">
        <div
          :class="['input-container', { 'error-field': v$.username.$error }]"
        >
          <label>Username</label>
          <font-awesome-icon icon="user-alt" class="input-icon" />
          <input
            name="name"
            type="text"
            placeholder="Type your username"
            v-model="state.username"
          />
          <p v-if="v$.username.$error" class="error-msg">
            {{ v$.username.$errors[0].$message }}
          </p>
        </div>
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
          :class="['input-container', { 'error-field': v$.password.$error }]"
        >
          <label>Password</label>
          <font-awesome-icon icon="lock" class="input-icon" />
          <input
            type="password"
            placeholder="Type your password"
            v-model="state.password"
          />
          <p v-if="v$.password.$error" class="error-msg">
            {{ v$.password.$errors[0].$message }}
          </p>
        </div>
        <div
          :class="[
            'input-container',
            { 'error-field': v$.confirm_password.$error },
          ]"
        >
          <label>Confirm Password</label>
          <font-awesome-icon icon="lock" class="input-icon" />
          <input
            type="password"
            placeholder="Repeat your password"
            v-model="state.confirm_password"
          />
          <p v-if="v$.confirm_password.$error" class="error-msg">
            {{ v$.confirm_password.$errors[0].$message }}
          </p>
        </div>
        <loading-spinner :active="state.isLoading" dir="center">
          <input
            type="submit"
            :value="!state.isLoading ? 'Sign Up' : ''"
            class="entry-btn"
          />
        </loading-spinner>
        <p class="dont-have-account">
          Have an account? &nbsp;
          <router-link to="/login" class="entry-links"> Sign In</router-link>
        </p>
      </form>
    </div>
  </div>
</template>
<script>
import { reactive, computed } from "vue";
import { mapActions } from "vuex";
import useVuelidate from "@vuelidate/core";
import { required, email, sameAs, minLength } from "@vuelidate/validators";
import NavigationHeader from "@/shared/NavigationHeader";
import { LoadingSpinner } from "@/shared/UI";
import { resetState } from "@/utils/handlers";
import { createToast } from "mosha-vue-toastify";

export default {
  name: "register",
  components: {
    LoadingSpinner,
    NavigationHeader,
  },
  setup() {
    const state = reactive({
      username: "",
      email: "",
      password: "",
      confirm_password: "",
      isLoading: false,
    });

    const rules = computed(() => ({
      username: { required },
      password: { required, minLength: minLength(6) },
      confirm_password: { required, sameAs: sameAs(state.password) },
      email: { required, email },
    }));

    const v$ = useVuelidate(rules, state);

    return { state, v$ };
  },
  methods: {
    ...mapActions("auth", ["registerUser", "setUserData"]),
    async onSubmit() {
      let allowingReset = true;
      try {
        const isValid = await this.v$.$validate();
        if (!isValid) {
          allowingReset = false;
          return;
        }
        this.state.isLoading = true;
        const { msg, error } = await this["registerUser"]({
          username: this.state.username,
          email: this.state.email,
          password: this.state.password,
        });
        if (error) throw error;
        await this.$router.push("/");
        createToast(msg, {
          type: "default",
          hideProgressBar: true,
        });
        const isError = this["setUserData"]({});
        if (isError.error) throw isError.error;
      } catch (err) {
        console.error(err);
        createToast(err.message || err, {
          type: "danger",
          hideProgressBar: true,
        });
      } finally {
        if (allowingReset) {
          resetState(this.state, [
            "username",
            "email",
            "password",
            "confirm_password",
          ]);
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
  margin: 5px 0 0;
}

.entry-links {
  @extend .entry-link_extend;
}
</style>
