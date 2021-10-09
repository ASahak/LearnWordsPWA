<template>
  <transition mode="out-in" name="fade-top">
    <div class="loading-indicator" v-if="state.isMounted"></div>
  </transition>
</template>
<script>
import { onMounted, onUnmounted, reactive } from "vue";

export default {
  name: "indicator",
  setup() {
    const state = reactive({
      isMounted: false,
    });

    onMounted(() => {
      state.isMounted = true;
    });

    onUnmounted(() => {
      state.isMounted = false;
    });

    return {
      state,
    };
  },
};
</script>
<style lang="scss" scoped>
@-webkit-keyframes rotating /* Safari and Chrome */ {
  from {
    -webkit-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes rotating {
  from {
    -ms-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -webkit-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  to {
    -ms-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -webkit-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
.loading-indicator {
  width: 35px;
  height: 35px;
  position: absolute;
  background: #fff;
  border-radius: 50%;
  left: 0;
  right: 0;
  margin-inline: auto;
  transition: 0.4s;
  border: 3px solid #ddd;
  top: 10px;
  border-top-color: $mainBlueColor;
  box-shadow: rgb(0 0 0 / 27%) 0px 0px 7px 1px;
  -webkit-animation: rotating 1.4s linear infinite;
  -moz-animation: rotating 1.4s linear infinite;
  -ms-animation: rotating 1.4s linear infinite;
  -o-animation: rotating 1.4s linear infinite;
  animation: rotating 1.4s linear infinite;
}
.fade-top-enter-active,
.fade-top-leave-active {
  opacity: 1;
  top: 10px;
}

.fade-top-enter-from,
.fade-top-leave-to {
  opacity: 0;
  top: -30px;
}
</style>
