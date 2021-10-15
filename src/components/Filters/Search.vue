<template>
  <div class="search-input--wrapper">
    <input
      v-model="state.searchValue"
      @input="debounce(searchWord.bind(null, $event), 500)"
      type="text"
      placeholder="Find word..."
    />
  </div>
</template>
<script>
import { createDebounce } from "@/utils/handlers";
import EmitterBus from "@/utils/eventBus";
import { reactive } from "vue";

export default {
  name: "search",
  setup() {
    const state = reactive({
      searchValue: "",
    });

    const searchWord = (e) => {
      state.searchValue = e.target.value;
      console.log(state.searchValue, e);
      EmitterBus.$emit("filters", { searchValue: state.searchValue });
    };

    return {
      state,
      searchWord,
      debounce: createDebounce(),
    };
  },
};
</script>
<style lang="scss" scoped>
.search-input--wrapper {
  & input {
    padding: 6px 10px;
    display: block;
    width: 100%;
    border-radius: 20px;
    border: none;
    outline: none;
  }
}
</style>
