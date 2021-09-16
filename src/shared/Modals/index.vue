<template>
  <div :class="classes['modals-container']">
    <transition
      name="modal"
      mode="out-in"
      @before-enter="beforeEnter"
      @after-leave="afterLeave"
    >
      <component :is="ModalComponent" />
    </transition>
  </div>
</template>
<script>
import { onMounted, ref } from "vue";
import { createUseStyles } from "vue-jss";
import EmitterBus from "@/utils/eventBus";
import UserDetailsModal from "@/shared/Modals/UserDetails";
import FilterByModal from "@/shared/Modals/FilterByModal";

const useStyles = createUseStyles({
  /*modal transition*/
  "@global": {
    ".modal-enter-from": {
      transition: "all 0.2s ease-out",
      opacity: 0,
    },
    ".modal-enter-active": {
      zIndex: 2222,
      transition: "all 0.2s ease-out",
    },
    ".modal-leave-to": {
      transition: "all 0.2s ease-out",
      zIndex: 2222,
      opacity: 0,
    },
    ".modal-leave-active": {
      transition: "all 0.2s ease-out",
    },
  },
  "modals-container": {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default {
  name: "modals",
  components: {
    "user-details-modal": UserDetailsModal,
    "filter-by-modal": FilterByModal,
  },
  emits: ["toggle-modal-bg-image"],
  setup(_props, context) {
    const classes = useStyles();
    const ModalComponent = ref(null);

    const beforeEnter = () => context.emit("toggle-modal-bg-image", true);

    const afterLeave = () => context.emit("toggle-modal-bg-image", false);

    onMounted(() => {
      EmitterBus.$on("toggle-modal", (v) => {
        ModalComponent.value = v;
      });
    });

    return {
      ModalComponent,
      beforeEnter,
      afterLeave,
      classes,
    };
  },
};
</script>
