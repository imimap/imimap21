<template>
  <header>
    <h1>IMIMAP21</h1>
  </header>
  <main>
    <router-view></router-view>
  </main>
  <footer></footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
});
</script>

<style lang="scss">
</style>
