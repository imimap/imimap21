<template v-if="!semesterId && !semesterOfStudy">
  <div class="container clear-top">
    <div id="form-block4">
      <h3>Neues Praktikum</h3>
      <div class="ml-5 mb-5">
        <form role="form"
              accept-charset="UTF-8"
              v-on:submit.prevent>
          <div class="row">
            <div class="col-md-4">
              <div class="field">
                <div class="form-group">
                  <label for="internship_semester_id">
                    Semester
                  </label>
                  <select class="form-control" id="internship_semester_id">
                    <option value="2">WS 21/22</option>
                    <option value="1">SS 21</option>
                    <option value="3">WS 20/21</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-4">
              <div class="field" id="field-titles2">
                <button type="submit" v-on:click="save()" class="btn btn-secondary mt-3">
                  Speichern
                </button>
              </div>
            </div>
          </div>

        </form>
      </div>
      <a href="javascript:history.back()">Zurück</a>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'CreateInternship',
  methods: {
    save() {
      this.$store.dispatch('addNotification', { text: 'Teilpraktikum erfolgreich angelegt!', type: 'success' });
      this.$router.push({ name: 'InternshipModuleIndex' });
    },
  },
});
</script>

<style scoped>

</style>
