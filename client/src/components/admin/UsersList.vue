<template>
  <div class="container">
    <div class="row">
      <div class="col-12">

        <UsersListFilters @sortingChange="changeSorting"
                          @semesterChange="updateList"
                          @filterChange="changeFilter"
                          @searchChange="changeSearch"
                          @reset="resetFilters"
        />

        <div v-if="!isLoading" class="accordion" id="listAccordion">
          <StudentEntry v-for="(student, index) in studentsWithSearchAndFilter"
                        :key="index"
                        :student="student"
                        @editInternshipModule="editInternshipModule"
                        @editInternshipPart="editInternshipPart"
                        @updateStudent="updateStudent"
                        @updateInternship="updateInternship"
          />
        </div>
        <div v-else class="d-flex justify-content-center">
          <div class="spinner-border text-htw" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <EditInternshipModal :student="selectedStudent" @updateStudent="updateStudent"/>
  <EditInternshipPartModal :student="selectedStudent"
                           :internship-index="selectedInternshipIndex"
                           @updateInternship="updateInternship"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Student from '@/models/Student';
import { getStudent, getStudentsList } from '@/utils/gateways';
import { getDateString, getInternshipModuleDuration, getTimeDifferenceDays } from '@/utils/admin';
import UsersListFilters from '@/components/admin/users-list/UsersListFilters.vue';
import StudentEntry from '@/components/admin/users-list/StudentEntry.vue';
import EditInternshipModal from '@/components/admin/modals/EditInternshipModal.vue';
import EditInternshipPartModal from '@/components/admin/modals/EditInternshipPartModal.vue';
import { showErrorNotification } from '@/utils/notification';
import Internship from '@/models/Internship';

export default defineComponent({
  name: 'UsersList',
  components: {
    EditInternshipPartModal,
    EditInternshipModal,
    StudentEntry,
    UsersListFilters,
  },
  data() {
    return {
      selectedStudent: undefined as Student | undefined,
      selectedInternshipIndex: 0,
      students: [] as Student[],
      isLoading: false,
      statusFilter: '',
      search: '',
    };
  },
  computed: {
    /* eslint-disable no-restricted-syntax */
    studentsWithSearchAndFilter(): Student[] {
      const search = this.search.toLowerCase();
      return this.students.filter((student) => (student.firstName.toLowerCase().includes(search)
          || student.lastName.toLowerCase().includes(search)
          || student.studentProfile.studentId.toLowerCase().includes(search))
       && this.hasStatus(student.studentProfile.internship, this.statusFilter));
    },
  },
  mounted() {
    this.updateList();
  },
  methods: {
    getDateString,
    getInternshipModuleDuration,
    getTimeDifferenceDays,
    async updateList(semester?: string) {
      this.isLoading = true;
      this.students = await getStudentsList(semester === '' ? undefined : semester) as Student[];
      this.isLoading = false;
    },
    findStudentIndexById(studentId: string): number {
      return this.students.findIndex((student) => student._id === studentId);
    },
    async updateStudent(studentId: string) {
      const updatedStudent = await getStudent(studentId);
      if (!updatedStudent) {
        await showErrorNotification(`Fehler beim Laden von Student:in ${studentId}`);
        return;
      }
      const index = this.findStudentIndexById(studentId);
      this.students[index] = updatedStudent;
    },
    changeFilter(filter) {
      this.statusFilter = filter;
    },
    changeSearch(searchTerm) {
      this.search = searchTerm;
    },
    changeSorting(sorting) {
      if (sorting === 'lastName') {
        this.students.sort((a, b) => a[sorting].localeCompare(b[sorting]));
      } else if (sorting === 'studentId') {
        this.students.sort((a, b) => a.studentProfile[sorting]
          .localeCompare(b.studentProfile[sorting]));
      } else {
        this.students.sort((a, b) => a._id.localeCompare(b._id));
      }
    },
    resetFilters() {
      this.changeFilter('');
      this.changeSearch('');
      this.changeSorting('');
      this.updateList();
    },
    editInternshipModule(student: Student) {
      this.selectedStudent = student;
    },
    editInternshipPart(student: Student, internshipPartIndex: number) {
      this.selectedStudent = student;
      this.selectedInternshipIndex = internshipPartIndex;
    },
    updateInternship(studentId: string, internshipIndex: number, internship: Internship) {
      // TODO: Maybe use the updated internship returned by the API for updating the frontend.
      // Currently the updated internship doesn't populate the company, so there is some data
      // missing. Merge updated internship with existing one?
      /*
      const index = this.findStudentIndexById(studentId);
      this.students[index].studentProfile.internship.internships[internshipIndex] = internship;
       */
      this.updateStudent(studentId);
    },
    hasStatus(internship: any, status: string): boolean {
      if (status === '') return true;
      for (const internshipPart of internship.internships) {
        if (internshipPart.status === status) return true;
      }
      return false;
    },
  },
});
</script>

<style scoped lang="scss">
template {
  padding: 20px;
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

.accordion-item .accordion-body {
  background: #eee;
}

.accordion-header button {
  color: #000000;
}

.list-item-label {
  font-size: 0.8rem;
  color: #666666;
  text-transform: uppercase;
}

.text-htw {
  color: rgba(119, 185, 0, 1);
  width: 3rem;
  height: 3rem;
}
</style>
