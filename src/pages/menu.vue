<template>
  <div>
    <q-layout view="hHh lpR fff">
      <q-header bordered class="bg-white text-primary">
        <q-toolbar>
          <q-btn flat round dense icon="arrow_back" class="q-mr-sm" to="/" />
          <img style="max-height: 40px; max-width: 40px" />

          <q-toolbar-title>{{ $t("menu") }}</q-toolbar-title>
        </q-toolbar>
      </q-header>
      <q-page-container>
        <div class="section text-subtitle1 text-grey-8">
          <template v-for="item in content" :key="item.id">
            <template v-if="item.__component === components.menuTitle">
              <div v-bind:class="'text-' + titleColor" class="text-h3 title-section">{{item.Title}}</div>
              <div class="text-grey-6 subtitle-section">{{item.Subtitle}}</div>
            </template>
            <template v-if="item.__component === components.menuGroupTitle">
              <div class="sub-header">{{item.Title}}</div>
              <div class="sub-header-info text-grey-6">{{item.Subtitle}}</div>
            </template>
            <template v-if="item.__component === components.menuItem">
              <div class="item">
                {{item.Item}}
                <span class="text-grey-6">{{item.Remark}}</span>
              </div>
            </template>
          </template>
          <div style="margin-top:2em"></div>
        </div>
      </q-page-container>
    </q-layout>
  </div>
</template>
<style lang="scss">
.section {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  width: 100%;
  text-align: center;
}

.text-h3 {
  font-weight: 200;
}
.text-h5 {
  font-weight: 300;
}

.title-section {
  margin-top: 0.5em;
  font-size: 70px;
  line-height: 1.3em;
  font-family: "Clicker Script", cursive;
}

.subtitle-section {
  font-size: 40px;
  line-height: 1.3em;
  font-family: "Clicker Script", cursive;
}

.sub-header {
  margin-top: 1em;
  font-size: 1.25em;
  font-weight: bold;
}
.sub-header-info {
  font-size: 0.9em;
}
.item span {
  font-size: 0.9em;
}
</style>
<script>
import { mapState, mapGetters } from "vuex";
import components from "src/utils/components";

export default {
  data() {
    return { components: components };
  },
  computed: {
    ...mapState({
      content: (state) => state.menu.content
    }),
    ...mapGetters({
      titleColor: "basedata/titleColor"
    })
  }
};
</script>