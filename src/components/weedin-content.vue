<template>
  <div class="section text-default">
    <div class="content-header">
      <!-- title -->
      <div v-bind:class="'text-' + titleColor" class="text-h3 title-section">{{ title }}</div>

      <!-- subtitle -->
      <div class="text-subtitle1 content-text-header">
        <Markdown :source="subtitle || ''" />
      </div>

      <!-- special suptitle for when and where section -->
      <div v-if="isWhenAndWhereSection() && !subtitle" class="content-header">
        <div class="text-h3">{{ moment(weddingDate).format("D. MMMM") }}</div>
        <div v-bind:class="'bg-' + dividerTitleColor" class="divider-md"></div>
        <div class="text-h5">{{ moment(weddingDate).format("dddd") }}</div>
      </div>

      <!-- special subtitle for confirm section -->
      <div v-if="isConfirmSection() && !subtitle" class="content-header">
        <div class="text-subtitle1 content-text-header">
          <p>
            {{ $t("confirmLatest") }}
            <b>{{ moment(confirmLatest).format("DD.MM.YYYY") }}</b>
            {{ $t("confirmLatest2") }}
          </p>
          <p v-if="!canEditAfterConfirmLatest">({{ $t("confirmNoChangeAfterLatestDate") }})</p>
        </div>
        <div v-bind:class="'bg-' + dividerTitleColor" class="divider-md"></div>
        <guest-response-attend-chip v-if="canSeeConfirmSection"></guest-response-attend-chip>
      </div>

      <!-- divider -->
      <div
        v-if="subtitle && content.length > 0"
        v-bind:class="'bg-' + dividerTitleColor"
        class="divider-md"
      ></div>
    </div>
    <!-- content -->
    <div v-for="(contentItem, index) in content" :key="index" class="content-items">
      <!-- freeText -->
      <Markdown
        v-if="contentItem.component === components.markdown"
        :source="contentItem.items.map((item) => item.text).join('\n\n') || ''"
        class="text-body1 content-text free-text"
      />

      <!-- when and where cards -->
      <when-and-where-cards
        v-if="contentItem.component === components.whenAndWhere"
        :locations="contentItem.items"
        class="content"
      ></when-and-where-cards>

      <!-- timeline -->
      <time-line
        v-if="contentItem.component === components.timeline"
        :entries="contentItem.items"
        class="content"
      ></time-line>

      <!-- hotels -->
      <hotels
        v-if="contentItem.component === components.hotel"
        :entries="contentItem.items"
        class="content"
      ></hotels>

      <!-- hotels -->
      <confirm
        v-if="
          canSeeConfirmSection && contentItem.component === components.confirm
        "
        class="content content-confirm"
      ></confirm>

      <!-- input need hotel -->
      <need-hotel-input
        v-if="
          canSeeConfirmSection &&
          contentItem.component === components.needHotelInput
        "
        class="content"
        :label="contentItem.items[0].label"
      ></need-hotel-input>

      <!-- input need shuttle -->
      <need-shuttle-input
        v-if="
          canSeeConfirmSection &&
          contentItem.component === components.needShuttleInput
        "
        class="content"
        :label="contentItem.items[0].label"
      ></need-shuttle-input>

      <!-- contact couple -->
      <contact
        v-if="contentItem.component === components.contactCouple"
        :entries="contentItem.items"
        :imageSize="'200px'"
        class="content"
      ></contact>

      <!-- contact -->
      <contact
        v-if="contentItem.component === components.contact"
        :entries="contentItem.items"
        :imageSize="'150px'"
        class="content"
      ></contact>

      <!-- WishList -->
      <wish-list
        v-if="contentItem.component === components.wishlist"
        :entries="contentItem.items"
        class="content"
      ></wish-list>

      <!-- Spacer -->
      <spacer
        v-if="contentItem.component === components.spacer"
        :height="contentItem.items.reduce((acc, curr) => acc + curr.height, 0)"
      ></spacer>

      <!-- section divider -->
      <content-divider
        v-if="contentItem.component === components.sectionDivider"
        :text="contentItem.items.map((item) => item.text).join('\n')"
      ></content-divider>

      <!-- google map divider -->
      <google-map
        v-if="contentItem.component === components.googleMapDivider"
        :locations="contentItem.items"
      ></google-map>
    </div>
  </div>
</template>
<style lang="scss">
.section {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.text-h3 {
  font-weight: 200;
}
.text-h5 {
  font-weight: 300;
}

.title-section {
  font-size: 70px;
  line-height: 1.3em;
  font-family: "Clicker Script", cursive;
}

.content-header {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.content-items {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 12px;
}

.divider-md {
  height: 1px;
  width: 75px;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}
.content-text {
  text-align: justify;
  text-align-last: center;

  &.free-text {
    ul,
    ol {
      text-align: start;
      text-align-last: start;
    }
  }
}

.content-text-header,
.content-text {
  max-width: 960px;
  padding-left: 1em;
  padding-right: 1em;

  a {
    text-decoration: none;
    color: var(--q-primary);
    transition: 0.3s all;

    &:hover {
      color: var(--q-secondary);
    }
  }
}
.content-text-header {
  text-align: center;
  p {
    margin: 0;
  }
}

.content {
  max-width: 1200px;
  justify-content: center;
  flex: 1;
  padding: 1em;
  width: 100%;

  &.content-confirm {
    max-width: 600px;
  }
}
</style>
<script>
import components from "src/utils/components";

import ContentDivider from "./divider/content-divider";
import GoogleMap from "./divider/google-map.vue";

import WhenAndWhereCards from "./widget/when-and-where-cards";
import TimeLine from "./widget/timeline.vue";
import Hotels from "./widget/hotels.vue";
import Contact from "./widget/contact.vue";
import WishList from "./widget/wishlist.vue";
import Confirm from "./widget/confirm.vue";
import NeedHotelInput from "./widget/need-hotel-input.vue";
import NeedShuttleInput from "./widget/need-shuttle-input.vue";

import GuestResponseAttendChip from "./_intern/guest-response-attend-chip.vue";

import Spacer from "./style/spacer.vue";

import { defineComponent } from "vue";
import Markdown from "vue3-markdown-it";
import { mapGetters } from "vuex";
import moment from "moment";

export default defineComponent({
  name: "weddin-content",
  components: {
    Markdown,
    ContentDivider,
    WhenAndWhereCards,
    NeedHotelInput,
    NeedShuttleInput,
    TimeLine,
    Hotels,
    Contact,
    WishList,
    Confirm,
    Spacer,
    GoogleMap,
    GuestResponseAttendChip,
    GoogleMap
  },
  props: {
    title: String,
    subtitle: String,
    content: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      components: components,
      moment: moment
    };
  },
  computed: {
    ...mapGetters({
      canSeeConfirmSection: "user/canConfirm",
      weddingDate: "basedata/weddingDate",
      confirmLatest: "basedata/confirmLatest",
      canEditAfterConfirmLatest: "basedata/canEditAfterConfirmLatest",
      titleColor: "basedata/titleColor",
      dividerTitleColor: "basedata/dividerTitleColor"
    })
  },
  created() {},
  methods: {
    isWhenAndWhereSection() {
      return (
        this.content?.filter(
          (item) => item.component === this.components.whenAndWhere
        ).length > 0
      );
    },
    isConfirmSection() {
      return (
        this.content?.filter(
          (item) => item.component === this.components.confirm
        ).length > 0
      );
    }
  }
});
</script>
