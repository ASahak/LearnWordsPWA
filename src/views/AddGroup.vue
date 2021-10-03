<template>
  <div>
    <NavigationHeader title="Add group" />
    <div class="entry-container">
      <div class="title-container">
        <h1>Add group</h1>
        <p>Add group to filtering words by their type</p>
      </div>
      <form @submit.prevent="onSubmit">
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
        <div ref="indicatorRef" class="indicator-container">
          <input
            type="submit"
            :value="!state.isLoading ? 'Add' : ''"
            class="entry-btn"
          />
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import { computed, reactive, ref, watchEffect } from "vue";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { useLoading } from "vue3-loading-overlay";
import NavigationHeader from "@/shared/NavigationHeader";
import { createToast } from "mosha-vue-toastify";

export default {
  name: "add-group",
  components: {
    NavigationHeader,
  },
  setup() {
    let loader = useLoading();
    const indicatorRef = ref(null);

    const state = reactive({
      groupName: "",
      isLoading: false,
    });

    watchEffect(() => {
      if (state.isLoading) {
        loader.show({
          container: indicatorRef.value,
          height: 18,
          width: 18,
          color: "#191675",
        });
      } else loader.hide();
    });

    const rules = computed(() => ({
      groupName: { required },
    }));

    const v$ = useVuelidate(rules, state);

    return { v$, state, indicatorRef };
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
        this.v$.$reset();
        await this.$router.push("/add-word");
      } catch (err) {
        console.error(err);
        createToast(err.message || err, {
          type: "danger",
          hideProgressBar: true,
        });
      } finally {
        this.state.isLoading = false;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.entry-container {
  padding: 10px 30px;
}

.like-input-container {
  @extend .input-container_extend;
}

.title-container {
  @extend .title-entry-container_extend;
  margin-bottom: 100px;
}

.entry-icon {
  @extend .entry-icon_extend;
}

.entry-btn {
  @extend .btn-submit_extend;
}
</style>
