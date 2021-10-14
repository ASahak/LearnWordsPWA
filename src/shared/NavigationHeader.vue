<template>
  <div class="nav-header--container">
    <span class="lnr lnr-arrow-left" v-if="prevPath" @click="goBack"></span>
    <h1>{{ title }}</h1>
  </div>
</template>
<script>
import { toRef } from "vue";
import { useRouter } from "vue-router";

export default {
  name: "navigation-header",
  props: {
    title: {
      type: String,
      required: true,
    },
    prev: {
      type: String,
      required: false,
    },
  },
  setup(props) {
    const prevPath = toRef(props, "prev");
    const router = useRouter();

    const goBack = () => router.push(prevPath.value);

    return {
      prevPath,
      goBack,
    };
  },
};
</script>
<style lang="scss">
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
