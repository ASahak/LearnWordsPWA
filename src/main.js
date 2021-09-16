import { createApp } from "vue";
import App from "./App.vue";
import { create } from "jss";
import preset from "jss-preset-default";
import css from "@/styles/main";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import moshaToast from "mosha-vue-toastify";
import "mosha-vue-toastify/dist/style.css";
import {
  faAt,
  faUser,
  faLock,
  faKey,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import * as firebase from "firebase/app";

(async () => {
  library.add(faAt, faUser, faLock, faKey, faArrowLeft);
  const firebaseConfig = {
    apiKey: "AIzaSyByB2wX-YiwV2vBoxS_T4uasWUVmXE4ZbM",
    authDomain: "learnwords-f4895.firebaseapp.com",
    projectId: "learnwords-f4895",
    storageBucket: "learnwords-f4895.appspot.com",
    messagingSenderId: "347601364219",
    appId: "1:347601364219:web:e1a64634dffc48db6c3c5e",
    measurementId: "G-3K41KD86ZW",
  };
  await firebase.initializeApp(firebaseConfig);

  const app = createApp(App);

  const jss = create(preset());
  const { classes } = jss.createStyleSheet(css).attach();
  app.config.globalProperties.gClasses = classes;
  app
    .use(moshaToast)
    .use(store)
    .use(router)
    .component("font-awesome-icon", FontAwesomeIcon);
  app.mount("#app");
})();
