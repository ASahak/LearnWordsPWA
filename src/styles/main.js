export default {
  "@global": {
    "*": {
      boxSizing: "border-box",
    },
    "#app": {
      fontFamily: "Avenir, Helvetica, Arial, sans-serif",
      "-webkit-font-smoothing": "antialiased",
      "-moz-osx-font-smoothing": "grayscale",
      textAlign: "center",
      color: "#2c3e50",
    },
    ".section-transition--wrapper": {
      zIndex: 222,
      position: "relative",
      overflow: "hidden",
    },

    ".main_container": {
      height: "95vh",
      width: "380px",
      margin: "auto",
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      backgroundSize: "cover",
      backgroundPosition: "center",
      padding: "16px 24px",
      boxSizing: "border-box",
      "& > img": {
        width: "100%",
        height: "100%",
        position: "absolute",
        left: 0,
        top: 0,
      },
    },
    /*router transition*/
    ".route-enter-from": {
      opacity: 0,
      transform: "translateX(10px)",
    },
    ".route-enter-active": {
      transition: "all 0.2s ease-out",
    },
    ".route-leave-to": {
      opacity: 0,
      transition: "all 0.2s ease-out",
      transform: "translateX(-10px)",
    },
    ".route-leave-active": {
      opacity: 0,
      transition: "0s",
    },
  },
  inputContainer: {
    transition: "0.2s",
    transitionProperty: "margin-bottom",
    marginBottom: 0,
    padding: "16px 0",
    flexDirection: "row",
    position: "relative",
    alignItems: "center",
    display: "flex",
    "& > label": {
      fontSize: 12,
      position: "absolute",
      top: 0,
    },
    "& > input": {
      border: "none",
      borderBottom: "2px solid #3333",
      width: "100%",
      outline: "none",
      padding: "8px 8px 8px 30px",
    },
    "& .input-icon": {
      position: "absolute",
      left: 0,
      fontSize: 17,
      color: "#ccc",
    },
    "&.error-field": {
      marginBottom: 10,
    },
    "&.error-field input": {
      borderBottom: "2px solid #ff0000c9",
    },
    "&.error-field .error-msg": {
      position: "absolute",
      bottom: "-8px",
      fontSize: 10,
      color: "#ff0000c9",
    },
  },
};
