<template>
  <div class="row justify-center q-gutter-lg">
    <q-card
      v-for="(item, index) in entries"
      :key="index"
      class="card-hotel column"
      data-sal="slide-up"
      data-sal-duration="500"
      data-sal-easing="ease-out-bounce"
    >
      <img
        :src="item.image.data ? imagePath + item.image.data.attributes.formats.small.url : `/imgs/hotel_placeholder.jpg`"
        :ratio="4/3"
      />

      <q-card-section>
        <div class="text-h6">{{ item.title }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none q-pb-none" style="flex: 1">
        <Markdown :source="item.text || ''" />
      </q-card-section>

      <q-separator inset />

      <q-card-section v-if="item.address1">
        <div class="row items-center">
          <div class="col-grow">
            {{ item.address1 }}
            <br />
            {{ item.address2 }}
          </div>
          <div>
            <q-btn
              v-if="item.mapsURL"
              type="a"
              :href="item.mapsURL"
              target="_blank"
              flat
              round
              color="primary"
              icon="room"
            />
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions class="justify-around" v-if="item.phone || item.url">
        <q-btn
          v-if="item.phone"
          flat
          round
          color="primary"
          icon="call"
          type="a"
          :href="'tel:' + item.phone"
          target="_system"
        >
          <q-tooltip>{{ item.phone }}</q-tooltip>
        </q-btn>
        <q-btn
          v-if="item.url"
          flat
          round
          color="primary"
          icon="public"
          type="a"
          :href="item.url"
          target="_blank"
        >
          <q-tooltip>{{ item.url }}</q-tooltip>
        </q-btn>
      </q-card-actions>
    </q-card>
  </div>
</template>
<style lang="scss">
.card-hotel {
  max-width: 300px;
}

@media (max-width: 770px) {
  .card-hotel {
    width: 100%;
    max-width: 350px;
  }
}
</style>
<script>
import { defineComponent } from "vue";
import Markdown from "vue3-markdown-it";
import sal from "sal.js";
import { getMediaHost } from "src/utils/env-helper";

export default defineComponent({
  name: "hotels",
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
    return {
      imagePath: getMediaHost()
    };
  },
  mounted() {
    sal();
  },
  computed: {},
  methods: {}
});
</script>
