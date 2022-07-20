<template>
  <q-timeline :layout="timelineLayout" color="primary">
    <q-timeline-entry
      v-for="(item, index) in entries"
      :key="index"
      :title="item.title || ''"
      :subtitle="item.subtitle || ''"
      :icon="item.icon || ''"
      side="right"
      data-sal="slide-left"
      data-sal-duration="500"
      data-sal-easing="ease-in-bounce"
    >
      <div class="timeline-entry-text">
        <Markdown :source="item.text || ''" />
      </div>
    </q-timeline-entry>
  </q-timeline>
</template>
<style lang="scss">
.timeline-entry-text p {
  margin: 0;
}
</style>
<script>
import { defineComponent } from "vue";
import Markdown from "vue3-markdown-it";
import sal from "sal.js";

export default defineComponent({
  name: "timeline",
  components: {
    Markdown
  },
  props: {
    entries: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {};
  },
  mounted() {
    sal();
  },
  computed: {
    timelineLayout() {
      return this.$q.screen.lt.sm
        ? "dense"
        : this.$q.screen.lt.md
        ? "comfortable"
        : "loose";
    }
  },
  methods: {}
});
</script>
