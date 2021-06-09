module.exports = {
  css: {
    loaderOptions: {
      sass: {
        additionalData: '@import "@/styles/_variables"; @import "~bootstrap/scss/bootstrap";',
      },
    },
  },
};
