<script>
import { h, computed } from "vue";
import { createUseStyles } from "vue-jss";
import EmitterBus from "@/utils/eventBus";

const useStyles = createUseStyles({
  "user-fullName--panel": {
    cursor: "pointer",
    padding: "8px",
    background: "#615555",
    borderRadius: "50%",
    color: "#fff",
    fontSize: "14px",
  },
});

export default {
  name: "user-panel",
  setup() {
    const classes = useStyles();
    const getUserName = computed(() => {
      return "AS";
    });

    return () =>
      h(
        "div",
        {
          className: classes.value["user-fullName--panel"],
          onClick: () => EmitterBus.$emit("toggle-modal", "user-details-modal"),
        },
        getUserName.value
      );
  },
};
</script>
