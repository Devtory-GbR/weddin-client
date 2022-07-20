<template>
  <div class="fixed-center text-center">
    <div v-if="!appInit && !isError">
      <h1 class="text-weddin-p font-pretty q-mb-xs">{{ $t("WeddIn") }}</h1>
      <q-circular-progress color="default" indeterminate size="50px" />
      <p class="text-default text-body1 q-mt-md">{{ $t("initLoading") }}</p>
    </div>
    <div v-if="isError">
      <h1 class="text-weddin-p font-pretty q-mb-xs">{{ $t("WeddIn") }}</h1>
      <p>
        <img src="~assets/broken.png" style="width: 30vw; max-width: 150px" />
      </p>
      <p class="text-default text-body1">
        {{ $t("errOnInitApp") }}
        <br />
        <strong class="text-default">({{ errMessage }})</strong>
      </p>
      <p class="text-faded"></p>
      <q-btn color="weddin-a" style="width: 200px" :label="$t('reload')" @click="reload()" />
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { getErrMessage } from "src/utils/error-helper";

export default {
  name: "init ",
  data() {
    return {
      isError: false,
      errMessage: ""
    };
  },
  computed: {
    ...mapState({
      appInit: (state) => state.app.appInit
    })
  },
  // Init App
  async created() {
    /* load init data */
    try {
      await this.$store.dispatch("app/initApp", this.$store);
      this.$router.push("/");
      this.isError = false;
    } catch (e) {
      console.error(e);
      this.isError = true;
      this.errMessage = getErrMessage(e, this.$t);
    }
  },
  methods: {
    reload() {
      window.location.reload();
    }
  }
};
</script>
