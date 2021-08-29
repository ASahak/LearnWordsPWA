<template>
  <div class="nav-header--container">
    <span
      class="lnr lnr-arrow-left"
      v-if="isHistoryBack"
      @click="goBack"
    ></span>
    <h1>{{ title }}</h1>
  </div>
</template>
<script>
export default {
  name: "navigation-header",
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  setup() {
    const isHistoryBack = history.state.back;
    const goBack = () => history.back();

    return {
      isHistoryBack,
      goBack,
    };
  },
};
</script>
<style>
.nav-header--container {
  box-shadow: 0 4px 3px -4px grey;
  display: flex;
  align-items: center;
  padding: 10px;
}

.nav-header--container span.lnr {
  margin: 0 10px 0 0;
  font-size: 18px;
  cursor: pointer;
  font-weight: 900;
}

.nav-header--container h1 {
  margin: 0;
  font-size: 20px;
}
</style>
