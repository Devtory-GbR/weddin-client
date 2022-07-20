<template>
  <div :style="`height: ${height}em`"></div>
</template>

<style>
</style>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "spacer",
  props: {
    height: Number
  },
  data() {
    return {};
  },
  computed: {},
  methods: {}
});
</script>