<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <PostponementsListFilters @sortingChange="changeSorting"
                                  @searchChange="changeSearch"
                                  @reset="resetFilters"
        />

        <div v-if="!isLoading" class="accordion" id="listAccordion">
          <PostponementsListEntry v-for="postponement in postponementRequestsWithSearch"
                                  :key="postponement._id"
                                  :postponement="postponement"
                                  @removePostponement="removePostponement"
                                  @editPostponement="editPostponement"
          />
          <p v-if="postponementRequests.length === 0" class="text-center mt-5">
            Momentan sind keine Verschiebungsanträge vorhanden.
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

  <EditPostponementModal :postponement="selectedPostponement"
                         @updatePostponement="updatePostponement"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { getPostponementsList } from '@/utils/gateways';
import Postponement from '@/models/Postponement';
import PostponementsListFilters
  from '@/components/admin/postponement-requests/PostponementsListFilters.vue';
import PostponementsListEntry
  from '@/components/admin/postponement-requests/PostponementsListEntry.vue';
import EditPostponementModal from '@/components/admin/modals/EditPostponementModal.vue';

export default defineComponent({
  name: 'PostponementsList',
  components: { EditPostponementModal, PostponementsListEntry, PostponementsListFilters },
  data() {
    return {
      postponementRequests: [] as Postponement[],
      sorting: '',
      search: '',
      isLoading: false,
      selectedPostponement: undefined as Postponement | undefined,
    };
  },
  computed: {
    postponementRequestsWithSearch(): Postponement[] {
      return this.postponementRequests.filter(
        (postponement) => postponement.user.firstName.toLowerCase().includes(this.search)
          || postponement.user.lastName.toLowerCase().includes(this.search)
          || postponement.user.studentProfile.studentId.toLowerCase().includes(this.search),
      );
    },
  },
  mounted() {
    this.updateList();
  },
  methods: {
    async updateList() {
      this.isLoading = true;
      this.postponementRequests = await getPostponementsList();
      this.isLoading = false;
    },
    resetFilters() {
      this.changeSorting('');
      this.changeSearch('');
    },
    changeSorting(sorting: string) {
      if (sorting === 'lastName') {
        this.postponementRequests.sort((a, b) => a.user[sorting].localeCompare(b.user[sorting]));
      } else if (sorting === 'studentId') {
        this.postponementRequests.sort(
          (a, b) => a.user.studentProfile[sorting].localeCompare(b.user.studentProfile[sorting]),
        );
      } else {
        this.postponementRequests.sort((a, b) => a._id.localeCompare(b._id));
      }
    },
    changeSearch(searchTerm: string) {
      this.search = searchTerm.toLowerCase();
    },
    removePostponement(postponement: Postponement) {
      const index = this.postponementRequests.indexOf(postponement);
      this.postponementRequests.splice(index, 1);
    },
    editPostponement(postponement: Postponement) {
      this.selectedPostponement = postponement;
    },
    updatePostponement(postponement: Postponement) {
      const index = this.postponementRequests.findIndex((p) => p._id === postponement._id);
      this.postponementRequests[index].newSemester = postponement.newSemester;
      this.postponementRequests[index].newSemesterOfStudy = postponement.newSemesterOfStudy;
      this.postponementRequests[index].reason = postponement.reason;
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
