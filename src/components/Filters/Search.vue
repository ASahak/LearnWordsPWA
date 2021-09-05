<template>
  <div :class="classes['search-input--wrapper']">
    <input type="text" placeholder="Find word..." />
  </div>
</template>
<script>
import { createUseStyles } from "vue-jss";

const useStyles = createUseStyles({
  "search-input--wrapper": {
    "& input": {
      padding: "6px 10px",
      display: "block",
      width: "100%",
      borderRadius: 20,
      border: "none",
      outline: "none",
    },
  },
});

export default {
  name: "search",
  setup() {
    const classes = useStyles();

    return { classes };
  },
};
</script>
