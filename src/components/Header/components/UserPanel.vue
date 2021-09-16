<script>
import { h, computed } from "vue";
import { useStore } from "vuex";
import { createUseStyles } from "vue-jss";
import EmitterBus from "@/utils/eventBus";

const useStyles = createUseStyles({
  "user-fullName--panel": {
    cursor: "pointer",
    background: "#615555",
    borderRadius: "50%",
    color: "#fff",
    fontSize: "14px",
    height: 32,
    width: 32,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default {
  name: "user-panel",
  setup() {
    const store = useStore();
    const classes = useStyles();
    const getUserName = computed(() => {
      return (
        store.state.auth?.user?.displayName
          .split(" ")
          .map((e) => e.charAt(0).toUpperCase())
          .join("") || ""
      );
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
