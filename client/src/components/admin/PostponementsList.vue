<template>
  <div class="container">
    <div class="row">
      <div class="col-12">

        <div class="row mb-3">
          <div class="col-lg-3 col-md-12">
            <select class="form-select" aria-label="Sortieren nach">
              <option selected value="1">Sortieren nach...</option>
              <option value="2">Nachname</option>
              <option value="3">Matrikelnummer</option>
              <option value="4">Status</option>
            </select>
          </div>
          <div class="col-lg-3 col-md-12">
            <select class="form-select" aria-label="Sortieren nach">
              <option selected value="1">Dauer...</option>
              <option value="2">&lt; 19 Wochen</option>
              <option value="3">&#8925; 19 Wochen</option>
            </select>
          </div>
          <div class="col-lg-3 col-md-12">
            <select class="form-select" aria-label="Sortieren nach">
              <option selected value="1">Status...</option>
              <option value="2">Beantragt</option>
              <option value="3">Genehmigt</option>
              <option value="4">Abgelehnt</option>
            </select>
          </div>
          <div class="col-lg-3 col-md-12">
            <input type="text" class="form-control" placeholder="Suche..."
                   aria-label="Suche" aria-describedby="suche">
            <div id="emailHelp" class="form-text">
              Matrikelnummer oder Nachname</div>
          </div>
        </div>

        <div class="accordion" id="listAccordion">
          <div v-for="(row, index) in openPostponements" v-bind:key="index" class="accordion-item">
            <h2 class="accordion-header" v-bind:id="index">
              <button class="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      v-bind:data-bs-target="'#s0-' + row.studentProfile.matrikelnummer"
                      aria-expanded="false"
                      v-bind:aria-controls="'s0-' + row.studentProfile.matrikelnummer">
                <div class="container">
                  <div class="row">
                    <div class="col-2">
                      <h6 class="list-item-label">Name</h6>
                      <span class="fw-bold">{{ row.firstName + " " + row.lastName }}</span>
                    </div>
                    <div class="col-2">
                      <h6 class="list-item-label">Matrikelnr.</h6>
                      <span class="">{{ row.studentProfile.matrikelnummer }}</span>
                    </div>
                    <div class="col-2">
                      <h6 class="list-item-label">aktuelles Hochschulsemester</h6>
                      <span class="">
                        {{ row.studentProfile.internshipModule.inSemesterOfStudy }}
                      </span>
                    </div>
                    <div class="col-2">
                      <h6 class="list-item-label">aktuelles Fachsemester</h6>
                      <span class="">
                        {{ row.studentProfile.internshipModule.inSemester }}
                      </span>
                    </div>
                    <div class="col-2 text-center">
                      <h6 class="list-item-label">Status</h6>
                      <span class="badge rounded-pill bg-warning">Beantragt</span>
                    </div>
                  </div>
                </div>
              </button>
            </h2>
            <div v-bind:id="'s0-' + row.studentProfile.matrikelnummer"
                 class="accordion-collapse collapse"
                 aria-labelledby="headingOne"
                 data-bs-parent="#listAccordion">
              <div class="accordion-body">
                <h4>Hochschulsemester</h4>
                <p>Verschiebung von
                  <b>{{ row.studentProfile.internshipModule.inSemesterOfStudy }}</b>
                  auf
                  <b>{{ row.studentProfile.internshipModule.events[0].semesterOfStudy }}</b>
                </p>

                <h4>Fachsemester</h4>
                <p>Verschiebung von
                  <b>{{ row.studentProfile.internshipModule.inSemester }}</b>
                    auf
                  <b>{{ row.studentProfile.internshipModule.events[0].inSemester }}</b>
                </p>

                <h4>Grund</h4>
                <p>{{ row.studentProfile.internshipModule.events[0].reason }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PostponementsList',
  data() {
    return {
      currentEditCompanyIndex: 0,
      openPostponements: [
        {
          firstName: 'Mark',
          lastName: 'Otto',
          isAdmin: false,
          emailAddress: 'email@student.de',
          studentProfile: {
            matrikelnummer: '456123',
            internshipsSeen: [],
            internshipModule: {
              reportPdf: '',
              internshipParts: [],
              inSemester: '3',
              inSemesterOfStudy: 5,
              AepPassed: false,
              completeDocumentsPdf: '',
              events: [
                {
                  type: 'postponementRequested',
                  semesterOfStudy: 6,
                  inSemester: '4',
                  reason: 'Failed another course.',
                },
              ],
            },
          },
        },
      ],
    };
  },
  methods: {
  },
});
</script>

<style scoped>
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

  .accordion-item .accordion-body{
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

</style>
