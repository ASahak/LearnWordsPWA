<template>
  <div :class="classes['top-panel--wrapper']">
    <UserPanel />
    <img src="/img/logoNative.png" alt="logo" class="app-logo" />
    <router-link to="/add-word" :class="classes['add-word-link']">
      <span class="lnr lnr-cross"></span>
    </router-link>
  </div>
</template>
<script>
import { createUseStyles } from "vue-jss";
import UserPanel from "@/components/Header/components/UserPanel";

const useStyles = createUseStyles({
  "top-panel--wrapper": {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "6px 10px",
    background: "linear-gradient(0deg, #eaeaea, transparent)",
    "& .app-logo": {
      maxWidth: "100px",
    },
  },
  "add-word-link": {
    transform: "rotate(45deg)",
    textDecoration: "none",
    "& span": {
      fontWeight: 900,
      fontSize: "18px",
      color: "#000",
    },
  },
});

export default {
  name: "Header",
  components: {
    UserPanel,
  },
  setup() {
    const classes = useStyles();

    return { classes };
  },
};
</script>
