<template>
  <div>
    <div
      v-for="(guest, index) in guests"
      style="width: 100%"
      :key="index"
      class="column q-mt-md q-mb-lg"
      data-sal="slide-left"
      data-sal-duration="500"
      data-sal-easing="ease-in-bounce"
    >
      <div class="row items-center justify-center no-wrap">
        <!-- stage of life icon -->
        <div class="q-ma-xs col-auto row items-center confirm-person-icons-container">
          <q-icon
            v-if="guest.stageOfLife === 'baby'"
            name="fas fa-baby"
            class="confirm-person-icons active"
            style="font-size: 1.5rem"
          />
          <q-icon
            v-if="guest.stageOfLife === 'child'"
            name="fas fa-child"
            class="confirm-person-icons active"
            style="font-size: 1.75rem"
          />
          <q-icon
            v-if="guest.stageOfLife === 'adult'"
            name="fas fa-male"
            class="confirm-person-icons active"
            style="font-size: 2rem"
          />
        </div>

        <!-- name -->
        <q-input
          :model-value="guest.name"
          :disable="!canGuestEdit"
          @update:model-value="updateGuestName($event, guest)"
          class="col"
          :label="$t('name')"
          color="secondary"
          :readonly="guest.fixed"
        />

        <!-- confirm buttons -->
        <div class="col-auto row items-center">
          <q-btn
            v-if="!guest.fixed"
            :disable="!canGuestEdit"
            outline
            rounded
            class="q-ma-xs"
            color="default"
            icon-right="delete"
            @click="deleteGuest(guest)"
            :loading="deleteGuestLoading && guest.id === deleteGuestIndex"
          />
          <div v-if="guest.fixed" class="q-ma-xs" style="width: 56px"></div>
          <q-btn
            v-if="guest.attend !== 'no'"
            :disable="!canGuestEdit"
            @click="updateGuestResponse(false, guest)"
            outline
            rounded
            class="q-ma-xs"
            color="default"
            :label="$q.screen.lt.md ? '' : $t('cancel')"
            icon="thumb_down"
          />
          <q-btn
            disable
            v-if="guest.attend === 'no'"
            unelevated
            rounded
            class="q-ma-xs"
            color="default"
            :label="$q.screen.lt.md ? '' : $t('canceled')"
            icon="thumb_down"
          />
          <q-btn
            :disable="
              (!canAttendGuest && guest.stageOfLife === 'adult') ||
              !canGuestEdit
            "
            v-if="guest.attend !== 'yes'"
            @click="updateGuestResponse(true, guest)"
            outline
            rounded
            class="q-ma-xs"
            color="primary"
            :label="$q.screen.lt.md ? '' : $t('confirm')"
            icon-right="thumb_up"
          />
          <q-btn
            disable
            v-if="guest.attend === 'yes'"
            unelevated
            rounded
            class="q-ma-xs"
            color="primary"
            :label="$q.screen.lt.md ? '' : $t('confirmed')"
            icon-right="thumb_up"
          />
        </div>
      </div>
      <div
        v-for="(preference, index) in preferences[guest.id]"
        :key="index"
        class="q-mt-md q-ml-md"
      >
        <div class="text-subtitle1">{{ preference.label }}</div>

        <q-select
          v-if="preference.items.length > 0"
          outlined
          :multiple="preference.canChooseMultiple"
          :clearable="!preference.isOneSelectionRequired"
          :disable="!canGuestEdit"
          :label="$t('selection')"
          color="secondary"
          options-selected-class="text-secondary"
          option-value="value"
          option-label="label"
          :emit-value="true"
          :map-options="true"
          :options="preference.items"
          :model-value="
            preference.canChooseMultiple
              ? guest.guest_preference[preference.key]?.items || null
              : guest.guest_preference[preference.key]?.items.length > 0
              ? guest.guest_preference[preference.key]?.items[0]
              : null
          "
          @update:model-value="updateGuestPreference($event, preference, guest)"
        />

        <q-input
          v-if="preference.canFillOther"
          :model-value="guest.guest_preference[preference.key]?.other || ''"
          @update:model-value="
            updateGuestPreferenceOther($event, preference, guest)
          "
          :label="$t('other')"
          :hint="preference.otherHint"
          color="secondary"
          :disable="!canGuestEdit"
        />
      </div>
      <q-separator v-if="index != guests.length - 1" class="q-mt-lg" />
    </div>
    <!-- +1 button -->
    <div v-if="plusOneForSinglePerson" class="q-mt-lg column" style="with: 100%">
      <q-separator />
      <div class="row justify-center">
        <q-btn
          :disable="!canAddGuest || !canGuestEdit"
          rounded
          class="q-mt-lg"
          color="secondary"
          :label="$t('addNewPerson')"
          icon-right="add"
          :loading="addGuestLoading"
          @click="addGuest"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.confirm-person-icons {
  width: 40px;
  color: $grey-8;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    color: var(--q-secondary);
  }
  &.active {
    color: var(--q-secondary);
  }
}
</style>

