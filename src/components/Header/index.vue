<template>
  <div class="top-panel--wrapper">
    <UserPanel />
    <img src="/img/logoNative.png" alt="logo" class="app-logo" />
    <router-link to="/add-word" class="add-word-link">
      <span class="lnr lnr-cross"></span>
    </router-link>
  </div>
</template>
<script>
import UserPanel from "@/components/Header/components/UserPanel";

export default {
  name: "Header",
  components: {
    UserPanel,
  },
  setup() {
    return {};
  },
};
</script>
<style lang="scss">
.top-panel--wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 10px;
  background: linear-gradient(0deg, #eaeaea, transparent);
  & .app-logo {
    max-width: 100px;
  }
}
.add-word-link {
  transform: rotate(45deg);
  text-decoration: none;
  & span {
    font-weight: 900;
    font-size: 18px;
    color: #000;
  }
}
</style>
