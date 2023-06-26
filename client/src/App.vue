<template>
  <vue-progress-bar></vue-progress-bar>
  <router-view></router-view>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import http from '@/utils/http-common';
import { LOAD_LANGUAGES } from '@/store/actions';

export default defineComponent({
  name: 'App',
  methods: {
    async loadAPIContent(): Promise<void> {
      await this.$store.dispatch(LOAD_LANGUAGES);
    },
  },
  mounted() {
    //  [App.vue specific] When App.vue is finish loading finish the progress bar
    this.$Progress.finish();
  },
  async created() {
    this.$Progress.start();
    this.$router.beforeEach((to, from, next) => {
      // does the page we want to go to have a meta.progress object
      if (to.meta.progress !== undefined) {
        const meta = to.meta.progress;
        this.$Progress.parseMeta(meta);
      }
      this.$Progress.start();
      next();
    });
    // hook the progress bar to finish after we've finished moving router-view
    this.$router.afterEach(() => {
      this.$Progress.finish();
    });

    http.interceptors.request.use((config) => {
      if (config.url?.indexOf('/info/') === -1) this.$Progress.start();
      return config;
    });

    http.interceptors.response.use((value) => {
      this.$Progress.finish();
      return value;
    }, (error) => {
      this.$Progress.fail();
      throw error;
    });

    await this.loadAPIContent();
  },
});
</script>

<style lang="scss">
html {
  font-family: sans-serif;
  line-height: 1.15;
  height: 100vh;
  -webkit-text-size-adjust: 100%;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

body {
  height: 100%;
  margin: 0;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: $htw-gray-color;
  text-align: left;
  background: #fff url('/assets/bg.gif');
  font-family: 'Merriweather Sans', sans-serif;
}

body.modal-open {
  overflow: hidden;
}

@include media-breakpoint-up(md) {
  html, body {
    min-height: 100%;
    height: 100%;
  }
}

a {
  color: $htw-green-color !important;
  text-decoration: none !important;
  background-color: transparent;
}

#app {
  height: 100%;
  display: flex;
  flex-direction: column;
}

</style>
