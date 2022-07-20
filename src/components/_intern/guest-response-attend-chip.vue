<template>
  <q-chip v-if="attend === 0" size="md" square>
    {{
    $t("noResponse")
    }}
  </q-chip>
  <q-chip
    v-if="attend === 1"
    size="md"
    color="light-green-2"
    text-color="light-green-10"
  >{{ $t("confirmed") }}!</q-chip>
  <q-chip v-if="attend === 2" size="md" color="red-2" text-color="red-8">{{ $t("canceled") }}...</q-chip>
</template>

<style>
</style>

<script>
import { defineComponent } from "vue";
import { mapGetters } from "vuex";

export default defineComponent({
  name: "guest-response-attend-chip",
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      attend: "guest/responseState"
    })
  },
  methods: {}
});
</script>

