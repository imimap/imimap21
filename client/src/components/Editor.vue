<template>
  <fieldset class="form-group border p-3">
    <div v-if="editor">
      <button type="button" class="btn btn-outline-secondary" title="Bold"
              @click="editor.chain().focus().toggleBold().run()"
              :class="{ 'is-active': editor.isActive('bold') }">
        <a><img src="/assets/editorButtons/bold.svg"/></a>
      </button>
      <button type="button" class="btn btn-outline-secondary" title="Italic"
              @click="editor.chain().focus().toggleItalic().run()"
              :class="{ 'is-active': editor.isActive('italic') }">
        <a><img src="/assets/editorButtons/italic.svg"/></a>
      </button>
      <button type="button" class="btn btn-outline-secondary" title="Strike"
              @click="editor.chain().focus().toggleStrike().run()"
              :class="{ 'is-active': editor.isActive('strike') }">
        <a><img src="/assets/editorButtons/strikethrough.svg"/></a>
      </button>
      <button type="button" class="btn btn-outline-secondary" title="Clear Format"
              @click="editor.chain().focus().unsetAllMarks().run()">
        <a><img src="/assets/editorButtons/format-clear.svg"/></a>
      </button>
      <button type="button" class="btn btn-outline-secondary" title="Paragraph"
              @click="editor.chain().focus().setParagraph().run()"
              :class="{ 'is-active': editor.isActive('paragraph') }">
        <a><img src="/assets/editorButtons/paragraph.svg"/></a>
      </button>
      <div class="divider"/>
      <button type="button" class="btn btn-outline-secondary" title="Heading 1"
              @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
              :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }">
        <a><img src="/assets/editorButtons/h-1.svg"/></a>
      </button>
      <button type="button" class="btn btn-outline-secondary" title="Heading 2"
              @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
              :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }">
        <a><img src="/assets/editorButtons/h-2.svg"/></a>
      </button>
      <button type="button" class="btn btn-outline-secondary" title="Heading 3"
              @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
              :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }">
        <a><img src="/assets/editorButtons/h-3.svg"/></a>
      </button>
      <button type="button" class="btn btn-outline-secondary" title="Heading 4"
              @click="editor.chain().focus().toggleHeading({ level: 4 }).run()"
              :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }">
        <a><img src="/assets/editorButtons/h-4.svg"/></a>
      </button>
      <button type="button" class="btn btn-outline-secondary" title="Heading 5"
              @click="editor.chain().focus().toggleHeading({ level: 5 }).run()"
              :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }">
        <a><img src="/assets/editorButtons/h-5.svg"/></a>
      </button>
      <button type="button" class="btn btn-outline-secondary" title="Heading 6"
              @click="editor.chain().focus().toggleHeading({ level: 6 }).run()"
              :class="{ 'is-active': editor.isActive('heading', { level: 6 }) }">
        <a><img src="/assets/editorButtons/h-6.svg"/></a>
      </button>
      <div class="divider"/>
      <button type="button" class="btn btn-outline-secondary" title="Bullet List"
              @click="editor.chain().focus().toggleBulletList().run()"
              :class="{ 'is-active': editor.isActive('bulletList') }">
        <a><img src="/assets/editorButtons/list-check.svg"/></a>
      </button>
      <button type="button" class="btn btn-outline-secondary" title="Ordered List"
              @click="editor.chain().focus().toggleOrderedList().run()"
              :class="{ 'is-active': editor.isActive('orderedList') }">
        <a><img src="/assets/editorButtons/list-ordered.svg"/></a>
      </button>
      <!--    <button @click="editor.chain().focus().setTextAlign('left').run()"-->
      <!--            :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }">-->
      <!--      left-->
      <!--    </button>-->
      <!--    <button @click="editor.chain().focus().setTextAlign('center').run()"-->
      <!--            :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }">-->
      <!--      center-->
      <!--    </button>-->
      <!--    <button @click="editor.chain().focus().setTextAlign('right').run()"-->
      <!--            :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }">-->
      <!--      right-->
      <!--    </button>-->
      <!--    <button @click="editor.chain().focus().setTextAlign('justify').run()"-->
      <!--            :class="{ 'is-active': editor.isActive({ textAlign: 'justify' }) }">-->
      <!--      justify-->
      <!--    </button>-->
      <div class="divider"/>
      <button type="button" class="btn btn-outline-secondary" title="Code"
              @click="editor.chain().focus().toggleCode().run()"
              :class="{ 'is-active': editor.isActive('code') }">
        <a><img src="/assets/editorButtons/code-s-fill.svg"/></a>
      </button>
      <button type="button" class="btn btn-outline-secondary" title="Code Block"
              @click="editor.chain().focus().toggleCodeBlock().run()"
              :class="{ 'is-active': editor.isActive('codeBlock') }">
        <a><img src="/assets/editorButtons/code-box-line.svg"/></a>
      </button>
      <div class="divider"/>
      <button type="button" class="btn btn-outline-secondary" title="Block Quote"
              @click="editor.chain().focus().toggleBlockquote().run()"
              :class="{ 'is-active': editor.isActive('blockquote') }">
        <a><img src="/assets/editorButtons/double-quotes-l.svg"/></a>
      </button>
      <button type="button" class="btn btn-outline-secondary" title="Horizontal Ruler"
              @click="editor.chain().focus().setHorizontalRule().run()">
        <a><img src="/assets/editorButtons/separator.svg"/></a>
      </button>
      <button type="button" class="btn btn-outline-secondary" title="Set break"
              @click="editor.chain().focus().setHardBreak().run()">
        <a><img src="/assets/editorButtons/text-wrap.svg"/></a>
      </button>
      <div class="divider"/>
      <button type="button" class="btn btn-outline-secondary" title="Undo"
              @click="editor.chain().focus().undo().run()">
        <a><img src="/assets/editorButtons/arrow-go-back-line.svg"/></a>
      </button>
      <button type="button" class="btn btn-outline-secondary" title="Redo"
              @click="editor.chain().focus().redo().run()">
        <a><img src="/assets/editorButtons/arrow-go-forward-line.svg"/></a>
      </button>
