<template>
  <div :class="classes['filter-by--container']">
    <div :class="classes['left--side']">
      <button @click="openFilterByModal">All Words</button>
    </div>
    <div :class="classes['right--side']">
      <span> 1 / 1</span>
      <div :class="classes['next-prev-arrows--wrapper']">
        <span class="lnr lnr-chevron-left"></span>
        <span class="lnr lnr-chevron-right"></span>
      </div>
    </div>
  </div>
</template>
<script>
import { createUseStyles } from "vue-jss";
import EmitterBus from "@/utils/eventBus";
import variables from "@/styles/variables";

const useStyles = createUseStyles({
  "filter-by--container": {
    marginTop: 16,
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gridTemplateRows: "1fr",
    alignItems: "center",
  },
  "right--side": {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: "14px",
  },
  "next-prev-arrows--wrapper": {
    "& span": {
      fontWeight: 900,
      fontSize: 16,
      cursor: "pointer",
      marginLeft: 7,
    },
  },
  "left--side": {
    textAlign: "left",
    "& > button": {
      cursor: "pointer",
      background: variables.$mainBlueColor,
      border: "none",
      padding: "6px 10px",
      borderRadius: 4,
      color: "#fff",
      fontSize: 12,
      minWidth: 100,
      transition: "0.2s",
      "&:hover": {
        background: variables.$mainBlueHoverColor,
      },
    },
  },
});
export default {
  name: "filter-by",
  setup() {
    const classes = useStyles();

    return { classes };
  },
  methods: {
    openFilterByModal() {
      EmitterBus.$emit("toggle-modal", "filter-by-modal");
    },
  },
};
</script>
