<template>
  <div class="page-404">
    <h1>404</h1>
    <p>Page not found</p>
    <router-link to="/" class="entry-links">Go to home</router-link>
  </div>
</template>
<script>
export default {
  name: "not-found",
};
</script>
<style lang="scss" scoped>
.page-404 {
  display: flex;
  align-items: center;
  flex-direction: column;
  height: 100%;
  justify-content: center;
}
.page-404 {
  & h1 {
    margin: 0 0 10px;
  }
  & p {
    margin: 0 0 20px;
  }
}
.entry-links {
  @extend .entry-link_extend;
}
</style>
