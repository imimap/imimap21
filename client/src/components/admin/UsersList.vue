<template>
  <div class="container">
    <div class="row">
      <div class="col-12">

        <UsersListFilters :default-semester="defaultSemester"
                          @sortingChange="changeSorting"
                          @semesterChange="updateList"
                          @filterChange="filter => this.statusFilter = filter"
                          @searchChange="searchTerm => this.search = searchTerm"
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

  <EditInternshipModal :student="selectedStudent"/>
  <EditInternshipPartModal :student="selectedStudent"
                           :internship-index="selectedInternshipIndex"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Student from '@/models/Student';
import { getStudent, getStudentsList } from '@/utils/gateways';
import { getDateString, getInternshipModuleDuration, getTimeDifferenceDays } from '@/utils/admin';
import internshipModuleStatusColors from '@/models/InternshipModuleStatus';
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
      selectedStudent: null as Student | null,
      selectedInternshipIndex: 0,
      students: [] as Student[],
      isLoading: false,
      defaultSemester: 'SS2022', // TODO: Load default semester dynamically
      statusFilter: '',
      search: '',
      internshipModuleStatusColors,
    };
  },
  computed: {
    studentsWithSearchAndFilter(): Student[] {
      const search = this.search.toLowerCase();
      return this.students.filter((student) => (student.firstName.toLowerCase().includes(search)
          || student.lastName.toLowerCase().includes(search)
          || student.studentProfile.studentId.toLowerCase().includes(search))
        && student.studentProfile.internship.status.includes(this.statusFilter));
    },
  },
  mounted() {
    this.updateList(this.defaultSemester);
  },
  methods: {
    getDateString,
    getInternshipModuleDuration,
    getTimeDifferenceDays,
    async updateList(semester: string) {
      this.isLoading = true;
      this.students = await getStudentsList(semester) as Student[];
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
    changeSorting(sorting) {
      if (sorting === 'lastName') {
        this.students.sort((a, b) => a[sorting].localeCompare(b[sorting]));
      } else if (sorting === 'studentId') {
        this.students.sort((a, b) => a.studentProfile[sorting]
          .localeCompare(b.studentProfile[sorting]));
      }
    },
    editInternshipModule(student: Student) {
      this.selectedStudent = student;
    },
    editInternshipPart(student: Student, internshipPartIndex: number) {
      this.selectedStudent = student;
      this.selectedInternshipIndex = internshipPartIndex;
    },
    updateInternship(studentId: string, internshipIndex: number, internship: Internship) {
      const index = this.findStudentIndexById(studentId);
      this.students[index].studentProfile.internship.internships[internshipIndex] = internship;
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
