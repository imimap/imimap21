<template>
  <div class="container">
    <div class="row">
      <div class="col-lg-4 col-md-6">
        <div class="card text-center">
          <div class="card-body">
            <p v-if="!loadingInternshipModuleCount" class="large-number">
              {{ internshipModuleCount }}
            </p>
            <div v-else class="d-flex justify-content-center m-4">
              <div class="spinner-border text-htw" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            <p class="card-text">{{ $t("adminDashboard.internships.incomplete") }}</p>

            <router-link class="btn btn-success text-white"
                         to="users">{{ $t("adminDashboard.internships.edit") }}
            </router-link>
          </div>
        </div>
      </div>
      <div class="col-lg-4 col-md-6">
        <div class="card text-center">
          <div class="card-body">
            <p v-if="!loadingPostponementsCount" class="large-number">
              {{ postponementsCount }}
            </p>
            <div v-else class="d-flex justify-content-center m-4">
              <div class="spinner-border text-htw" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            <p class="card-text">{{ $t("adminDashboard.postponements.open") }}</p>

            <router-link class="btn btn-success text-white"
                         to="postponements">{{ $t("adminDashboard.postponements.edit") }}
            </router-link>
          </div>
        </div>
      </div>
      <div class="col-lg-4 col-md-6">
        <div class="card text-center">
          <div class="card-body">
            <p v-if="!loadingCompaniesCount" class="large-number">
              {{ companiesCount }}
            </p>
            <div v-else class="d-flex justify-content-center m-4">
              <div class="spinner-border text-htw" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            <p class="card-text">{{ $t("adminDashboard.companies.registered") }}</p>

            <router-link class="btn btn-success text-white"
                         to="companies">{{ $t("adminDashboard.companies.edit") }}
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { getCompaniesList, getPostponementsList, getStudentsList } from '@/utils/gateways';

export default defineComponent({
  name: 'Dashboard',
  data() {
    return {
      internshipModuleCount: 0,
      loadingInternshipModuleCount: false,
      postponementsCount: 0,
      loadingPostponementsCount: false,
      companiesCount: 0,
      loadingCompaniesCount: false,
    };
  },
  mounted() {
    this.getInternshipModuleCount();
    this.getPostponementCount();
    this.getCompaniesCount();
  },
  methods: {
    getUpcomingSemester(): string {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      // Attention: Month is zero-based!
      if (currentMonth >= 3 && currentMonth < 9) {
        // Currently: summer semester, get upcoming winter semester
        return `WS${currentDate.getFullYear() + 1}`;
      }
      // Currently: Winter semester, get upcoming summer semester
      return `SS${currentDate.getFullYear()}`;
    },
    async getInternshipModuleCount() {
      this.loadingInternshipModuleCount = true;
      const students = await getStudentsList(this.getUpcomingSemester());
      this.internshipModuleCount = students.filter((student) => student.studentProfile.internship
        .status === 'planned').length;
      this.loadingInternshipModuleCount = false;
    },
    async getPostponementCount() {
      this.loadingPostponementsCount = true;
      const postponements = await getPostponementsList();
      this.postponementsCount = postponements.length;
      this.loadingPostponementsCount = false;
    },
    async getCompaniesCount() {
      this.loadingCompaniesCount = true;
      const companies = await getCompaniesList();
      this.companiesCount = companies.length;
      this.loadingCompaniesCount = false;
    },
  },
});
</script>

<style scoped>
template {
  padding: 20px;
}

.card .large-number {
  font-size: 5rem;
}

.btn-success {
  background: rgba(119, 185, 0, 0.9);
  border-color: rgba(119, 185, 0, 0.9);
}

.btn-success:hover, .btn-success:active, .btn-success:focus {
  background: rgba(119, 185, 0, 1);
  border-color: rgba(119, 185, 0, 1);
}

.table-nav button {
  margin-right: 20px;
}

.text-htw {
  color: rgba(119, 185, 0, 1);
  width: 5rem;
  height: 5rem;
}

</style>
