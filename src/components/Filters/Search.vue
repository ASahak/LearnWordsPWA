<template>
  <div class="search-input--wrapper">
    <input type="text" placeholder="Find word..." />
  </div>
</template>
<script>
export default {
  name: "search",
};
</script>
<style>
.search-input--wrapper input {
  padding: 6px 10px;
  display: block;
  width: 100%;
  border-radius: 20px;
  border: none;
  outline: none;
}
</style>
