<template>
  <div class="accordion-item">
    <div class="accordion-header">
      <div class="accordion-button collapsed"
           data-bs-toggle="collapse"
           :data-bs-target="'#company-' + company._id"
           aria-expanded="false"
           :aria-controls="'company-' + company._id"
      >
        <div class="container">
          <div class="row">
            <div class="col-3">
              <h6 class="list-item-label">{{ $t('company.heading') }}</h6>
              <span class="fw-bold">{{ company.companyName }}</span>
            </div>
            <div class="col-3">
              <h6 class="list-item-label">{{ $t('company.branch') }}</h6>
              <span class="fw-bold">{{ company.branchName }}</span>
            </div>
            <div class="col-3">
              <h6 class="list-item-label">{{ $t('company.location') }}</h6>
              <span class="fw-bold">{{ location }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div :id="'company-' + company._id"
         class="accordion-collapse collapse"
         aria-labelledby="headingOne"
         data-bs-parent="#listAccordion"
    >
      <div class="accordion-body">
        <h2>{{ company.companyName }}</h2>
        <h3>{{ location }}</h3>
        <div class="row">
          <div class="col-6">
            <strong>{{ $t('address.heading') }}:</strong>
            <p>
              {{ company.address?.street }} {{ company.address?.streetNumber }}<br>
              {{ company.address?.additionalLines }}<br v-if="company.address?.additionalLines">
              {{ company.address?.zip }} {{ company.address?.city }}<br>
              {{ company.address?.country }}
            </p>
          </div>
          <div class="col-6">
            <ul>
              <li>
                <strong>{{ $t('company.industry') }}:</strong> {{ company.industry }}
              </li>
              <li>
                <strong>{{ $t('company.website') }}: </strong>
                <a :href="company.website" target="_blank">{{ company.website }}</a>
              </li>
              <li>
                <strong>{{ $t('company.mainLanguage') }}:</strong> {{
                  $store.getters.prettyPrintLanguage(company.mainLanguage)
                }}
              </li>
              <li>
                <strong>{{ $t('company.size') }}:</strong> {{ company.prettyPrintSize() }}
              </li>
              <li>
                <strong>{{ $t('company.hidden') }}:</strong> {{ excludedFromSearch }}
              </li>
              <li>
                <strong>{{ $t('general.comment') }}:</strong> {{ company.comment }}
              </li>
            </ul>
          </div>
        </div>

        <button type="button"
                class="btn btn-success me-3"
                data-bs-toggle="modal"
                data-bs-target="#companyEditModal"
                @click="$emit('editCompany', company)"
        >
          {{ $t('actions.edit').capitalize() }}
        </button>
        <button type="button"
                class="btn btn-danger"
                @click="deleteCompany"
        >
          {{ $t('actions.delete').capitalize() }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// TODO: Implement custom alert box
/* eslint-disable no-alert */
import { defineComponent, PropType } from 'vue';
import Company from '@/models/Company';
import { deleteCompany } from '@/utils/gateways';
import { showErrorNotification, showSuccessNotification } from '@/utils/notification';

export default defineComponent({
  name: 'CompaniesListEntry',
  emits: ['editCompany', 'removeCompany'],
  props: {
    company: {
      type: Object as PropType<Company>,
      required: true,
    },
  },
  computed: {
    location(): string {
      return `${this.company.address?.city}, ${this.company.address?.country}`;
    },
    excludedFromSearch(): string {
      return this.company.excludedFromSearch ? this.$t('general.yes') : this.$t('general.no');
    },
  },
  methods: {
    /*
    Commented out for now, since companies should not be deleted while there are still some
    internships associated with them.
    DS TODO Fix this
    */
    async deleteCompany() {
      const userDoubleChecked = window.confirm('Unternehmen wirklich löschen?');
      if (!userDoubleChecked) return;
      const success = await deleteCompany(this.company._id);
      if (!success) {
        await showErrorNotification('Unternehmen konnte nicht gelöscht werden');
        return;
      }
      await showSuccessNotification('Unternehmen gelöscht!');
      this.$emit('removeCompany', this.company);
    },

  },
});
</script>

<style scoped lang="scss">
.btn-success {
  background: rgba(119, 185, 0, 0.9);
  border-color: rgba(119, 185, 0, 0.9);

  &:hover, &:active, &:focus {
    background: rgba(119, 185, 0, 1);
    border-color: rgba(119, 185, 0, 1);
  }
}

.accordion-item .accordion-body {
  background: #eee;
}

.accordion-header .accordion-button {
  color: #000000;
  cursor: pointer;
}

.list-item-label {
  font-size: 0.8rem;
  color: #666666;
  text-transform: uppercase;
}

ul {
  list-style: none;
  padding: 0;
}
</style>
