<script>
import { h, computed } from "vue";
import EmitterBus from "@/utils/eventBus";

export default {
  name: "user-panel",
  setup() {
    const getUserName = computed(() => {
      return "AS";
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
<style>
.user-fullName--panel {
  cursor: pointer;
  padding: 8px;
  background: #615555;
  border-radius: 50%;
  color: #fff;
  font-size: 14px;
}
</style>
