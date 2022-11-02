<template>
  <div class="container">
    <div id="form-block4" class="text-left">
    <h4 class="mb-5">
      <span> {{  `${userProfile.firstName} ${userProfile.lastName}` }}</span>
      <span>
        {{$t("internshipModule.internship") }}
      </span>
      <span>{{ ` ${internshipModule?.inSemester} (${internshipModule?.inSemesterOfStudy}. ` }}</span>
      <span>{{ $t("internshipModule.semester") }}</span>
    </h4>
    <div class="card mt-3 mb-3">
      <div class="card-body">
        <table class="table table-sm table-borderless">
          <thead>
            <tr>
              <th scope="col" colspan="2">{{ $t("internshipModule.moduleNumber") }}</th>
              <th scope="col">{{ $t("internshipModule.moduleName.name") }}</th>
              <th scope="col">{{ $t("internshipModule.status.currentStatus") }}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row" colspan="2">B20</th>
              <td>{{ $t("internshipModule.moduleName.b20") }}</td>
              <td v-if="internshipModule?.status == 'passed'">{{ $t("internshipModule.status.passed") }}</td>
              <td v-else>{{ $t("internshipModule.status.open") }}</td>
            </tr>
            <tr>
              <th></th>
              <th scope="row">B20.1</th>
              <td>{{ $t("internshipModule.moduleName.b201") }}</td>
              <td v-if="internshipModule?.aepPassed">{{ $t("internshipModule.status.passed") }}</td>
              <td v-else>{{ $t("internshipModule.status.open") }}</td>

            </tr>
            <tr>
              <th></th>
              <th scope="row">B20.2</th>
              <!--
              @TODO: alle internships die den Status passed
              @TODO: haben sollen zusammen eine Dauer von >= 16 Wochen haben
              -->
              <td>{{ $t("internshipModule.moduleName.b202") }}</td>
              <td>{{ $t("internshipModule.status.open") }} TODO</td>
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
          v-on:updateInternship="replaceInternship"
        />
      </div>
    </div>
    <div class="module-internship-options mt-3 mb-5 d-flex">
      <router-link :to="{name: 'CreateInternship'}">
        {{ $t("internshipModule.newPartialInternship") }}
      </router-link>
      <router-link :to="{ name: 'CreatePostponement' }">
        {{ $t("internshipModule.newPostponement") }}
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
  emits: ['replaceInternship'],
  computed: {
    ...mapState(['userProfile']),
    durations(): number[] | null {
      if (this.passedInternships === null) return null;
      return this.passedInternships.flatMap(
        (obj) => (
          (new Date(obj.endDate).getTime()
            - new Date(obj.startDate).getTime()) / 1000
        ),
      );
    },
    passedInternships(): Internship[] | null {
      if (typeof this.internshipModule === 'undefined') return null;
      return this.internshipModule.internships.filter(
        (internship) => internship.status === 'planned'
          && typeof internship.startDate !== 'undefined'
          && typeof internship.endDate !== 'undefined'
          && (new Date(internship.endDate) > new Date(internship.startDate)),
      );
    },
  },
  methods: {
    replaceInternship(newInternship: Internship) {
      this.$emit('replaceInternship', newInternship);
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
