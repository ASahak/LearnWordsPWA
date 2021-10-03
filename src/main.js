import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import moshaToast from "mosha-vue-toastify";
import Indicator from "vue3-loading-overlay";
import "vue3-loading-overlay/dist/vue3-loading-overlay.css";
import "mosha-vue-toastify/dist/style.css";
import {
  faAt,
  faBook,
  faUser,
  faLock,
  faObjectGroup,
  faKey,
  faFileWord,
  faArrowLeft,
  faParagraph,
  faUserAlt,
} from "@fortawesome/free-solid-svg-icons";
import * as firebase from "firebase/app";

(async () => {
  library.add(
    faObjectGroup,
    faFileWord,
    faUserAlt,
    faAt,
    faUser,
    faLock,
    faKey,
    faParagraph,
    faArrowLeft,
    faBook
  );

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

  app
    .use(moshaToast)
    .use(Indicator)
    .use(store)
    .use(router)
    .component("font-awesome-icon", FontAwesomeIcon);
  app.mount("#app");
})();
