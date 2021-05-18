module.exports = {
  css: {
    loaderOptions: {
      sass: {
        additionalData: '@import "~bootstrap/scss/functions"; @import "~bootstrap/scss/variables"; @import "~bootstrap/scss/mixins"; @import "@/styles/_variables";',
      },
    },
  },
};
