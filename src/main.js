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
import { faAt, faUser, faLock, faKey } from "@fortawesome/free-solid-svg-icons";

library.add(faAt, faUser, faLock, faKey);

const app = createApp(App);
const jss = create(preset());
const { classes } = jss.createStyleSheet(css).attach();
app.config.globalProperties.gClasses = classes;
app.use(store).use(router).component("font-awesome-icon", FontAwesomeIcon);
app.mount("#app");
