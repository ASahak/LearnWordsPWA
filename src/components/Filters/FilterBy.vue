<template>
  <div class="filter-by--container">
    <div class="left-side">
      <button @click="openFilterByModal">{{ getFilterName }}</button>
    </div>
    <div class="right-side">
      <span class="right-side__counter" v-show="wordsCount && page">
        {{ page }} / {{ wordsCount }}</span
      >
      <div class="next-prev-arrows--wrapper">
        <span
          class="lnr lnr-chevron-left"
          :class="{ disabled: page === 1 }"
          @click="changePage(0)"
        ></span>
        <span
          class="lnr lnr-chevron-right"
          :class="{ disabled: page === wordsCount }"
          @click="changePage(1)"
        ></span>
      </div>
    </div>
  </div>
</template>
<script>
import { computed, inject } from "vue";
import { useStore } from "vuex";
import { FILTERS_BY } from "@/utils/constants";
import EmitterBus from "@/utils/eventBus";

export default {
  name: "filter-by",
  setup() {
    const page = inject("page");
    const filters = inject("filters");
    const store = useStore();

    const getFilterName = computed(() => {
      return filters.value.isGroup
        ? filters.value.key
        : FILTERS_BY[filters.value.key || "*"];
    });

    const wordsCount = computed(() => store.getters["base/getWordsCount"]);

    const changePage = (isNext) => {
      const _page = page.value;
      EmitterBus.$emit(
        "change-page",
        isNext
          ? wordsCount.value === _page
            ? wordsCount.value
            : _page + 1
          : _page > 1
          ? _page - 1
          : 1
      );
    };

    const openFilterByModal = () => {
      EmitterBus.$emit("toggle-modal", "filter-by-modal", {
        data: store.getters["base/getGroups"],
        filters,
      });
    };

    return {
      FILTERS_BY,
      getFilterName,
      page,
      wordsCount,
      changePage,
      openFilterByModal,
    };
  },
};
</script>
<style lang="scss" scoped>
.filter-by--container {
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: 1fr;
  align-items: center;
}

.right-side {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-size: 14px;
  & .right-side__counter {
    margin-right: 10px;
  }
}

.next-prev-arrows--wrapper {
  & span {
    font-weight: 900;
    font-size: 16px;
    cursor: pointer;
    margin-left: 7px;
    &.disabled {
      pointer-events: none;
      color: #ccc;
    }
  }
}
.left-side {
  text-align: left;
  & > button {
    cursor: pointer;
    background: $mainBlueColor;
    border: none;
    padding: 6px 10px;
    border-radius: 4px;
    color: #fff;
    font-size: 12px;
    min-width: 100px;
    transition: 0.2s;
    &:hover {
      background: $mainBlueHoverColor;
    }
  }
}
</style>
