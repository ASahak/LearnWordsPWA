<script>
import { h } from "vue";
import Search from "./Search";
import FilterBy from "./FilterBy";

export default {
  name: "filters",
  components: {
    Search,
    FilterBy,
  },
  setup() {
    return () =>
      h(
        "div",
        {
          class: {
            "filters-container": true,
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
}
</style>
