<template>
  <div class="filter-by--container">
    <div class="left--side">
      <button @click="openFilterByModal">All Words</button>
    </div>
    <div class="right--side">
      <span> 1 / 1</span>
      <div class="next-prev-arrows--wrapper">
        <span class="lnr lnr-chevron-left"></span>
        <span class="lnr lnr-chevron-right"></span>
      </div>
    </div>
  </div>
</template>
<script>
import EmitterBus from "@/utils/eventBus";

export default {
  name: "filter-by",
  setup() {
    return {};
  },
  methods: {
    openFilterByModal() {
      EmitterBus.$emit("toggle-modal", "filter-by-modal");
    },
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

.right--side {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
}

.next-prev-arrows--wrapper {
  & span {
    font-weight: 900;
    font-size: 16px;
    cursor: pointer;
    margin-left: 7px;
  }
}
.left--side {
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
