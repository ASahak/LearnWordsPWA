<template>
  <div>
    <NavigationHeader title="Reset password" />
    <div :class="classes.entryContainer">
      <div :class="classes.titleContainer">
        <h1>Reset Password</h1>
        <p>Send your email for reset!</p>
      </div>
      <form @submit.prevent="onSubmit">
        <font-awesome-icon icon="key" :class="classes.entryIcon" />
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
        <input type="submit" value="Send" :class="classes.entryBtn" />
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
});

export default {
  name: "reset-password",
  components: {
    NavigationHeader,
  },
  setup() {
    const classes = useStyles();
    const state = reactive({
      email: "",
    });

    const rules = computed(() => ({
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
