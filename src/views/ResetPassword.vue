<template>
  <div>
    <NavigationHeader title="Reset password" />
    <div class="entry-container">
      <div class="title-container">
        <h1>Reset Password</h1>
        <p>Send your email for reset!</p>
      </div>
      <form @submit.prevent="onSubmit">
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
        <input type="submit" value="Send" class="entry-btn" />
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

export default {
  name: "reset-password",
  components: {
    NavigationHeader,
  },
  setup() {
    const store = useStore();

    const state = reactive({
      email: "",
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
        const { msg, error } = await dispatch("auth/resetPassword", {
          email: this.state.email,
        });
        if (error) throw error;
        this.state.email = "";
        await this.$nextTick(() => {
          this.v$.$reset();
        });
        createToast(msg, {
          type: "default",
          hideProgressBar: true,
        });
      } catch (err) {
        createToast(err.message, {
          type: "danger",
          hideProgressBar: true,
        });
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
</style>
