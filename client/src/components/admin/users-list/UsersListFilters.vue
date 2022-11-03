<template>
  <div class="row">
    <div class="col-lg-3 col-md-12 mb-3">
      <select class="form-select"
              aria-label="Sortieren nach"
              v-model="sorting"
              @change="$emit('sortingChange', sorting)"
      >
        <option selected value="">{{ $t("userList.sortBy") }}</option>
        <option value="lastName">{{ $t("userList.lastName") }}</option>
        <option value="studentId">{{ $t("userList.matriculationNumber") }}</option>
      </select>
    </div>
    <div class="col-lg-3 col-md-12 mb-3">
      <select class="form-select"
              aria-label="Semester filtern nach"
              v-model="semester"
              @change="$emit('semesterChange', semester)"
      >
        <option selected value="">{{ $t("userList.allSemesters") }}</option>
        <option v-for="semester in availableSemesters"
                :key="semester"
                :value="semester"
        >
          {{ semester }}
        </option>
      </select>
    </div>
    <div class="col-lg-3 col-md-12 mb-3">
      <select class="form-select"
              aria-label="Filtern nach"
              v-model="filter"
              @change="$emit('filterChange', filter)"
      >
        <option selected value="">{{ $t("userList.allStatus") }}</option>
        <option v-for="status in availableStatuses"
                :key="status"
                :value="status">
          {{ status }}
        </option>
      </select>
    </div>
    <div class="col-lg-3 col-md-12 mb-3">
      <input type="text"
             class="form-control"
             :placeholder="$t('userList.search')"
             aria-label="Suche"
             aria-describedby="suche"
             v-model="search"
             @input="$emit('searchChange', search)"
      >
      <div id="emailHelp" class="form-text">{{ $t("userList.matriculationOrLastName") }}</div>
    </div>
    <div class="col-lg-3 col-md-12 mb-3 offset-lg-9 reset">
      <button @click="reset">{{ $t("userList.reset") }}</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { loadAvailableSemesters } from '@/utils/gateways';

export default defineComponent({
  name: 'UsersListFilters',
  emits: ['sortingChange', 'semesterChange', 'filterChange', 'searchChange', 'reset'],
  data() {
    return {
      sorting: '',
      filter: '',
      search: '',
      semester: '',
      availableSemesters: [] as string[],
      availableStatuses: [
        'unknown',
        'planned',
        'postponement requested',
        'postponement rejected',
        'passed',
      ] as string[], // TODO: Load statuses dynamically from API
    };
  },
  methods: {
    reset() {
      this.sorting = '';
      this.filter = '';
      this.semester = '';
      this.search = '';
      this.$emit('reset');
    },
  },
  async mounted() {
    this.availableSemesters = await loadAvailableSemesters();
  },
});
</script>

<style scoped lang="scss">
.reset {
  text-align: right;
}

.reset > button {
  background: rgba(119, 185, 0, 1);
  color: white;
  border-style: none;
  border-radius: 3px;
  font-size: 15px;
}
</style>
