<template>
<div class="container">
  <div id="form-block4" class="text-left mt-5 mx-3">
    <h3> Persönliche Details</h3>
    <div class="alert alert-primary">
        <small>
          <label class="required_application">Die mit </label>
          markierten Felder werden für einen vollständigen Antrag benötigt.
          Speichern kannst du aber auch, ohne diese auszufüllen.
        </small>
    </div>
    <div class="row mb-3">
      <div class="col-md-4">
        Matrikelnummer<br>
        <span class="form-control-static pl-2 pt-5">130017</span>
      </div>
    </div>
    <div class="row mb-3">
      <div class="col-md-4">
        Email<br>
        <span class="form-control-static pl-2 pt-5">s0130017@htw-berlin.de</span>
      </div>
      <div class="col-md-4">
        <div class="field">
          <div class="form-group" data-children-count="1">
            <label for="studentPrivateEmail">Private E-Mail</label>
            <input class="form-control" type="text" id="studentPrivateEmail">
          </div>
        </div>
      </div>
    </div>
    <div class="row mb-3">
      <div class="col-md-4">
        <div class="field">
          <div class="form-group" data-children-count="1">
            <label class="required_application" for="studentFirstName">Vorname</label>
            <input
              maxlength="50"
              class="form-control"
              size="50"
              type="text"
              value="Quirin"
              name="student[first_name]"
              id="studentFirstName"
            >
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="field">
          <div class="form-group" data-children-count="1">
            <label class="required_application" for="studentLastName">Nachname</label>
            <input
              maxlength="50"
              class="form-control"
              size="50"
              type="text"
              value="Reif"
              id="studentLastName"
            >
          </div>
        </div>
      </div>
    </div>
    <div class="row mb-3">
      <div class="col-md-4">
        <div class="field">
          <div class="form-group" data-children-count="1">
            <label class="required_application" for="studentBirthday">Geburtsdatum</label>
            <input
              placeholder="dd.mm.YYYY"
              class="form-control"
              value="1962-09-07"
              type="date"
              id="studentBirthday"
            >
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="field">
          <div class="form-group" data-children-count="1">
            <label class="required_application" for="studentBirthplace">Geburtsort</label>
            <input
              maxlength="50"
              class="form-control"
              size="50" type="text"
              name="student[birthplace]"
              id="studentBirthplace"
            >
          </div>
        </div>
      </div>
    </div>
    <div class="row mb-3">
      <div class="col-md-4">
        <div class="field">
          <button
            type="submit"
            name="commit"
            value="Informationen speichern"
            class="btn btn-secondary mt-3"
            data-disable-with="Informationen speichern"
          >
            Infornationen speichern
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'vuex';

export default defineComponent({
  name: 'Student',
  computed: mapState(['user']),
});
</script>

<style lang="scss">
label.required_application::after {
  content: " *";
  color: #0000b9;
  font-weight: bold;
}
</style>
