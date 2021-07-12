<template>
  <div class="container m-auto">
    <h1>Sorry, nichts gefunden unter dieser URL :/</h1>
    <a href="javascript:history.back()">Zurück</a>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PageNotFound',
});
</script>

<style scoped>

</style>
