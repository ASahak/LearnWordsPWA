<template>
  <div class="main_container">
    <!--  BG image for desktop  -->
    <img
      src="/img/bg.png"
      alt="bg-image"
      :style="{ zIndex: modalBG ? '22222' : '1' }"
      @click="closeDialog"
    />
    <!--  Like mobile native functions  -->
    <NativePanel />

    <div class="section-transition--wrapper">
      <router-view v-slot="{ Component }">
        <transition name="route" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>

    <!--  Modals container  -->
    <Modals @toggleModalBgImage="toggleModalBg" />
  </div>
</template>
<script>
import { ref } from "vue";
import NativePanel from "@/components/NativeOptionsTopPanel";
import Modals from "@/shared/Modals";
import EmitterBus from "@/utils/eventBus";

export default {
  components: {
    NativePanel,
    Modals,
  },
  setup() {
    const modalBG = ref(null);
    const toggleModalBg = (v) => (modalBG.value = v);

    const closeDialog = () => {
      if (modalBG.value) {
        EmitterBus.$emit("toggle-modal", null);
      }
    };

    return {
      toggleModalBg,
      modalBG,
      closeDialog,
    };
  },
};
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

/*router transition*/
.route-enter-from {
  opacity: 0;
  transform: translateX(10px);
}

.route-enter-active {
  transition: all 0.2s ease-out;
}

.route-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

.route-leave-active {
  transition: all 0.2s ease-out;
}

.section-transition--wrapper {
  z-index: 222;
  position: relative;
}

.main_container > img {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}

.main_container {
  height: 95vh;
  width: 380px;
  margin: auto;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-size: cover;
  background-position: center;
  padding: 16px 24px;
  box-sizing: border-box;
}
</style>
