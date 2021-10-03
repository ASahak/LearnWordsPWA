<template>
  <div>
    <Header />
    <Filters />
    {{ state.page }}
    <List />
  </div>
</template>

<script>
import { onMounted, reactive, provide, computed } from "vue";
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
    const state = reactive({
      page: 1,
    });

    provide(
      "page",
      computed(() => state.page)
    );

    onMounted(() => {
      EmitterBus.$on("change-page", (v) => {
        state.page = v;
      });
    });

    return {
      state,
    };
  },
};
</script>
