<template>
  <div id="form-block4" class="text-left">
    <h2 class="intern-head"> Praktikumsdetails</h2>
    <div id="askForCreation">
      Du hast noch keine Informationen eingetragen
      <br>
      <button
        type="button"
        class="btn btn-outline-success"
        data-toggle="modal"
        data-target="#consent">
        Jetzt eintragen
      </button>
      <br>
    </div>
    <br>
    <p class="text-center">ODER </p>
    <p class="text-center">
      <a
        class="m-0 btn btn-outline-success"
        data-method="get"
        href="/de/postponements/new"
      >
        Verschiebung beantragen
      </a>
    </p>
  </div>
</template>

<script  lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'NoInternshipModuleComponent',
});
</script>

<style lang="scss">

</style>
