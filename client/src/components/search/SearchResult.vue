<template>
  <tr>
    <td>{{ companyName }}</td>
    <td>{{ companyCity }}</td>
    <td>{{ operationalArea }}</td>
    <td>
      <button class="btn btn-outline-htw-green float-right"
              data-bs-toggle="collapse"
              :data-bs-target="'#collapseResult' + id"
              aria-expanded="false"
              :aria-controls="'#collapseResult' + id">
        Details
      </button>
    </td>
  </tr>
  <tr class="collapse" :id="'collapseResult' + id">
    <td colspan="7">
      <p class="pl-3">
        <strong>{{ $t("search.programmingLanguages") }}</strong>
        {{
          programmingLanguages?.length > 0
            ? programmingLanguages?.toString()
            :  'Keine Angabe'
        }}
      </p>
      <p class="pl-3">
        <strong>{{ $t("search.website") }}</strong>
        <a :href="companyWebsite" target="_blank">
          {{ companyWebsite }}
        </a>
      </p>
      <p class="pl-3">
        <strong>{{ $t("search.tasks") }}</strong>
        {{ tasks }}
      </p>
      <p class="pl-3">
        <strong>{{ $t("search.contact") }}</strong>
        {{ companyEmail }}
      </p>
      <p v-if="startDate" class="pl-3">
        <strong>{{ $t("search.startDate") }}</strong>
        {{ normalizedDate(startDate) }}
      </p>
      <p v-if="endDate" class="pl-3">
        <strong>{{ $t("search.endDate") }}</strong>
        {{ normalizedDate(endDate) }}
      </p>
      <p v-if="workingHoursPerWeek" class="pl-3">
        <strong>{{ $t("search.workingHoursPerWeek") }}</strong>
        {{ workingHoursPerWeek }}
      </p>
      <div v-if="supervisor">
        <strong>{{ $t("search.supervisor") }}</strong>
        <p class="pl-3 d-inline" v-if="supervisor.fullName">{{ supervisor.fullName }} , </p>
        <p class="pl-3 d-inline " v-if="supervisor.emailAddress">{{ supervisor.emailAddress }}</p>
      </div>
    </td>
  </tr>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  name: 'SearchResult',
  props: {
    id: String,
    companyCity: String,
    companyEmail: String,
    companyName: String,
    companyWebsite: String,
    tasks: String,
    operationalArea: String,
    programmingLanguages: {
      type: Array as PropType<string[]>,
      default() { return []; },
    },
    startDate: String,
    endDate: String,
    workingHoursPerWeek: Number,
    supervisor: {
      type: Object,
    },
  },
  methods: {
    normalizedDate(date: string | undefined): string | undefined {
      if (!date) return undefined;
      const dateWithoutTime = new Date(date).toISOString().split('T')[0].toString();
      return dateWithoutTime;
    },
  },
});
</script>

<style scoped>

</style>
