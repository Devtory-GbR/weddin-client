<template>
  <div class="column items-center">
    <q-checkbox
      :model-value="needShuttle || false"
      @update:model-value="updateFeedbackNeedShuttle($event)"
      :disable="!canGuestEdit"
      :label="label"
      color="primary"
    />
  </div>
</template>
<style lang="scss"></style>
<script>
import { defineComponent } from "vue";
import { mapGetters } from "vuex";

export default defineComponent({
  name: "need-hotel-input",
  props: {
    label: String
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      canGuestEdit: "basedata/canGuestEdit",
      needShuttle: "user/needShuttle"
    })
  },
  methods: {
    updateFeedbackNeedShuttle(value) {
      this.$store
        .dispatch("user/updateUserFeedback", { needShuttle: value })
        .then(this.notifyDataSaved)
        .catch((e) => {
          console.error(e);
          this.notifyErrorOnSave();
        });
    },
    notifyDataSaved() {
      this.$q.notify({
        type: "positive",
        message: this.$t("saveSuccess"),
        timeout: "1500"
      });
    },
    notifyErrorOnSave() {
      this.$q.notify({
        type: "negative",
        message: this.$t("saveError"),
        timeout: "3000"
      });
    }
  }
});
</script>
