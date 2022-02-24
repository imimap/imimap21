<template>

</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: "templateGerman",

});
</script>

<style>
.divider {
  width: 10px;
  height: auto;
  display: inline-block;
}
</style>
<style lang="scss">
/* Basic editor styles */
.ProseMirror {
  min-height: 100px;
  overflow: auto;
  > * + * {
    margin-top: 0.75em;
  }
  blockquote {
    padding-left: 1rem;
    border-left: 3px solid rgba(#0D0D0D, 0.1);
  }
  code {
    background-color: rgba(#616161, 0.1);
    color: #616161;
  }
}

.ProseMirror:focus {
  outline: none;
}

mark {
  background-color: #ffe066;
  padding: 0.125em 0;
  border-radius: 0.25em;
  box-decoration-break: clone;
}

.content {
  padding: 1rem 0 0;

  h {
    margin: 1rem 0 0.5rem;
  }

  pre {
    border-radius: 5px;
    color: #333;
  }

  code {
    display: block;
    white-space: pre-wrap;
    font-size: 0.8rem;
    padding: 0.75rem 1rem;
    background-color:#e9ecef;
    color: #495057;
  }
}
</style>
