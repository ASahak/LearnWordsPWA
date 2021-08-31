<template>
  <div>
    <NavigationHeader title="Register" />
    <div class="entry-container">
      <div class="title-container">
        <h1>Create an account</h1>
        <p>Create to make your life easy</p>
      </div>
      <form @submit.prevent="onSubmit">
        <div
          class="input-container"
          :class="{ 'error-field': v$.username.$error }"
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
          class="input-container"
          :class="{ 'error-field': v$.email.$error }"
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
          class="input-container"
          :class="{ 'error-field': v$.password.$error }"
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
          class="input-container"
          :class="{ 'error-field': v$.confirm_password.$error }"
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
        <input type="submit" value="Sign Up" class="entry-btn" />
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
import useVuelidate from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
import NavigationHeader from "@/shared/NavigationHeader";

export default {
  name: "register",
  components: {
    NavigationHeader,
  },
  setup() {
    const state = reactive({
      username: "",
      email: "",
      password: "",
      confirm_password: "",
    });

    const rules = computed(() => ({
      username: { required },
      password: { required },
      confirm_password: { required },
      email: { required, email },
    }));

    const v$ = useVuelidate(rules, state);

    return { state, v$ };
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
<style scoped>
.title-container {
  margin-top: 50px;
  margin-bottom: 50px;
  text-align: left;
}

.title-container p {
  font-size: 12px;
  color: #888484;
  margin: 0;
}

.title-container h1 {
  font-size: 30px;
  font-weight: bold;
  color: #191675;
  margin: 0;
}

.entry-container {
  padding: 10px 30px;
}

.entry-btn {
  cursor: pointer;
  background: #24217c;
  border: none;
  padding: 6px 10px;
  border-radius: 4px;
  color: #fff;
  font-size: 14px;
  min-width: 100px;
  transition: 0.2s;
  width: 100%;
}

.entry-btn:hover {
  background: #24217ccf;
}

.dont-have-account {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px 0;
  font-size: 13px;
  color: #8c8989;
  line-height: 5px;
}

.entry-links {
  text-align: center;
  font-size: 13px;
  color: #8c8989;
  margin: 5px 0;
  display: inline-block;
}
</style>
