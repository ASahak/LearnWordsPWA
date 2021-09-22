<template>
  <div>
    <NavigationHeader title="Login" />
    <div class="entry-container">
      <div class="title-container">
        <h1>Welcome back</h1>
        <p>Sign in to continue</p>
      </div>
      <form @submit.prevent="onSubmit">
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
        <input type="submit" value="Sign In" class="entry-btn" />
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
import useVuelidate from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
import NavigationHeader from "@/shared/NavigationHeader";
import { useStore, mapActions } from "vuex";

export default {
  name: "login",
  components: {
    NavigationHeader,
  },
  setup() {
    const store = useStore();

    const state = reactive({
      email: "",
      password: "",
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
      try {
        const isValid = await this.v$.$validate();
        if (!isValid) return;
        await this["setUserData"]({
          email: this.state.email,
          password: this.state.password,
        });
        await this.$router.push("/");
      } catch (err) {
        console.error(err);
      }
    },
  },
};
</script>
<style scoped lang="scss">
.title-container {
  margin-top: 50px;
  margin-bottom: 50px;
  text-align: left;
  & p {
    font-size: 12px;
    color: #888484;
    margin: 0;
  }
  & h1 {
    font-size: 30px;
    font-weight: bold;
    color: $titleColor;
    margin: 0;
  }
}

.entry-container {
  padding: 10px 30px;
}

.entry-btn {
  cursor: pointer;
  background: $mainBlueColor;
  border: none;
  padding: 6px 10px;
  border-radius: 4px;
  color: #fff;
  font-size: 14px;
  min-width: 100px;
  transition: 0.2s;
  width: 100%;
  &:hover {
    background: $mainBlueHoverColor;
  }
}

.entry-icon {
  text-align: center;
  font-size: 50px;
  margin-bottom: 30px;
  font-weight: bold;
  color: $titleColor;
}

.dont-have-account {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  font-size: 13px;
  color: #8c8989;
  line-height: 5px;
}

.entry-links {
  text-align: center;
  font-size: 13px;
  color: #8c8989;
  margin: 5px 0;
  display: block;
}
</style>
