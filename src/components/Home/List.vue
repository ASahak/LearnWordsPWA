<template>
  <div class="list-container">
    <LoadingIndicator v-if="isStillGettingData" />
    <template v-else>
      <div v-if="!list.length" class="no-data">
        <p>No data <span class="lnr lnr-sad"></span></p>
      </div>
      <div
        v-else
        :class="{
          list__item: true,
          'list__item--updating': word.updated,
          'list__item--deleting': word.isDeleting,
        }"
        v-for="word in list"
        :key="word.publication"
        @click="openCrud(word)"
      >
        <span>{{ word[currentLang] }}</span>
        <span>{{ word.arm }}</span>
      </div>
    </template>
  </div>
</template>
<script>
import { inject, computed, onUnmounted } from "vue";
import { useStore } from "vuex";
import BaseTypes from "@/store/modules/base/types";
import { BASE } from "@/utils/constants";
import { LoadingIndicator } from "@/shared/UI";
import EmitterBus from "@/utils/eventBus";
import Types from "@/store/modules/base/types";

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
        "base/" + BaseTypes.SET_WORDS_PAGES_COUNT,
        Math.ceil(length / BASE.listLimit)
      );
      return data;
    });

    const openCrud = (word) => {
      if (word.updated || word.isDeleting) return;
      store.commit("base/" + Types.SET_EXAMPLE_WORDS, {
        value: null,
        list: [],
        status: "not-fulfilled",
      });
      EmitterBus.$emit("toggle-modal", "crud-word-modal", { data: word });
    };

    onUnmounted(() => {
      EmitterBus.$emit("toggle-modal", null);
    });

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
@keyframes highlightingUpdate {
  0% {
    box-shadow: -1px 0px 4px 1px #fff;
  }
  50% {
    box-shadow: -1px 0px 4px 1px #00ad454d;
    background: #00ad454d;
  }
  100% {
    box-shadow: -1px 0px 4px 1px #fff;
  }
}
@keyframes highlightingDelete {
  0% {
    box-shadow: -1px 0px 4px 1px #fff;
  }
  50% {
    box-shadow: -1px 0px 4px 1px #d7022d7a;
    background: #d7022d7a;
  }
  100% {
    box-shadow: -1px 0px 4px 1px #fff;
  }
}

.no-data {
  & p {
    font-weight: bold;
    color: #9797a2;
    display: flex;
    align-items: center;
    justify-content: center;
    & .lnr {
      font-weight: 900;
      margin-left: 6px;
    }
  }
}

.list-container {
  overflow-x: hidden;
  border-bottom-left-radius: 38px;
  border-bottom-right-radius: 38px;
  margin-bottom: 3px;
  position: relative;
  @media only screen and (max-width: 991px) {
    border-radius: 0px;
  }
  &::-webkit-scrollbar {
    width: 0px;
  }
  & .list__item {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    border-bottom: 1px solid #ddd;
    cursor: pointer;
    word-break: break-word;
    transition: 0.4s;
    &--updating {
      animation: highlightingUpdate 1.5s linear 1;
    }
    &--deleting {
      animation: highlightingDelete 1.5s linear 1;
    }
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
