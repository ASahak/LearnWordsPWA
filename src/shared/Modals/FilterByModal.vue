<template>
  <div class="backdrop-wrapper">
    <div class="modal-container">
      <h3 class="title" v-if="!state.groupPage">Filter by...</h3>
      <font-awesome-icon
        v-else
        icon="arrow-left"
        @click.stop="goBack"
        class="back-btn"
      />
      <div class="filter-by-list">
        <template v-for="filter in filterByData">
          <label
            v-if="
              filter.value === 'group-by' ? dataGroups?.length : filter.value
            "
            :key="filter.value"
            class="filter-by-list__item"
          >
            <input
              type="radio"
              @change="changeFilterName(filter.value)"
              name="filter-by-name"
              :checked="state.checkedFilter === filter.value"
            />
            <p class="paragraphs">{{ filter.title }}</p>
          </label>
        </template>
      </div>
      <div class="modal-actions-wrapper">
        <button
          class="btn btn--default modal-btn"
          :disabled="!state.checkedFilter"
          @click="getFilteredData"
        >
          Get List
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { computed, onMounted, reactive, toRef } from "vue";
import { FILTERS_BY } from "@/utils/constants";
import EmitterBus from "@/utils/eventBus";

export default {
  name: "filter-by-modal",
  props: {
    data: {
      type: Array,
      required: false,
      default: () => [],
    },
    filters: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const dataGroups = toRef(props, "data");
    const filtersPropData = toRef(props, "filters");
    const state = reactive({
      groupPage: false,
      checkedFilter: "*",
    });

    const filterByData = computed(() =>
      state.groupPage
        ? Object.values(dataGroups.value).map((e) => ({ title: e, value: e }))
        : Object.keys(FILTERS_BY).map((e) => ({
            title: FILTERS_BY[e],
            value: e,
          }))
    );

    const changeFilterName = (filter) => {
      if (filter === "group-by") {
        state.checkedFilter = filtersPropData.value.isGroup
          ? filtersPropData.value.key
          : null;
        state.groupPage = true;
      } else state.checkedFilter = filter;
    };
    const goBack = async () => {
      state.checkedFilter = filtersPropData.value.isGroup
        ? null
        : filtersPropData.value.key;
      state.groupPage = false;
    };

    const getFilteredData = () => {
      EmitterBus.$emit("filters", {
        key: state.checkedFilter,
        isGroup: state.groupPage,
      });
      EmitterBus.$emit("toggle-modal", null);
    };

    onMounted(() => {
      if (filtersPropData.value.isGroup) state.groupPage = true;
      state.checkedFilter = filtersPropData.value.key;
    });

    return {
      dataGroups,
      state,
      filterByData,
      goBack,
      getFilteredData,
      changeFilterName,
    };
  },
};
</script>
<style lang="scss" scoped>
.title {
  text-align: left;
  margin-top: 10px;
  margin-bottom: 0px;
}

.filter-by-list {
  margin: 10px 0;
  max-height: 220px;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    width: 4px;
    background-color: #efefef;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: #c9c9d3;
  }
  & p {
    margin: 5px 10px;
  }
}

.filter-by-list__item {
  display: flex;
  align-items: center;
  cursor: pointer;
  & input {
    cursor: pointer;
    margin: 0;
  }
}

.modal-actions-wrapper {
  text-align: right;
}

.back-btn {
  margin-top: 10px;
  cursor: pointer;
}
</style>
