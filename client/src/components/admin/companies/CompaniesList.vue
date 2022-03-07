<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <CompaniesListFilters @sortingChange="changeSorting"
                              @searchChange="changeSearch"
                              @reset="resetFilters"
        />
        <div v-if="!isLoading" class="accordion" id="listAccordion">
          <CompaniesListEntry v-for="company in companiesWithSearch"
                              :key="company._id"
                              :company="company"
                              @editCompany="editCompany"
                              @removeCompany="removeCompany"
          />
          <p v-if="companies.length === 0" class="text-center mt-5">
            Momentan sind keine Unternehmen vorhanden.
          </p>
        </div>
        <div v-else class="d-flex justify-content-center">
          <div class="spinner-border text-htw" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!--  <EditCompanyModal :company="selectedCompany" @updateCompany="updateCompany"/>-->
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { getCompaniesList } from '@/utils/gateways';
import Company from '@/models/Company';
import CompaniesListFilters from '@/components/admin/companies/CompaniesListFilters.vue';
import CompaniesListEntry from '@/components/admin/companies/CompaniesListEntry.vue';

export default defineComponent({
  name: 'CompaniesList',
  components: { /* EditCompanyModal, */ CompaniesListEntry, CompaniesListFilters },
  data() {
    return {
      selectedCompany: undefined as Company | undefined,
      companies: [] as Company[],
      search: '',
      isLoading: false,
    };
  },
  computed: {
    companiesWithSearch(): Company[] {
      return this.companies.filter(
        (company) => company.companyName.toLowerCase().includes(this.search)
          || company.branchName.toLowerCase().includes(this.search)
          || company.address.country.toLowerCase().includes(this.search)
          || company.address.city.toLowerCase().includes(this.search),
      );
    },
  },
  mounted() {
    this.updateList();
  },
  methods: {
    async updateList() {
      this.isLoading = true;
      this.companies = await getCompaniesList();
      this.isLoading = false;
    },
    editCompany(company: Company) {
      this.selectedCompany = company;
    },
    removeCompany(company: Company) {
      const index = this.companies.indexOf(company);
      this.companies.splice(index, 1);
    },
    updateCompany(company: Company) {
      // TODO: Implement list entry update logic
    },
    changeSorting(sorting: string) {
      if (sorting === 'companyName' || sorting === 'branchName') {
        this.companies.sort((a, b) => a[sorting].localeCompare(b[sorting]));
      } else if (sorting === 'city' || sorting === 'country') {
        this.companies.sort((a, b) => a.address[sorting].localeCompare(b.address[sorting]));
      } else {
        this.companies.sort(((a, b) => a._id.localeCompare(b._id)));
      }
    },
    changeSearch(searchTerm: string) {
      this.search = searchTerm.toLowerCase();
    },
    resetFilters() {
      this.changeSorting('');
      this.changeSearch('');
    },
  },
});
</script>

<style scoped lang="scss">
template {
  padding: 20px;
}

.text-htw {
  color: rgba(119, 185, 0, 1);
  width: 3rem;
  height: 3rem;
}
</style>
