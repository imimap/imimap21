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
                  <option v-for="(semester, index) in commingSemesters" v-bind:key="index" :value="semester">
                    {{ semester }}
                  </option>
                </select>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="field" id="field-titles2">
              <div class="form-group" data-children-count="1">
                <label for="semester-of-study">Fachsemester</label>
                <input step="1" class="form-control" min="1" max="100" type="number" v-model="message"
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
import { getAuthUserInternship, loadUpcomingSemesters } from '@/utils/gateways';
import { ref, defineComponent } from 'vue';
import http from '@/utils/http-common';

export default defineComponent({
  name: 'CreateInternshipModule',
  components: {},
  data() {
    return {
      semesterId: ref(''),
      semesterOfStudy: 4,
      message: ref('4'),
      commingSemesters: [] as string[],
    };
  },
  methods: {
    async save() {
      const inti = await getAuthUserInternship();
      if (inti) {
        console.log(`/internshipModule/${inti._id}`);
        await http.post(`/internship-modules/${inti._id}`, { inSemester: this.semesterId, inSemesterOfStudy: this.semesterOfStudy });
      }
      this.$store.dispatch('addNotification', { text: 'Praktikum erfolgreich angelegt!', type: 'success' });
      this.$router.push({ name: 'InternshipModuleIndex' });
    },
  },
  async created() {
    this.commingSemesters = await loadUpcomingSemesters();
    const [sem] = this.commingSemesters;
    this.semesterId = sem;
  },

});
</script>

<style scoped></style>
