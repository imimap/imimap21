<template>
  <div class="container">
    <div id="form-block4" class="text-left">
    <h4 class="mb-5">
      {{  `${userProfile.firstName} ${userProfile.lastName}
      's Praktikum im ${internshipModule.inSemester}
      (${internshipModule.inSemesterOfStudy}. Fachsemester)` }}
    </h4>
    <div class="card mt-3 mb-3">
      <div class="card-body">
        <table class="table table-sm table-borderless">
          <thead>
            <tr>
              <th scope="col" colspan="2">Modulnummer</th>
              <th scope="col">Modulname</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row" colspan="2">B20</th>
              <!-- @TODO: internshipModule.status-->
              <td>Praxisphase 1: Fachpraktikum im Ausland</td>
              <td>
                {{ internshipModule.status !== 'passed' ? 'noch offen' : 'bestanden' }}
              </td>
            </tr>
            <tr>
              <th></th>
              <th scope="row">B20.1</th>
              <!-- @TODO: internshipModule.aepPassed-->
              <td>Auswertung von Erfahrungen am Praxisplatz</td>
              <td>{{ internshipModule.aepPassed ? 'bestanden' : 'noch offen'}}</td>
            </tr>
            <tr>
              <th></th>
              <th scope="row">B20.2</th>
              <!--
              @TODO: alle internships die den Status passed
              @TODO: haben sollen zusammen eine Dauer von >= 16 Wochen haben
              -->
              <td>Fachpraktikum</td>
              <td>noch offen</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="row">
      <div class="card-deck d-flex">
        <InternshipComponent
          v-for="internship in this.internshipModule.internships"
          v-bind:key="internship._id"
          v-bind:internship="internship"
        />
        <InternshipComponent
          v-for="internship in this.internshipModule.internships"
          v-bind:key="internship._id"
          v-bind:internship="internship"
        />
      </div>
    </div>
    <div class="module-internship-options mt-3 mb-5 d-flex">
      <router-link :to="{name: 'CreateInternship'}">
        Weiteres Teilpraktikum eintragen
      </router-link>
      <router-link :to="{ name: 'CreatePostponement' }">
        Weitere Verschiebung beantragen
      </router-link>
    </div>
    <div>
      <a href="javascript:history.back()">Zurück</a>
    </div>
  </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import InternshipComponent from '@/components/internship-module/Internship.vue';
import { mapState } from 'vuex';
import { InternshipModule } from '@/store/types/InternshipModule';
import { Internship } from '@/store/types/Internship';

export default defineComponent({
  name: 'InternshipModule',
  props: {
    internshipModule: {} as PropType<InternshipModule>,
  },
  components: {
    InternshipComponent,
  },
  computed: {
    ...mapState(['userProfile']),
    durations(): number[] | null {
      return this.getDurationOfPassedInternships();
    },
    passedInternships(): Internship[] | null {
      if (typeof this.internshipModule === 'undefined') return null;
      return this.internshipModule.internships.filter((internship) => internship.status === 'passed');
    },
  },
  methods: {
    getDurationOfPassedInternships(): number[] | null {
      if (this.passedInternships === null) return null;
      const durations = this.passedInternships.flatMap(
        (obj) => new Date(obj.startDate).getTime() - new Date(obj.endDate).getTime(),
      );
      return durations;
    },
  },
});
</script>

<style lang="scss">
.module-internship-options {
  gap: 2rem;
}

.card-deck {
  display: flex;
  flex-direction: column;
  @include media-breakpoint-up(md) {
    flex-flow: row wrap;
    gap: 2rem;
  }
}
</style>
