function createDebounce() {
  let timeout = null;
  return function (fnc, delayMs) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fnc();
    }, delayMs || 500);
  };
}

function resetState(state, props) {
  props.map((prop) => (state[prop] = ""));
}

export { createDebounce, resetState };
