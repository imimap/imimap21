<template>
  <!-- Modal -->
  <div
    class="text-left modal fade"
    id="tooManyResultsModal"
    tabindex="-1"
    aria-labelledby="tooManyResultsModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">
            {{ $t("internshipModule.tooManyResults.headline") }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close">
          </button>
        </div>
        <div class="modal-body text-left">
          <p>
            {{ $t("search.tooManyResults.resultCount") }}
            {{ $t("search.tooManyResults.previousResultCount") }}
          </p>
          <p> {{ $t("search.tooManyResults.question") }} </p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger" data-bs-dismiss="modal" aria-label="Back">
            {{ $t("search.tooManyResults.buttonDecline") }}
          </button>
          <button
            type="button"
            class="btn btn-htw-green"
            data-bs-dismiss="modal"
            aria-label="Continue"
            v-on:click="$emit('search')">
            {{ $t("search.tooManyResults.buttonConfirm") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script  lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'TooManyResults',
});
</script>

<style lang="scss">

</style>
