<template>
  <div class="list-container">
    <LoadingIndicator v-if="isStillGettingData" />
    <div
      v-else
      class="list__item"
      v-for="word in list"
      :key="word.publication"
      @click="openCrud(word)"
    >
      <span>{{ word[currentLang] }}</span>
      <span>{{ word.arm }}</span>
    </div>
  </div>
</template>
<script>
import { inject, computed } from "vue";
import { useStore } from "vuex";
import BaseTypes from "@/store/modules/base/types";
import { BASE } from "@/utils/constants";
import { LoadingIndicator } from "@/shared/UI";
import EmitterBus from "@/utils/eventBus";

export default {
  name: "list",
  components: { LoadingIndicator },
  setup() {
    const page = inject("page", 0);
    const filters = inject("filters", {});
    const store = useStore();

    const isStillGettingData = computed(
      () => store.getters["base/getStillGetting"]
    );
    const currentLang = computed(() => store.getters["base/getCurrentLang"]);

    const list = computed(() => {
      const { length, data } = store.getters["base/getFilteredList"]({
        page: page.value,
        filters: filters.value,
      });
      store.commit(
        "base/" + BaseTypes.SET_WORDS_PAGE_COUNT,
        Math.ceil(length / BASE.listLimit)
      );
      return data;
    });

    const openCrud = (word) => {
      EmitterBus.$emit("toggle-modal", "crud-word-modal", { data: word });
    };

    return {
      page,
      filters,
      list,
      openCrud,
      isStillGettingData,
      currentLang,
    };
  },
};
</script>
<style lang="scss" scoped>
.list-container {
  overflow-x: hidden;
  border-bottom-left-radius: 38px;
  border-bottom-right-radius: 38px;
  margin-bottom: 3px;
  position: relative;
  &::-webkit-scrollbar {
    width: 0px;
  }
  & .list__item {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    border-bottom: 1px solid #ddd;
    cursor: pointer;
    & span {
      padding: 4px 10px;
      font-size: 14px;
    }
    & span:first-child {
    }
    & span:last-child {
      border-left: 1px solid #ddd;
    }
  }
}
</style>
