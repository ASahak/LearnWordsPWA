<template>
  <div>List {{ page }}</div>
</template>
<script>
import { inject, watch } from "vue";
import { useStore } from "vuex";
import { createToast } from "mosha-vue-toastify";

export default {
  name: "list",
  setup() {
    const page = inject("page");
    const store = useStore();

    watch(
      () => page.value,
      () => {
        console.log(page.value);
        const { error } = store.dispatch("base/getList", {
          page: page.value,
          filters: {},
        });
        if (error) {
          createToast(error, {
            type: "danger",
            hideProgressBar: true,
          });
        }
      }
    );

    return {
      page,
    };
  },
};
</script>
