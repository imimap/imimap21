<template>
  <div class="card mb-3">
    <div class="card-header">
      {{
        getDateString(internship.startDate) + ' - '
        + getDateString(internship.endDate)
      }}
      <span
        :class="['badge', 'rounded-pill', 'float-end', statusBadgeColors[(internship as any).status]] ">
        {{ internship.status }}
      </span>
    </div>
    <div class="card-body">
      <h5 class="card-title">{{ internship.company.companyName }}</h5>
      <h6 class="card-subtitle mb-2 text-muted">
        {{ internship.company.address?.city }},
        {{ internship.company.address?.country }}
      </h6>
      <div class="row">
        <div class="col-lg-4 col-md-12 mb-2">
          <span class="fw-bold list-item-label"> {{ $t("userList.internshipPart.duration") }}</span><br>
          {{ duration.weeks }} {{ $t("userList.internshipPart.weeks") }}, {{ duration.days }} {{ $t("userList.internshipPart.days") }}
        </div>
        <div class="col-lg-8 col-md-12 mb-2 status-internship-part">
          <span class="fw-bold list-item-label">Status</span>
          <br>
          <ul class="list-group">
            <UsersListStatusItem
              v-for="pdf in pdfItems"
              :key="pdf"
              :text="$t(`userList.internshipPart.pdfs.${pdf}`)"
              :item="internship[`${pdf}Pdf`]"
              :type="pdf"
              :internshipId="internship._id"
              @accept-pdf="pdfAccepted"
              @reject-pdf="pdfRejected"
            />
          </ul>
        </div>
      </div>
    </div>
    <div class="card-footer">
      <details>
        <summary class="fw-bold">{{ $t('userList.internshipPart.comments') }}</summary>
        <CommentBox
          :internship-id="internship._id"
          @update-internship="(i) => $emit('updateInternship', index, i)"
        />
        <AdminComment
          v-for="comment in comments"
          :key="comment._id"
          :comment="comment"
          @delete-comment="deleteAdminComment(comment)"
        />
      </details>
    </div>
    <div class="card-footer">
      <button v-if="showApproveButton" class="btn btn-success btn-sm me-2"
              @click="approveApplication(internship._id)"
      >
        {{ $t("userList.internshipPart.approveApplication") }}
      </button>
      <button v-if="showOverButton" class="btn btn-success btn-sm me-2"
              @click="markAsOver(internship._id)"
      >
        Mark OVER
      </button>
      <button class="btn btn-success btn-sm me-2"
              v-if="showMarkCompleteButton"
              @click="markAsComplete(internship._id)"
      >
        {{ $t("userList.internshipPart.markEligible") }}
      </button>
      <button type="button" class="btn btn-secondary btn-sm me-2"
              data-bs-toggle="modal"
              data-bs-target="#internshipPartEditModal"
              @click="$emit('editInternshipPart', index)"
      >
        {{ $t("userList.internshipPart.editDetails") }}
      </button>
      <button class="btn btn-danger btn-sm me-2"
              @click="deleteInternshipPart(internship._id)"
      >
        {{ $t("userList.internshipPart.delete") }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
// TODO: Implement custom alert box
/* eslint-disable no-alert */
import { defineComponent, PropType } from 'vue';
import { getDateString, getTimeDifferenceDays } from '@/utils/admin';
import { showErrorNotification } from '@/utils/notification';
import {
  acceptPdf,
  approveInternshipApplication,
  deleteComment,
  deleteInternship,
  markInternshipAsOver,
  markInternshipAsPassed,
  rejectPdf,
} from '@/utils/gateways';
import { Comment } from '@/store/types/Comment';
import { Internship } from '@/store/types/Internship';
import UsersListStatusItem from '@/components/admin/users-list/UsersListStatusItem.vue';
import AdminComment from '@/components/admin/users-list/AdminComment.vue';
import CommentBox from '@/components/admin/users-list/CommentBox.vue';
import statusBadgeColors from '@/utils/statusBadgeColors';

export default defineComponent({
  name: 'InternshipPart',
  components: {
    CommentBox,
    AdminComment,
    UsersListStatusItem,
  },
  props: {
    internship: {
      type: Object as PropType<Internship>,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
  },
  emits: ['editInternshipPart', 'updateInternship', 'updateInternshipPdf'],
  data() {
    return {
      statusBadgeColors: statusBadgeColors(),
      pdfItems: [
        'request',
        'lsfEctsProof',
        'locationJustification',
        'contract',
        'bvgTicketExemption',
        'certificate',
        'report',
      ],
    };
  },
  computed: {
    duration(): { weeks: number; days: number } {
      const durationInDays = getTimeDifferenceDays(this.internship.startDate,
        this.internship.endDate);
      const weeks = Math.floor(durationInDays / 7);
      const days = Math.floor(durationInDays) % 7;
      return { weeks, days };
    },
    comments(): Comment[] {
      return this.internship.comments.slice().reverse();
    },
    showApproveButton(): boolean {
      // Also show button when status is 'planned' to allow manual approving
      // for admins even if not all preconditions for approving are met
      return this.internship.status === 'planned' || this.internship.status === 'requested';
    },
    showOverButton(): boolean {
      // Also show button when status is 'planned' to allow manual approving
      // for admins even if not all preconditions for approving are met
      return this.internship.status === 'approved';
    },
    showMarkCompleteButton(): boolean {
      // Also show button when status is 'over' to allow manual completion
      // for admins even if not all preconditions for grading are met
      return this.internship.status === 'over' || this.internship.status === 'readyForGrading';
    },
  },
  methods: {
    getDateString,
    getTimeDifferenceDays,
    async approveApplication(internshipId: string) {
      let updatedInternship = await approveInternshipApplication(internshipId);
      if (!updatedInternship) {
        const userDoubleChecked = window.confirm('Das Praktikum ist noch nicht bereit, '
          + 'genehmigt zu werden, weil gewisse Unterlagen oder Angaben zum Praktikum fehlen. '
          + 'Trotzdem genehmigen?');
        if (!userDoubleChecked) return;
        updatedInternship = await approveInternshipApplication(internshipId, true);
        if (!updatedInternship) {
          await showErrorNotification('Praktikum konnte nicht als anrechenbar markiert werden.');
          return;
        }
      }
      this.$emit('updateInternship', this.index, updatedInternship);
    },
    async markAsOver(internshipId: string) {
      let updatedInternship = await markInternshipAsOver(internshipId, true);
      if (!updatedInternship) {
        const userDoubleChecked = window.confirm('Das Praktikum ist noch nicht bereit, '
          + 'als vorbei markiert zu werden, weil die Zeit nicht um ist. '
          + 'Trotzdem als vorbei markieren?');
        if (!userDoubleChecked) return;
        updatedInternship = await markInternshipAsPassed(internshipId, true);
        if (!updatedInternship) {
          await showErrorNotification('Praktikum konnte nicht over gesetzt werden.');
          return;
        }
      }
      this.$emit('updateInternship', this.index, updatedInternship);
    },
    async markAsComplete(internshipId: string) {
      let updatedInternship = await markInternshipAsPassed(internshipId);
      if (!updatedInternship) {
        const userDoubleChecked = window.confirm('Das Praktikum ist noch nicht bereit, '
          + 'als anrechenbar markiert zu werden, weil gewisse Unterlagen fehlen. '
          + 'Trotzdem als anrechenbar markieren?');
        if (!userDoubleChecked) return;
        updatedInternship = await markInternshipAsPassed(internshipId, true);
        if (!updatedInternship) {
          await showErrorNotification('Praktikum konnte nicht genehmigt werden.');
          return;
        }
      }
      this.$emit('updateInternship', this.index, updatedInternship);
    },
    async deleteInternshipPart(internshipId: string) {
      const userDoubleChecked = window.confirm('(Teil-)Praktikum wirklich löschen?');
      if (!userDoubleChecked) return;
      await deleteInternship(internshipId);
      this.$emit('updateInternship', this.index, null);
    },
    async deleteAdminComment(comment: Comment) {
      const updatedInternship = await deleteComment(this.internship._id, comment._id);
      if (!updatedInternship) return;
      this.$emit('updateInternship', this.index, updatedInternship);
    },
    async pdfAccepted(pdfType: string) {
      const updatedInternship = await acceptPdf(this.internship._id, pdfType);
      if (!updatedInternship) return;
      this.$emit('updateInternship', this.index, updatedInternship);
    },
    async pdfRejected(pdfType: string, reason: string) {
      const updatedInternship = await rejectPdf(this.internship._id, pdfType, reason);
      if (!updatedInternship) return;
      this.$emit('updateInternship', this.index, updatedInternship);
    },
  },
});
</script>

<style scoped lang="scss">
details[open] > * {
  margin-bottom: 1em;

  &:first-child, &:last-child {
    margin-bottom: 0.5em;
  }
}
</style>
