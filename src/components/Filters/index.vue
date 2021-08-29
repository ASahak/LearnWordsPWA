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
        { className: "filters-container" },
        <>
          {h(Search, {})} {h(FilterBy, {})}
        </>
      );
  },
};
</script>
<style>
.filters-container {
  padding: 10px;
  background: #ebebeb;
}
</style>
