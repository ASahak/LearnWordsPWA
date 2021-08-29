<script>
import { h, reactive, onMounted, onDeactivated, ref } from "vue";

export default {
  name: "native-panel",
  setup() {
    const timeInterval = ref(null);
    const state = reactive({
      time: "",
    });

    const getTime = () => {
      const date = new Date();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      state.time =
        (hours < 10 ? "0" + hours : hours) +
        ":" +
        (minutes < 10 ? "0" + minutes : minutes);
    };

    onMounted(() => {
      getTime();
      timeInterval.value = setInterval(() => getTime(), 1000);
    });

    onDeactivated(() => {
      if (timeInterval.value) clearInterval(timeInterval.value);
    });

    return () =>
      h("div", { className: "native--panel" }, [
        <span>{state.time}</span>,
        h(
          "div",
          { className: "right-native--panel" },
          <>
            <img
              src="/img/icons/wifi-signal.png"
              alt=""
              width="12"
              height="10"
            />
            <img
              src="/img/icons/battery-status.png"
              alt=""
              width="18"
              height="16"
            />
          </>
        ),
      ]);
  },
};
</script>
<style>
.native--panel {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  padding: 6px 16px;
  align-items: center;
  height: 26px;
  font-weight: 600;
}

.right-native--panel {
  display: flex;
  align-items: center;
}

.right-native--panel img {
  margin: 0 0 0 8px;
}
</style>
