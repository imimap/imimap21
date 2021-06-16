<template>
  <!-- Modal -->
  <div
    class="text-left modal fade"
    id="consentModal"
    tabindex="-1"
    aria-labelledby="consentModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">
            {{ $t("internshipModule.consent.headline") }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close">
          </button>
        </div>
        <div class="modal-body text-left">
          <h6>{{ $t("internshipModule.consent.subHeadline1") }}</h6>
          <p>{{ $t("internshipModule.consent.content") }}</p>
          <h6>{{ $t("internshipModule.consent.subHeadline2") }}</h6>
          <p>
            {{ $t("internshipModule.consent.deleteData") }}
            <a href="mailto:imi-praktikum@htw-berlin.de">imi-praktikum@htw-berlin.de</a>.
          </p>
          <h6>{{ $t("internshipModule.consent.subHeadline3") }}</h6>
          <p>
            {{ $t("internshipModule.consent.detailedInformation") }}
            <a target="blank" href="https://www.htw-berlin.de/datenschutz/">HTW Berlin</a>.</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger" data-bs-dismiss="modal">
            {{ $t("internshipModule.consent.buttonDecline") }}
          </button>
          <button
            type="button"
            class="btn btn-htw-green"
            data-bs-dismiss="modal"
            aria-label="Close"
            v-on:click="this.$router.push({ name: 'CreateInternshipModule' })">
            {{ $t("internshipModule.consent.buttonConfirm") }}
          </button>
        </div>
      </div>
    </div>
  </div>
  <div id="form-block4" class="text-center">
    <h2 class="intern-head"> Praktikumsdetails</h2>
    <div id="askForCreation">
      Du hast noch keine Informationen eingetragen
      <br>
      <!-- Button trigger modal -->
      <button
        type="button"
        class="btn btn-htw-green"
        data-bs-toggle="modal"
        data-bs-target="#consentModal"
      >
        Jetzt eintragen
      </button>
    </div>
    <br>
    <p class="text-center">ODER </p>
    <p class="text-center">
      <a
        class="m-0 btn btn-outline-htw-green"
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
  methods: {
    openModal(event) {
      console.log(event.target);
      const body = document.querySelector('body');
      console.log(body);
    },
  },
});
</script>

<style lang="scss">

</style>
