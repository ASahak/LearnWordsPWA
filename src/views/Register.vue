<template>
  <div>
    <NavigationHeader title="Register" />
    <div :class="classes.entryContainer">
      <div :class="classes.titleContainer">
        <h1>Create an account</h1>
        <p>Create to make your life easy</p>
      </div>
      <form @submit.prevent="onSubmit">
        <div
          :class="[
            gClasses.inputContainer,
            { 'error-field': v$.username.$error },
          ]"
        >
          <label>Username</label>
          <font-awesome-icon icon="at" class="input-icon" />
          <input
            type="text"
            placeholder="Type your username"
            v-model="state.username"
          />
          <p v-if="v$.username.$error" class="error-msg">
            {{ v$.username.$errors[0].$message }}
          </p>
        </div>
        <div
          :class="[gClasses.inputContainer, { 'error-field': v$.email.$error }]"
        >
          <label>E-mail</label>
          <font-awesome-icon icon="at" class="input-icon" />
          <input
            type="email"
            placeholder="Type your email"
            v-model="state.email"
          />
          <p v-if="v$.email.$error" class="error-msg">
            {{ v$.email.$errors[0].$message }}
          </p>
        </div>
        <div
          :class="[
            gClasses.inputContainer,
            { 'error-field': v$.password.$error },
          ]"
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
            gClasses.inputContainer,
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
        <input type="submit" value="Sign Up" :class="classes.entryBtn" />
        <p :class="classes.dontHaveAccount">
          Have an account? &nbsp;
          <router-link to="/login" :class="classes.entryLinks">
            Sign In</router-link
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
import { required, email, sameAs, minLength } from "@vuelidate/validators";
import NavigationHeader from "@/shared/NavigationHeader";

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
      color: "#191675",
      margin: 0,
    },
  },
  entryContainer: {
    padding: "10px 30px",
  },
  entryBtn: {
    cursor: "pointer",
    background: "#24217c",
    border: "none",
    padding: "6px 10px",
    borderRadius: 4,
    color: "#fff",
    fontSize: 14,
    minWidth: 100,
    transition: "0.2s",
    width: "100%",
    "&:hover": {
      background: "#24217ccf",
    },
  },
  entryIcon: {
    textAlign: "center",
    fontSize: 50,
    marginBottom: 30,
    fontWeight: "bold",
    color: "#191675",
  },
  dontHaveAccount: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "5px 0 0",
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
  name: "register",
  components: {
    NavigationHeader,
  },
  setup() {
    const classes = useStyles();
    const state = reactive({
      username: "",
      email: "",
      password: "",
      confirm_password: "",
    });

    const rules = computed(() => ({
      username: { required },
      password: { required, minLength: minLength(6) },
      confirm_password: { required, sameAs: sameAs(state.password) },
      email: { required, email },
    }));

    const v$ = useVuelidate(rules, state);

    return { state, v$, classes };
  },
  methods: {
    async onSubmit() {
      try {
        await this.v$.$validate();
      } catch (err) {
        console.error(err);
      }
    },
  },
};
</script>
