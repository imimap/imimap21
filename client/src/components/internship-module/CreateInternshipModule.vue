<template v-if="!semesterId && !semesterOfStudy">
  <div class="container clear-top">
    <div id="form-block4" class="text-left">
      <div class="mb-5">
        <h3>Wann möchtest du dein Praktikum absolvieren?</h3>
        <div class="row">
          <div class="col-md-4">
            <div class="field" id="field-titles2">
              <div class="form-group" data-children-count="1">
                <label for="semester-id">Semester</label>
                <select class="form-control" name="semester-id" id="semester-id" ref="semester-id" v-model="semesterId">
                  <option v-for="semester in commingSemesters" :key="semester" :value="semester">
                  </option>
                </select>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="field" id="field-titles2">
              <div class="form-group" data-children-count="1">
                <label for="semester-of-study">Fachsemester</label>
                <input step="1" class="form-control" min="1" max="100" type="number" v-model="semesterOfStudy"
                  name="semester-of-study" id="semester-of-study">
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-4">
            <div class="field" id="field-titles2">
              <button name="commit" class="btn btn-secondary mt-3" data-disable-with="Speichern" v-on:click="save()">
                Speichern
              </button>
            </div>
          </div>
        </div>
      </div>
      <a href="javascript:history.back()">Zurück</a>
    </div>
  </div>
</template>

<script lang="ts">
import { loadUpcomingSemesters } from '@/utils/gateways';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'CreateInternshipModule',
  components: {},
  data() {
    return {
      semesterId: String,
      semesterOfStudy: String,
      commingSemesters: [] as string[],
    };
  },
  methods: {
    save() {
      this.$store.dispatch('addNotification', { text: 'Praktikum erfolgreich angelegt!', type: 'success' });
      this.$router.push({ name: 'InternshipModuleIndex' });
    },
  },
  async mounted() {
    this.commingSemesters = await loadUpcomingSemesters();
  },

});
</script>

<style scoped></style>
