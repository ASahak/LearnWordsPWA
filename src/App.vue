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
import { ref, onBeforeMount } from "vue";
import { useStore } from "vuex";
import { createToast } from "mosha-vue-toastify";
import NativePanel from "@/shared/NativeOptionsTopPanel";
import Modals from "@/shared/Modals";
import EmitterBus from "@/utils/eventBus";
import "@/styles/main.scss";

export default {
  components: {
    NativePanel,
    Modals,
  },
  setup() {
    const store = useStore();
    const modalBG = ref(null);
    const toggleModalBg = (v) => (modalBG.value = v);

    const closeDialog = () => {
      if (modalBG.value) {
        EmitterBus.$emit("toggle-modal", null);
      }
    };

    onBeforeMount(() => {
      const { error } = store.dispatch("auth/setUserData", { byRoot: true });
      if (error) {
        createToast(error, {
          type: "danger",
          hideProgressBar: true,
        });
      }
    });

    return {
      toggleModalBg,
      modalBG,
      closeDialog,
    };
  },
};
</script>
