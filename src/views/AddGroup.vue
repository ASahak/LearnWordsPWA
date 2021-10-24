<template>
  <div class="main-view-grid">
    <NavigationHeader title="Add group" prev="/add-word" />
    <div class="entry-container">
      <div class="title-container">
        <h1>Add group</h1>
        <p>Add group to filtering words by their type</p>
      </div>
      <form @submit.prevent="onSubmit" class="grid-view__form">
        <font-awesome-icon icon="object-group" class="entry-icon" />
        <div
          :class="['input-container', { 'error-field': v$.groupName.$error }]"
        >
          <label>Group name</label>
          <font-awesome-icon icon="paragraph" class="input-icon" />
          <input
            name="group-name"
            type="text"
            placeholder="Type the name of group"
            v-model="state.groupName"
          />
          <p v-if="v$.groupName.$error" class="error-msg">
            {{ v$.groupName.$errors[0].$message }}
          </p>
        </div>
        <loading-spinner :active="state.isLoading" dir="center">
          <input
            type="submit"
            :value="!state.isLoading ? 'Add' : ''"
            class="entry-btn"
          />
        </loading-spinner>
      </form>
    </div>
  </div>
</template>
<script>
import { computed, reactive } from "vue";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { LoadingSpinner } from "@/shared/UI";
import NavigationHeader from "@/shared/NavigationHeader";
import { createToast } from "mosha-vue-toastify";
import { resetState } from "@/utils/handlers";

export default {
  name: "add-group",
  components: {
    LoadingSpinner,
    NavigationHeader,
  },
  setup() {
    const state = reactive({
      groupName: "",
      isLoading: false,
    });

    const rules = computed(() => ({
      groupName: { required },
    }));

    const v$ = useVuelidate(rules, state);

    return { v$, state };
  },
  methods: {
    async onSubmit() {
      try {
        const isValid = await this.v$.$validate();
        if (!isValid) return;
        this.state.isLoading = true;
        const { error } = await this.$store.dispatch("auth/addGroup", {
          groupName: this.state.groupName,
        });
        if (error) throw error;
        createToast("New group added", {
          type: "default",
          hideProgressBar: true,
        });
        await this.$router.push("/add-word");
      } catch (err) {
        console.error(err);
        createToast(err.message || err, {
          type: "danger",
          hideProgressBar: true,
        });
      } finally {
        resetState(this.state, ["groupName"]);
        await this.$nextTick(() => {
          this.state.isLoading = false;
          this.v$.$reset();
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.entry-container {
  @extend .entry-container_extend;
}

.like-input-container {
  @extend .input-container_extend;
}

.title-container {
  @extend .title-entry-container_extend;
}

.entry-icon {
  @extend .entry-icon_extend;
}

.entry-btn {
  @extend .btn-submit_extend;
}
</style>
