<template>
  <div>
    <NavigationHeader title="Login" />
    <div :class="classes.entryContainer">
      <div :class="classes.titleContainer">
        <h1>Welcome back</h1>
        <p>Sign in to continue</p>
      </div>
      <form @submit.prevent="onSubmit">
        <font-awesome-icon icon="user" :class="classes.entryIcon" />
        <div
          :class="[
            gClasses['input-container'],
            { 'error-field': v$.email.$error },
          ]"
        >
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
          :class="[
            gClasses['input-container'],
            { 'error-field': v$.password.$error },
          ]"
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
        <input type="submit" value="Sign In" :class="classes.entryBtn" />
        <router-link to="/reset-password" :class="classes.entryLinks"
          >Forgot password?</router-link
        >
        <p :class="classes.dontHaveAccount">
          Don't have an account? &nbsp;
          <router-link to="/register" :class="classes.entryLinks">
            Sign Up</router-link
          >
        </p>
      </form>
    </div>
  </div>
</template>
<script>
import { reactive, computed } from "vue";
import useVuelidate from "@vuelidate/core";
import { createUseStyles } from "vue-jss";
import { required, email } from "@vuelidate/validators";
import NavigationHeader from "@/shared/NavigationHeader";
import { useStore, mapActions } from "vuex";
import variables from "@/styles/variables";

const useStyles = createUseStyles({
  titleContainer: {
    marginTop: 50,
    marginBottom: 50,
    textAlign: "left",
    "& p": {
      fontSize: 12,
      color: "#888484",
      margin: 0,
    },
    "& h1": {
      fontSize: 30,
      fontWeight: "bold",
      color: variables.$titleColor,
      margin: 0,
    },
  },
  entryContainer: {
    padding: "10px 30px",
  },
  entryBtn: {
    cursor: "pointer",
    background: variables.$mainBlueColor,
    border: "none",
    padding: "6px 10px",
    borderRadius: 4,
    color: "#fff",
    fontSize: 14,
    minWidth: 100,
    transition: "0.2s",
    width: "100%",
    "&:hover": {
      background: variables.$mainBlueHoverColor,
    },
  },
  entryIcon: {
    textAlign: "center",
    fontSize: 50,
    marginBottom: 30,
    fontWeight: "bold",
    color: variables.$titleColor,
  },
  dontHaveAccount: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0",
    fontSize: "13px",
    color: "#8c8989",
    lineHeight: "5px",
  },
  entryLinks: {
    textAlign: "center",
    fontSize: 13,
    color: "#8c8989",
    margin: "5px 0",
    display: "inline-block",
  },
});

export default {
  name: "login",
  components: {
    NavigationHeader,
  },
  setup() {
    const classes = useStyles();
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

    return { store, state, v$, classes };
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
