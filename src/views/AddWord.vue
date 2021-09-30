<template>
  <div>
    <NavigationHeader title="Add word" />
    <div class="entry-container">
      <div class="title-container">
        <h1>Add word</h1>
        <p>Add word and let's learn it together</p>
      </div>
      <form @submit.prevent="onSubmit">
        <font-awesome-icon icon="book" class="entry-icon" />
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
      </form>
    </div>
  </div>
</template>
<script>
// import { reactive, computed, ref, watchEffect } from "vue";
// import { useStore, mapActions } from "vuex";
import { computed, reactive } from "vue";
import { email, required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
// import { useLoading } from "vue3-loading-overlay";
// import { required, email } from "@vuelidate/validators";
import NavigationHeader from "@/shared/NavigationHeader";

export default {
  name: "add-word",
  components: {
    NavigationHeader,
  },
  setup() {
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
    return { v$, state };
  },
  methods: {
    async onSubmit() {},
  },
};
</script>
<style lang="scss" scoped>
.entry-container {
  padding: 10px 30px;
}

.title-container {
  @extend .title-entry-container_extend;
}

.entry-icon {
  @extend .entry-icon_extend;
}
</style>
