module.exports = {
  transpileDependencies: ['vuex-module-decorators'],
  css: {
    loaderOptions: {
      sass: {
        additionalData: '@import "@/styles/app.scss"; ',
      },
    },
  },
  devServer: {
    public: '0.0.0.0:8080',
  },
};
