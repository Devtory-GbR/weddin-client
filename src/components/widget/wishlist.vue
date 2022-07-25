<template>
  <div>
    <q-card id="wihslistcard" bordered flat class="wishlist">
      <div class="wishlist-item" v-for="(item, index) in entries" :key="index">
        <q-img
          :ratio="4/3"
          :src="item.image.data ? imagePath + (item.image.data.attributes?.formats?.small?.url 
                  || item.image.data.attributes?.formats?.thumbnail?.url || item.image.data.attributes.url) : `/imgs/gift_placeholder.jpg`"
        >
          <div
            class="my-caption absolute-full text-subtitle2 flex flex-center"
            :style="`background: ${imgOverlay}`"
          >{{ item.title }}</div>
        </q-img>

        <div class="wishlist-item-text">{{ item.title }}</div>
      </div>
    </q-card>
  </div>
</template>

<style lang="scss">
#wihslistcard::-webkit-scrollbar-track {
  background-color: transparent;
}

#wihslistcard::-webkit-scrollbar {
  width: 12px;
  height: 12px;
}

#wihslistcard::-webkit-scrollbar-thumb {
  border: 0;
  border-radius: 0px;
  border-bottom-left-radius: 2px;
  border-bottom-right-radius: 2px;
  border-top: 2px solid transparent;
}
::-webkit-scrollbar-thumb:hover {
  background-color: #3b3b3b;
}

.wishlist {
  overflow-x: auto;
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
}

.wishlist-item {
  min-width: 250px;
  width: 250px;
  max-width: 250px;
  margin-left: 16px;
  margin-right: 16px;
  margin-top: 16px;

  &:first-child {
    margin-left: 4px;
  }
  &:last-child {
    margin-right: 4px;
  }

  .q-img {
    display: block;
    width: 100%;
    max-width: 100%;
    border: 0;

    .my-caption {
      visibility: hidden;
      opacity: 0;
      transition: 1s;
    }

    &:hover .my-caption {
      visibility: visible;
      opacity: 1;
      transition: 1s;
    }
  }

  .wishlist-item-text {
    padding-top: 12px;
    text-align: center;
    color: var(--q-primary);
    font-size: 1.1rem;
    font-weight: 400;
    line-height: 1.75rem;
    letter-spacing: 0.00937em;
  }
}
</style>
<script>
import { getMediaHost } from "src/utils/env-helper";
import { defineComponent } from "vue";
import { mapGetters } from "vuex";

export default defineComponent({
  name: "wishlist",
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
  computed: {
    ...mapGetters({
      imgOverlay: "basedata/primaryOverlayColor"
    })
  },
  methods: {}
});
</script>
