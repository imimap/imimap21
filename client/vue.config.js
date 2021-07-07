module.exports = {
  transpileDependencies: ['vuex-module-decorators'],
  css: {
    loaderOptions: {
      sass: {
        additionalData: '@import "@/styles/app.scss"; ',
      },
    },
  },
};