<script>
import { defineComponent } from "vue";
import { mapState, mapGetters } from "vuex";
import sal from "sal.js";

export default defineComponent({
  name: "confirm",
  data() {
    return {
      addGuestLoading: false,
      deleteGuestLoading: false,
      deleteGuestIndex: null
    };
  },
  created() {
    this.debounceSaveGuestData = this.$_.debounce(this.saveGuestData, 1000);
  },
  mounted() {
    sal();
  },
  computed: {
    ...mapState({
      preferences: (state) => state.guest.guestsPreferenceData
    }),
    ...mapGetters({
      guests: "guest/guests",
      canAddGuest: "guest/canAddGuest",
      canAttendGuest: "guest/canAttendGuest",
      plusOneForSinglePerson: "basedata/plusOneForSinglePerson",
      canGuestEdit: "basedata/canGuestEdit"
    })
  },
  methods: {
    updateGuestResponse(attend, guest) {
      this.$store.commit("guest/update_response", {
        id: guest.id,
        attend: attend
      });
      this.saveGuestData(guest.id);
    },
    updateGuestName(name, guest) {
      this.$store.commit("guest/update_name", {
        id: guest.id,
        name: name
      });
      this.debounceSaveGuestData(guest.id);
    },
    updateGuestPreference(value, preference, guest) {
      const items = value
        ? preference.canChooseMultiple
          ? value
          : [value]
        : [];

      if (
        (preference.canChooseMultiple &&
          preference.isOneSelectionRequired &&
          (!value || value.length === 0)) ||
        (!preference.canChooseMultiple &&
          preference.isOneSelectionRequired &&
          !value)
      ) {
        this.$q.notify({
          type: "warning",
          message: this.$t("preferenceRequired"),
          timeout: "3000"
        });
        return;
      }

      this.$store.commit("guest/update_preference", {
        id: guest.id,
        key: preference.key,
        items: items
      });
      this.saveGuestData(guest.id);
    },
    updateGuestPreferenceOther(value, preference, guest) {
      this.$store.commit("guest/update_preferenceOther", {
        id: guest.id,
        key: preference.key,
        other: value
      });
      this.debounceSaveGuestData(guest.id);
    },
    saveGuestData(id) {
      this.$store
        .dispatch("guest/saveData", id)
        .then(this.notifyDataSaved)
        .catch((e) => {
          this.notifyErrorOnSave();
          console.error(e);
        });
    },
    addGuest() {
      this.addGuestLoading = true;
      this.$store
        .dispatch("guest/addGuest")
        .then(this.notifyDataSaved)
        .catch((e) => {
          this.notifyErrorOnSave();
          console.error(e);
        })
        .finally(() => {
          this.addGuestLoading = false;
        });
    },
    deleteGuest(guest) {
      this.deleteGuestLoading = true;
      this.deleteGuestIndex = guest.id;
      this.$store
        .dispatch("guest/deleteGuest", guest.id)
        .then(this.notifyDataSaved)
        .catch((e) => {
          this.notifyErrorOnSave();
          console.error(e);
        })
        .finally(() => {
          this.deleteGuestLoading = false;
          this.deleteGuestIndex = null;
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
