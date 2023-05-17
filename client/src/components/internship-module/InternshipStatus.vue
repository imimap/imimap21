<template>
  <!-- Status: planned -->
  <div v-if="internship.status === 'planned'">
    <div v-if="missingDocuments && missingDocuments?.length > 0">
      {{ $t("internshipModule.status.missingPart1") }}
      <span class="fw-bold">{{ $t("internshipModule.status.documents") }}</span>
      {{ $t("internshipModule.status.missingPart2") }}
      <ul class="mt-2" v-for="doc in missingDocuments" :key="doc">
        <li>{{ doc }}</li>
      </ul>
      <p>{{ $t("internshipModule.status.pleaseUpload") }}</p>
    </div>
    <div v-if="missingFields && missingFields?.length > 0">
      {{ $t("internshipModule.status.missingPart1") }}
      <span class="fw-bold">{{ $t("internshipModule.status.details") }}</span>
      {{ $t("internshipModule.status.missingPart2") }}
      <ul class="mt-2" v-for="field in missingFields" :key="field">
        <li>{{ field }}</li>
      </ul>
      <p>{{ $t("internshipModule.status.pleaseEditInternship") }}</p>
    </div>
  </div>
  <!-- Status: requested -->
  <div v-if="internship.status === 'requested'">
    <p> {{ $t("internshipModule.status.requestedExplanation") }}</p>
  </div>
  <!-- Status: approved -->
  <div v-if="internship.status === 'approved'">
    <p> {{ $t("internshipModule.status.approvedExplanation") }}</p>
  </div>
  <!-- Status: over -->
  <div v-if="internship.status === 'over'">
    <div v-if="missingProof && missingProof?.length > 0">
      {{ $t("internshipModule.status.missingProofPart1") }}
      <span class="fw-bold">{{ $t("internshipModule.status.documents") }}</span>
      {{ $t("internshipModule.status.missingProofPart2") }}
      <ul class="mt-2" v-for="doc in missingProof" :key="doc">
        <li>{{ doc }}</li>
      </ul>
    </div>
  </div>
  <!-- Status: readyForGrading -->
  <div v-if="internship.status === 'readyForGrading'">
    <p> {{ $t("internshipModule.status.readyForGradingExplanation") }}</p>
  </div>
  <!-- Status: passed -->
  <div v-if="internship.status === 'passed'">
    <p> {{ $t("internshipModule.status.passedExplanation") }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Internship } from '@/store/types/Internship';

export default defineComponent({
  name: 'InternshipStatus',
  props: {
    internship: {
      type: Object as () => Internship,
      required: true,
    },
  },
  computed: {
    missingFields(): string[] | null {
      if (!this.internship) return null;
      const requiredFields = [
        { startDate: `${this.$t('internshipModule.startDate')}` },
        { endDate: `${this.$t('internshipModule.endDate')}` },
        { operationalArea: `${this.$t('internshipModule.operationalArea')}` },
        { tasks: `${this.$t('internshipModule.tasks')}` },
        { workingHoursPerWeek: `${this.$t('internshipModule.workingHoursPerWeek')}` },

      ];
      const missingFields = [] as string[];
      // eslint-disable-next-line no-restricted-syntax
      for (const field of requiredFields) {
        if (!Object.prototype.hasOwnProperty.call(this.internship, Object.keys(field)[0])) missingFields.push(Object.values(field)[0]);
      }
      const supervisorExists = this.internship.supervisor;
      // nested object
      if (!supervisorExists || !this.internship.supervisor?.fullName || this.internship.supervisor?.fullName.length < 1) {
        missingFields.push(`${this.$t('company.supervisor.name')}`);
      }
      if (!supervisorExists || !this.internship.supervisor?.emailAddress || this.internship.supervisor?.emailAddress.length < 1) {
        missingFields.push(`${this.$t('company.supervisor.email')}`);
      }
      return missingFields;
    },
    missingDocuments(): string[] | null {
      const requiredPdfs = [
        { lsfEctsProofPdf: `${this.$t('internshipModule.status.lsfEctsProofPdf')}` },
        { contractPdf: `${this.$t('internshipModule.status.contractPdf')}` },
        { requestPdf: `${this.$t('internshipModule.status.requestPdf')}` },
      ];
      const missingDocuments = [] as string[];
      // eslint-disable-next-line no-restricted-syntax
      for (const doc of requiredPdfs) {
        if (this.internship[Object.keys(doc)[0]].status === 'unknown') missingDocuments.push(Object.values(doc)[0]);
      }
      return missingDocuments;
    },
    missingProof(): string[] | null {
      const requiredProof = [
        { reportPdf: `${this.$t('internshipModule.status.reportPdf')}` },
        { certificatePdf: `${this.$t('internshipModule.status.certificatePdf')}` },
      ];
      const missingProof = [] as string[];
      // eslint-disable-next-line no-restricted-syntax
      for (const doc of requiredProof) {
        if (this.internship[Object.keys(doc)[0]].status === 'unknown') missingProof.push(Object.values(doc)[0]);
      }
      return missingProof;
    },
  },
});
</script>
