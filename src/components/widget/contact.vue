<template>
  <div class="row flex-center q-gutter-lg" style="align-items: flex-start;">
    <div
      v-for="(item, index) in entries"
      :key="index"
      class="column flex-center"
      data-sal="zoom-in"
      data-sal-duration="500"
      data-sal-easing="ease-out-bounce"
    >
      <q-avatar :size="imageSize">
        <img
          :src="item.image.data ? imagePath + (item.image.data.attributes?.formats?.small?.url 
                  || item.image.data.attributes?.formats?.thumbnail?.url || item.image.data.attributes.url) : `/imgs/contact_placeholder.png`"
        />
      </q-avatar>
      <div v-if="item.name" class="text-primary text-h6 text-weight-light">{{ item.name }}</div>
      <div v-if="item.description" class="text-h6 text-overline">{{ item.description }}</div>
      <div v-if="item.phone1" class="body-1">{{ item.phone1 }}</div>
      <div v-if="item.phone2" class="body-1">{{ item.phone2 }}</div>
      <div v-if="item.phone" class="body-1">{{ item.phone }}</div>
      <div v-if="item.email1" class="body-1">
        <a class="link" :href="'mailto:' + item.email1">{{ item.email1 }}</a>
      </div>
      <div v-if="item.email2" class="body-1">
        <a class="link" :href="'mailto:' +item.email2">{{ item.email2 }}</a>
      </div>
      <div v-if="item.email" class="body-1">
        <a class="link" :href="'mailto:' +item.email">{{ item.email }}</a>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.link {
  color: var(--q-secondary);
  text-decoration: none;
  transition: 0.3s all;

  &:hover {
    color: var(--q-primary);
  }
}
</style>
<script>
import { defineComponent } from "vue";
import { getMediaHost } from "../../utils/env-helper";
import sal from "sal.js";

export default defineComponent({
  name: "contact",
  props: {
    imageSize: String,
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
