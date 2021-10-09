<template>
  <div class="home-wrapper">
    <Header />
    <Filters />
    <List />
  </div>
</template>

<script>
import { onMounted, onUnmounted, reactive, provide, computed } from "vue";
import { createToast } from "mosha-vue-toastify";
import { useStore } from "vuex";
import Header from "@/components/Header";
import Filters from "@/components/Filters";
import List from "@/components/Home/List";
import EmitterBus from "@/utils/eventBus";

export default {
  name: "Home",
  components: {
    Header,
    Filters,
    List,
  },
  setup() {
    const store = useStore();
    const state = reactive({
      page: 1,
      filters: { key: "*", isGroup: false },
    });

    provide(
      "page",
      computed(() => state.page)
    );

    provide(
      "filters",
      computed(() => state.filters)
    );

    const getList = () => {
      const { error } = store.dispatch("base/getList", {
        page: 1,
        filters: { key: "*" },
      });
      if (error) {
        createToast(error, {
          type: "danger",
          hideProgressBar: true,
        });
      }
    };

    onMounted(() => {
      getList();

      EmitterBus.$on("change-page", (v) => {
        state.page = v;
      });

      EmitterBus.$on("filters", (data) => {
        state.page = 1;
        state.filters = data;
      });
    });

    onUnmounted(() => {
      EmitterBus.$off("change-page");
      EmitterBus.$off("filters");
    });

    return {
      state,
    };
  },
};
</script>
<style lang="scss" scoped>
.home-wrapper {
  height: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 52px 90px 1fr;
}
</style>
