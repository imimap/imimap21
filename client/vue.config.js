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
    public: process.env.HOST_NAME,
  },
};
