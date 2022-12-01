<template>
  <div class="container">
    <div id="form-block4" class="text-left">
      <h3>Deine beantragten Verschiebungen</h3>
      <div class="row mt-3">
        <table class="table">
          <thead>
          <tr>
            <th scope="col">Neues Semester</th>
            <th scope="col">Neues Fachsemester</th>
            <th scope="col">Begründung</th>
            <th scope="col">Status</th>
          </tr>
          </thead>
          <tbody>
          <tr
            v-for="postponement in postponementRequests"
            :key="postponement.timestamp"
          >
            <th scope="row">{{ postponement.newSemester }}</th>
            <td>{{ postponement.newSemesterOfStudy }}</td>
            <td>{{ postponement.reason }}</td>
            <td>
              <span :class="['badge', `bg-${getStatusColor(postponement.status)}`]">
                {{ postponement.status }}
              </span>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Event } from '@/store/types/Event';

interface PostponementRequest {
  timestamp: number;
  newSemester: string;
  newSemesterOfStudy: number;
  reason: string;
  status: string;
}

enum PostponementStatus {
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  PENDING = 'pending',
  OUTDATED = 'outdated',
}

export default defineComponent({
  name: 'PostponementsList',
  props: {
    postponementEvents: {
      type: Array as PropType<Event[]>,
      required: true,
    },
  },
  computed: {
    postponementRequests(): PostponementRequest[] {
      // Copy (concat) and sort by most recent
      const sortedEvents = this.postponementEvents.concat().sort((a, b) => b.timestamp - a.timestamp);
      const postponementRequests: PostponementRequest[] = [];
      for (let i = 0; i < sortedEvents.length; i += 1) {
        const event = sortedEvents[i];
        if (event.accept !== undefined) {
          // Corresponding request was either accepted or rejected
          const correspondingRequestEvent = sortedEvents[i + 1];
          postponementRequests.push({
            timestamp: event.timestamp,
            newSemester: correspondingRequestEvent.changes.newSemester as string,
            newSemesterOfStudy: correspondingRequestEvent.changes.newSemesterOfStudy as number,
            reason: correspondingRequestEvent.comment as string,
            status: event.accept ? PostponementStatus.ACCEPTED : PostponementStatus.REJECTED,
          });
          // Skip next event since it's the corresponding request event
          i += 1;
        } else {
          // Most recent postponement request (first in list) or superseded by newer request
          postponementRequests.push({
            timestamp: event.timestamp,
            newSemester: event.changes.newSemester as string,
            newSemesterOfStudy: event.changes.newSemesterOfStudy as number,
            reason: event.comment as string,
            status: i === 0 ? PostponementStatus.PENDING : PostponementStatus.OUTDATED,
          });
        }
      }
      return postponementRequests;
    },
  },
  methods: {
    getStatusColor(postponementStatus: string): string {
      switch (postponementStatus) {
        case PostponementStatus.ACCEPTED:
          return 'success';
        case PostponementStatus.REJECTED:
          return 'danger';
        case PostponementStatus.PENDING:
          return 'warning';
        default:
          return 'secondary';
      }
    },
  },
});
</script>

<style lang="scss">

</style>
