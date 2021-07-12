<template>
    <div id="form-block4" class="text-left">
        <h3>Antrag auf Verschiebung des Praktikums</h3>
        <div class="pl-5">
          <div class="row">&nbsp;</div>
          <div class="row">
            <div class="field">
              Ich möchte mein Praktikum nicht im 4. Fachsemester absolvieren.
            </div>
          </div>
          <div class="row">&nbsp;</div>
          <div class="row">
            <div class="field">
              Ich beantrage eine Verschiebung auf das
              <select ndata-form-type="other">
                <option value="2">WS 21/22</option>
                <option value="1">SS 21</option>
                <option value="3">WS 20/21</option></select>
            </div>
          </div>
          <div class="row">&nbsp;</div>
          <div class="row">
            Dieses wird mein
            <div class="form-group max" >
              <label class="sr-only" for="postponementSemester">
                Semester of study
              </label>
              <input
                cols="5"
                class="form-control"
                type="number"
                id="postponementSemester"
                data-form-type="other"/>
            </div>
            . Fachsemester sein.
          </div>
          <div class="row">&nbsp;</div>
          <div class="row">
            <div class="form-group">
              <label for="postponementReason">Begründung</label>
              <textarea
                cols="50"
                rows="10"
                class="form-control"
                id="postponementReason"
                data-form-type="other"/>
            </div>
          </div>
          <div class="row">
            <div class="actions">
              <button
                type="submit"
                class="btn btn-secondary my-4">
                Verschiebung beantragen
              </button>
            </div>
          </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'CreatePostponement',
});
</script>

<style lang="scss">

</style>
