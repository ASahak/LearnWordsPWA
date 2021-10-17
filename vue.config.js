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
    msTileColor: "#000000",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "black",
    orientation: "portrait-primary",
    start_url: "/index.html",
    icons: [
      {
        src: "/img/icons/favicon-32x32.png",
        type: "image/png",
        sizes: "32x32",
      },
      {
        src: "/img/icons/favicon-16x16.png",
        type: "image/png",
        sizes: "16x16",
      },
    ],
    iconPaths: {
      favicon32: "img/icons/favicon-32x32.png",
      favicon16: "img/icons/favicon-16x16.png",
      appleTouchIcon: "favicon.ico",
      maskIcon: "favicon.ico",
      msTileImage: "favicon.ico",
    },
    manifestOptions: {
      theme_color: "#eaeaea",
    },
  },
};
