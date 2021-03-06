<template>
  <div class="modals-container" @click="closeModal">
    <transition
      name="modal"
      mode="out-in"
      @before-enter="beforeEnter"
      @after-leave="afterLeave"
    >
      <component :is="ModalComponent" v-bind="props" />
    </transition>
  </div>
</template>
<script>
import { onMounted, ref } from "vue";
import EmitterBus from "@/utils/eventBus";
import UserDetailsModal from "@/shared/Modals/UserDetails";
import FilterByModal from "@/shared/Modals/FilterByModal";
import GroupsModal from "@/shared/Modals/GroupsModal";
import CRUDWord from "@/shared/Modals/CRUDWord";

export default {
  name: "modals",
  components: {
    "user-details-modal": UserDetailsModal,
    "filter-by-modal": FilterByModal,
    "groups-modal": GroupsModal,
    "crud-word-modal": CRUDWord,
  },
  emits: ["toggle-modal-bg-image"],
  setup(_props, context) {
    const ModalComponent = ref(null);
    const props = ref(null);

    const beforeEnter = () => context.emit("toggle-modal-bg-image", true);

    const afterLeave = () => context.emit("toggle-modal-bg-image", false);

    const closeModal = ({ target }) => {
      if (!target.closest(".modal-container")) {
        ModalComponent.value = null;
      }
    };

    onMounted(() => {
      EmitterBus.$on("toggle-modal", (v, data) => {
        ModalComponent.value = v;
        if (v) {
          props.value = data || {};
        }
      });
    });

    return {
      props,
      ModalComponent,
      closeModal,
      beforeEnter,
      afterLeave,
    };
  },
};
</script>
<style lang="scss">
.modals-container {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-container {
  z-index: 22222;
  position: relative;
  background: #fff;
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0px 0px 13px -4px #000;
  min-width: 250px;
  max-width: 80%;
}

.modal-enter-from {
  transition: all 0.2s ease-out;
  opacity: 0;
}

.modal-enter-active {
  z-index: 2222;
  transition: all 0.2s ease-out;
}

.modal-leave-to {
  @supports not (-webkit-touch-callout: none) {
    /* CSS for other than iOS devices */
    transition: all 0.2s ease-out;
    z-index: 2222;
    opacity: 0;
  }
}

.modal-leave-active {
  transition: all 0.2s ease-out;
}

.backdrop-wrapper {
  width: 90%;
  display: flex;
  align-items: center;
  justify-content: center;
  &:after {
    content: "";
    position: absolute;
    width: 100%;
    background: #17171773;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 2222;
  }
}
</style>
