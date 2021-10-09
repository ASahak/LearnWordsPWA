<script>
import { computed, h } from "vue";
import { useStore } from "vuex";
import Search from "./Search";
import FilterBy from "./FilterBy";

export default {
  name: "filters",
  components: {
    Search,
    FilterBy,
  },
  setup() {
    const store = useStore();

    const wordsCount = computed(() => store.getters["base/getWordsCount"]);

    return () =>
      h(
        "div",
        {
          class: {
            "filters-container": true,
            "still-getting-data": !wordsCount.value,
          },
        },
        <>
          {h(Search, {})} {h(FilterBy, {})}
        </>
      );
  },
};
</script>
<style scoped lang="scss">
.filters-container {
  padding: 10px;
  background: #ebebeb;
  position: relative;
  &.still-getting-data {
    filter: blur(1px);
    &::after {
      content: "";
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      position: absolute;
    }
  }
}
</style>
