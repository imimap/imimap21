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
              <h6 class="list-item-label">Unternehmen</h6>
              <span class="fw-bold">{{ company.companyName }}</span>
            </div>
            <div class="col-3">
              <h6 class="list-item-label">Zweig</h6>
              <span class="fw-bold">{{ company.branchName }}</span>
            </div>
            <div class="col-3">
              <h6 class="list-item-label">Ort</h6>
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
            <strong>Adresse:</strong>
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
                <strong>Industrie:</strong> {{ company.industry }}
              </li>
              <li>
                <strong>Website: </strong>
                <a :href="company.website" target="_blank">{{ company.website }}</a>
              </li>
              <li>
                <strong>Sprache:</strong> {{ company.prettyPrintLanguage() }}
              </li>
              <li>
                <strong>Größe:</strong> {{ company.prettyPrintSize() }}
              </li>
              <li>
                <strong>Unsichtbar in der Suche:</strong> {{ excludedFromSearch }}
              </li>
              <li>
                <strong>Kommentar:</strong> {{ company.comment }}
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
          Bearbeiten
        </button>
        <button type="button"
                class="btn btn-danger"
                @click="deleteCompany"
        >
          Löschen
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
import { showErrorNotification, showSuccessNotification } from '@/utils/notification';
import { deleteCompany } from '@/utils/gateways';

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
      return this.company.excludedFromSearch ? 'Ja' : 'Nein';
    },
  },
  methods: {
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
