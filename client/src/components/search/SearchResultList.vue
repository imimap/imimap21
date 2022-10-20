<template>
  <div class="container" style="max-width: 100vw;">
    <p class="text-center p-1">
      {{ $tc(resultCountText as string, resultCount as number) }}
    </p>
    <table class="table table-striped table-sm table-borderless text-left">
      <tbody>
      <tr>
        <td class="font-weight-bold">{{ $t("search.company") }}</td>
        <td class="font-weight-bold">{{ $t("search.location") }}</td>
        <td class="font-weight-bold">{{ $t("search.orientation") }}</td>
        <td class="font-weight-bold"></td>
      </tr>
      <!-- Result Loop -->
      <template  v-if="searchResults != undefined && searchResults.length > 0">
        <template v-for="(searchResult) in searchResults"
                  v-bind:key="searchResult._id">
          <SearchResult
            :id="searchResult._id"
            :company-city="searchResult.company?.address?.city"
            :company-email="searchResult.company?.emailAddress"
            :company-name="searchResult.company?.companyName"
            :company-website="searchResult.company?.website"
            :operational-area="searchResult.operationalArea"
            :programming-languages="searchResult.programmingLanguages"
            :tasks="searchResult.tasks">
          </SearchResult>
        </template>
      </template>
      </tbody>
    </table>
  </div>
</template>
<script lang="ts">
import SearchResult from '@/components/search/SearchResult.vue';
import { Internship } from '@/store/types/Internship';
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  name: 'SearchResultList',
  components: { SearchResult },
  props: {
    resultCount: Number,
    resultCountText: String,
    searchResults: { type: Array as PropType<Internship[]> },

  },
});
</script>
