<template>
  <div class="backdrop-wrapper">
    <div class="modal-container">
      <h3 class="title">Choose Group</h3>
      <div class="groups-list">
        <label
          v-for="groupName in dataGroups"
          :key="groupName"
          class="groups-list__item"
        >
          <input
            type="radio"
            name="group-name"
            :checked="state.checkedGroup === groupName"
            @change="changeGroupName(groupName)"
          />
          <p class="paragraphs">{{ groupName }}</p>
        </label>
      </div>
      <div class="modal-actions-wrapper">
        <button
          :disabled="!state.checkedGroup"
          class="btn btn--default modal-btn"
          @click="selectGroupName"
        >
          Select
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { reactive, toRef, watchEffect } from "vue";
import { useStore } from "vuex";
import EmitterBus from "@/utils/eventBus";
import Types from "@/store/modules/base/types";

export default {
  name: "groups-modal",
  props: {
    data: {
      type: Array,
      required: false,
    },
  },
  setup(props) {
    const store = useStore();

    const dataGroups = toRef(props, "data");

    const state = reactive({
      checkedGroup: null,
    });

    watchEffect(() => {
      state.checkedGroup = store.getters["base/getSelectedGroupName"];
    });

    const changeGroupName = (v) => {
      state.checkedGroup = v;
    };

    const selectGroupName = () => {
      store.commit("base/" + Types.SET_SELECTED_GROUP_NAME, state.checkedGroup);
      state.checkedGroup = null;
      EmitterBus.$emit("toggle-modal", null);
    };

    return {
      state,
      dataGroups,
      changeGroupName,
      selectGroupName,
    };
  },
};
</script>
<style lang="scss" scoped>
.modal-actions-wrapper {
  text-align: right;
}

.title {
  text-align: left;
  margin-top: 10px;
  margin-bottom: 0px;
}

.groups-list {
  margin: 10px 0;
  max-height: 250px;
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

.groups-list__item {
  display: flex;
  align-items: center;
  cursor: pointer;
  & input {
    cursor: pointer;
    margin: 0;
  }
}
</style>
