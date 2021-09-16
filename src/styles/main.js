import variables from "@/styles/variables";

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
    ".mosha__toast": {
      minHeight: 54,
      padding: "4px 8px",
    },
    ".mosha__toast__content__text": {
      fontSize: "14px",
      fontWeight: 400,
      marginBottom: 0,
    },
    ".mosha__toast__close-icon:before": {
      top: 0,
    },
    ".main_container": {
      textAlign: "left",
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
    /*Modals styles*/
    ".modal-container": {
      zIndex: 22222,
      position: "relative",
      background: "#fff",
      padding: "10px",
      borderRadius: "4px",
      boxShadow: "0px 0px 13px -4px #000",
      minWidth: "250px",
      maxWidth: "80%",
    },
    ".backdrop-wrapper": {
      width: "90%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      "&:after": {
        content: "''",
        position: "absolute",
        width: "100%",
        background: "#17171773",
        height: "100%",
        left: "0",
        top: "0",
        zIndex: "2222",
      },
    },
  },
  "input-container": {
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
  "btn-default": {
    border: "none",
    padding: "6px 10px",
    fontSize: "13px",
    borderRadius: "4px",
    background: variables.$mainBlueColor,
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
    minWidth: "70px",
    transition: ".2s",
    "&:disabled": {
      background: variables.$btnDisableBg,
      cursor: "default",
    },
    "&:hover:enabled": {
      background: variables.$mainBlueHoverColor,
    },
  },
};
