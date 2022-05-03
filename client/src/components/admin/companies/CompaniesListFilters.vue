<template>
  <div class="row mb-3">
    <div class="col-lg-3 col-md-12">
      <select class="form-select"
              aria-label="Sortieren nach"
              v-model="sorting"
              @change="$emit('sortingChange', sorting)">
        <option selected value="">Sortieren nach...</option>
        <option value="companyName">Firmenname</option>
        <option value="branchName">Zweigname</option>
        <option value="city">Ort</option>
        <option value="country">Staat</option>
      </select>
    </div>
    <div class="col-lg-3 col-md-12">
      <input type="text"
             class="form-control"
             placeholder="Suche..."
             aria-label="Suche"
             aria-describedby="suche"
             v-model="search"
             @change="$emit('searchChange', search)"
      >
      <div id="emailHelp" class="form-text">
        Name, Zweig oder Ort
      </div>
    </div>
    <div class="col-lg-3 col-md-12 reset">
      <button @click="reset">Zurücksetzen</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'CompaniesListFilters',
  emits: ['sortingChange', 'searchChange', 'reset'],
  data() {
    return {
      sorting: '',
      search: '',
    };
  },
  methods: {
    reset() {
      this.sorting = '';
      this.search = '';
      this.$emit('reset');
    },
  },
});
</script>

<style scoped lang="scss">
.reset {
  margin-top: 0.5em;
}

.reset > button {
  background: rgba(119, 185, 0, 1);
  color: white;
  border-style: none;
  border-radius: 3px;
  font-size: 15px;
}
</style>
