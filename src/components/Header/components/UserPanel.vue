<script>
import { h, computed, onUnmounted } from "vue";
import { useStore } from "vuex";
import EmitterBus from "@/utils/eventBus";

export default {
  name: "user-panel",
  setup() {
    const store = useStore();
    const getUserName = computed(() => {
      return (
        store.state.auth?.user?.displayName
          .split(" ")
          .map((e) => e.charAt(0).toUpperCase())
          .join("") || ""
      );
    });

    onUnmounted(() => {
      EmitterBus.$emit("toggle-modal", null);
    });

    return () =>
      h(
        "div",
        {
          className: "user-fullName--panel",
          onClick: () => EmitterBus.$emit("toggle-modal", "user-details-modal"),
        },
        getUserName.value
      );
  },
};
</script>
<style lang="scss">
.user-fullName--panel {
  cursor: pointer;
  background: #615555;
  border-radius: 50%;
  color: #fff;
  font-size: 14px;
  height: 32px;
  width: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
