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
import NativePanel from "@/shared/NativeOptionsTopPanel";
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
* {
  box-sizing: border-box;
}

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
  overflow: hidden;
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

/*Global styles*/
.input-container {
  transition: 0.2s;
  transition-property: margin-bottom;
  margin-bottom: 0px;
  padding: 16px 0;
  flex-direction: row;
  position: relative;
  align-items: center;
  display: flex;
}
.input-container > label {
  font-size: 12px;
  position: absolute;
  top: 0;
}
.input-container > input {
  border: none;
  border-bottom: 2px solid #3333;
  width: 100%;
  outline: none;
  padding: 8px 8px 8px 30px;
}

.input-container .input-icon {
  position: absolute;
  left: 0;
  font-size: 17px;
  color: #ccc;
}

.input-container.error-field {
  margin-bottom: 10px;
}

.input-container.error-field input {
  border-bottom: 2px solid #ff0000c9;
}

.input-container.error-field .error-msg {
  position: absolute;
  bottom: -8px;
  font-size: 10px;
  color: #ff0000c9;
}
</style>
