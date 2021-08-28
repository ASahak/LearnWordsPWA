<template>
  <div class="modals-container">
    <component :is="ModalComponent" />
  </div>
</template>
<script>
import { onMounted, ref } from "vue";
import EmitterBus from "@/utils/eventBus";
import UserDetailsModal from "@/shared/Modals/UserDetails";

export default {
  name: "modals",
  components: {
    "user-details-modal": UserDetailsModal,
  },
  setup() {
    const ModalComponent = ref(null);

    onMounted(() => {
      EmitterBus.$on("toggle-modal", (v) => {
        ModalComponent.value = v;
      });
    });

    return {
      ModalComponent,
    };
  },
};
</script>
