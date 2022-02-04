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
    </td>
  </tr>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

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
    programmingLanguages: [String],
  },
  data() {
    return {
    };
  },
  methods: {

  },
});
</script>

<style scoped>

</style>
