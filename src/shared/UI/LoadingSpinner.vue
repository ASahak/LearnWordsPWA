<template>
  <div class="loading-spinner-container" :style="containerStyle">
    <slot></slot>
    <div
      :class="['loading-spinner', 'loader-dir--' + loaderDir]"
      :style="spinnerStyle"
      v-if="isActive"
    ></div>
  </div>
</template>
<script>
import { computed, toRef } from "vue";

export default {
  name: "loading-spinner",
  props: {
    active: {
      default: false,
      type: Boolean,
    },
    dir: {
      default: "left",
      type: String,
    },
    fullWidth: {
      type: Boolean,
      default: false,
    },
    size: {
      default: 15,
      type: Number,
    },
  },
  setup(props) {
    const isActive = toRef(props, "active");
    const loaderDir = toRef(props, "dir");
    const spinnerSize = toRef(props, "size");
    const containerWidth = toRef(props, "fullWidth");

    const spinnerStyle = computed(() => ({
      height: spinnerSize.value + "px",
      width: spinnerSize.value + "px",
    }));

    const containerStyle = computed(() => ({
      width: containerWidth.value ? "100%" : "auto",
    }));

    return {
      isActive,
      loaderDir,
      spinnerStyle,
      containerStyle,
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

.loading-spinner-container {
  position: relative;
  width: 100%;
}

.loading-spinner {
  position: absolute;
  top: 0;
  bottom: 0;
  border-radius: 50%;
  margin: auto;
  transition: 0.4s;
  border: 2px solid #ddd;
  border-top-color: $mainBlueColor;
  -webkit-animation: rotating 0.7s linear infinite;
  -moz-animation: rotating 0.7s linear infinite;
  -ms-animation: rotating 0.7s linear infinite;
  -o-animation: rotating 0.7s linear infinite;
  animation: rotating 0.7s linear infinite;
  &.loader-dir--right {
    right: 0;
  }
  &.loader-dir--left {
    left: 0;
  }
  &.loader-dir--center {
    right: 0;
    left: 0;
    margin-inline: auto;
  }
}
</style>
