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
    name: "LearnWords",
    themeColor: "#eaeaea",
    display: "standalone",
    msTileColor: "#000000",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "black",
    orientation: "portrait-primary",
    start_url: "/index.html",
    icons: [
      {
        src: "/img/logoNative.png",
        type: "image/png",
        sizes: "96x96",
      },
    ],
    // configure the workbox plugin
    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      // swSrc is required in InjectManifest mode.
      swSrc: "src/registerServiceWorker.js",
    },
  },
};
