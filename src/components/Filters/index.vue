<script>
import { h } from "vue";
import { createUseStyles } from "vue-jss";
import Search from "./Search";
import FilterBy from "./FilterBy";

const useStyles = createUseStyles({
  "filters-container": {
    padding: 10,
    background: "#ebebeb",
  },
});

export default {
  name: "filters",
  components: {
    Search,
    FilterBy,
  },
  setup() {
    const classes = useStyles();

    return () =>
      h(
        "div",
        { className: classes.value["filters-container"] },
        <>
          {h(Search, {})} {h(FilterBy, {})}
        </>
      );
  },
};
</script>
