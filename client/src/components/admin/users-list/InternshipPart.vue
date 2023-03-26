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
              :text="$t('userList.internshipPart.application')"
              :item="internship.requestPdf"
            />
            <UsersListStatusItem
              :text="$t('userList.internshipPart.ectProof')"
              :item="internship.lsfEctsProofPdf"
            />
            <UsersListStatusItem
              :text="$t('userList.internshipPart.locationProof')"
              :item="internship.locationJustificationPdf"
            />
            <UsersListStatusItem
              :text="$t('userList.internshipPart.contract')"
              :item="internship.contractPdf"
            />
            <UsersListStatusItem
              :text="$t('userList.internshipPart.bvg')"
              :item="internship.bvgTicketExemptionPdf"
            />
            <UsersListStatusItem
              :text="$t('userList.internshipPart.certificate')"
              :item="internship.certificatePdf"
            />
            <UsersListStatusItem
              :text="$t('userList.internshipPart.report')"
              :item="internship.reportPdf"
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
      <button class="btn btn-success btn-sm me-2"
              @click="approveApplication(internship._id)"
      >
        {{ $t("userList.internshipPart.approveApplication") }}
      </button>
      <button class="btn btn-success btn-sm me-2"
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
  approveInternshipApplication, deleteComment, deleteInternship, markInternshipAsPassed, updateInternship,
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
  emits: ['editInternshipPart', 'updateInternship'],
  data() {
    return {
      statusBadgeColors: statusBadgeColors(),
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
  },
  methods: {
    updateInternship,
    getDateString,
    getTimeDifferenceDays,
    async approveApplication(internshipId: string) {
      const userDoubleChecked = window.confirm('Antrag zum Praktikum wirklich genehmigen?');
      if (!userDoubleChecked) return;
      const updatedInternship = await approveInternshipApplication(internshipId);
      if (!updatedInternship) {
        await showErrorNotification('Praktikumsantrag konnte nicht genehmigt werden.');
        return;
      }
      this.$emit('updateInternship', this.index, updatedInternship);
    },
    async markAsComplete(internshipId: string) {
      const userDoubleChecked = window
        .confirm('Teilpraktikum wirklich als anrechenbar markieren?');
      if (!userDoubleChecked) return;
      const updatedInternship = await markInternshipAsPassed(internshipId);
      if (!updatedInternship) {
        await showErrorNotification('Praktikum konnte nicht als anrechenbar markiert werden.');
        return;
      }
      this.$emit('updateInternship', this.index, updatedInternship);
    },
    async deleteInternshipPart(internshipId: string) {
      const userDoubleChecked = window.confirm('Teilpraktikum wirklich löschen?');
      if (!userDoubleChecked) return;
      await deleteInternship(internshipId);
      this.$emit('updateInternship', this.index, null);
    },
    async deleteAdminComment(comment: Comment) {
      const updatedInternship = await deleteComment(this.internship._id, comment._id);
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
