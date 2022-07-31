<template>
  <div class="q-pt-md" style="display: flex; justify-content: space-around; flex-wrap: wrap">
    <q-card
      v-for="(location, index) in availableLocations"
      :key="index"
      flat
      bordered
      class="card-location"
      data-sal="slide-up"
      data-sal-duration="500"
      data-sal-easing="ease-out-bounce"
    >
      <q-img
        :src="location.image.data ? imagePath + (location.image.data.attributes.formats?.small?.url || location.image.data.attributes.url) : `/imgs/whenwhere_placeholder.jpg`"
        :ratio="4 / 3"
      />

      <q-card-section style="flex: 1">
        <div class="text-overline text-primary">{{ location.title }}</div>
        <div class="text-h3 q-mb-xs">{{ location.time }}</div>
      </q-card-section>

      <q-separator inset />

      <q-card-section>
        <div class="row items-center">
          <div class="col-grow">
            <span class="text-bold">{{ location.whereTitle }}</span>
            <br />
            {{ location.whereAddress1 }}
            <br />
            {{ location.whereAddress2 }}
          </div>
          <div>
            <q-btn
              v-if="location.googleMapsURL"
              type="a"
              :href="location.googleMapsURL"
              target="_blank"
              flat
              round
              color="primary"
              icon="room"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<style lang="scss">
.card-location {
  width: 350px;
  margin-bottom: 1em;
  display: flex;
  flex-direction: column;
}
@media (max-width: 750px) {
  .card-location {
    width: 100%;
    max-width: 350px;
  }
}
</style>

<script>
import { defineComponent } from "vue";
import { mapState } from "vuex";
import sal from "sal.js";
import { getMediaHost } from "src/utils/env-helper";

export default defineComponent({
  name: "when-and-where-cards",
  props: {
    locations: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      imagePath: getMediaHost()
    };
  },
  mounted() {
    sal();
  },
  methods: {
    canShowLocation(location) {
      return true;
    }
  },
  computed: {
    availableLocations() {
      const user = this.$store.state.user.user;
      return this.locations.filter((location) => {
        if (location.invitation_types.data.length === 0) {
          return true;
        }
        if (!user || user.invitation_type === null) {
          return (
            location.invitation_types.data.findIndex(
              (item) => item.attributes.default
            ) > -1
          );
        } else {
          return (
            location.invitation_types.data.findIndex(
              (item) => item.attributes.type === user.invitation_type.type
            ) > -1
          );
        }
      });
    }
  }
});
</script>
