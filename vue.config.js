module.exports = {
  runtimeCompiler: true,
  css: {
    loaderOptions: {
      scss: {
        additionalData: `
          @import "@/styles/_variables.scss";
          @import "@/styles/_extends.scss";
        `,
      },
    },
  },
  pwa: {
    name: "Learn Words PWA",
    themeColor: "#4DBA87",
    msTileColor: "#000000",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "black",

    // configure the workbox plugin
    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      // swSrc is required in InjectManifest mode.
      swSrc: "registerServiceWorker.js",
    },
  },
};