<!--          <button @click="editor.chain().focus().toggleHighlight().run()"-->
<!--                  :class="{ 'is-active': editor.isActive('highlight') }">-->
<!--            toggleHighlight-->
<!--          </button>-->
<!--          <button @click="editor.chain().focus().toggleHighlight({ color: 'red' }).run()"-->
<!--                  :class="{ 'is-active': editor.isActive('highlight', { color: 'red' }) }">-->
<!--            red (#ffa8a8)-->
<!--          </button>-->
    </div>
    <hr>
    <editor-content :editor="editor"/>
  </fieldset>
</template>

<script lang="ts">
import { Editor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Editor',
  components: {
    EditorContent,
  },
  props: {
    modelValue: {
      type: String,
      default: 'I am a string',
    },
  },
  data() {
    return {
      editor: null as any,
    };
  },
  watch: {
    modelValue(value) {
      // HTML
      const isSame = this.editor.getHTML() === value;

      // JSON
      // const isSame = JSON.stringify(this.editor.getJSON()) === JSON.stringify(value)

      if (isSame) {
        return;
      }

      this.editor.commands.setContent(value, false);
    },
  },
  mounted() {
    this.editor = new Editor({
      extensions: [
        StarterKit,
      ],
      content: this.modelValue,
      onUpdate: () => {
        // HTML
        this.$emit('update:modelValue', this.editor.getHTML());

        // JSON
        // this.$emit('update:modelValue', this.editor.getJSON())
      },
    });
  },
  beforeUnmount() {
    this.editor.destroy();
  },
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
}
mark {
  background-color: #ffe066;
  padding: 0.125em 0;
  border-radius: 0.25em;
  box-decoration-break: clone;
}
</style>
