<template>
  <div id="q-app" class="text-default">
    <router-view />
  </div>
</template>

<style>
/* Find the right path */
@import "/node_modules/sal.js/dist/sal.css";
</style>
<script>
import { mapGetters, mapState } from "vuex";
import { setCssVar } from "quasar";

export default {
  name: "App",
  data() {
    return {};
  },
  computed: {
    ...mapState({
      appInit: (state) => state.app.appInit
    }),
    ...mapGetters({
      primaryColor: "basedata/primaryColor",
      secondaryColor: "basedata/secondaryColor",
      accentColor: "basedata/accentColor",
      accentColorDarken: "basedata/accentColorDarken"
    })
  },
  // Init App
  async created() {
    // Init output
    console.log(
      " __          __      _     _ _____       \n \\ \\        / /     | |   | |_   _|      \n  \\ \\  /\\  / /__  __| | __| | | |  _ __  \n   \\ \\/  \\/ / _ \\/ _` |/ _` | | | | '_ \\ \n    \\  /\\  /  __/ (_| | (_| |_| |_| | | |\n     \\/  \\/ \\___|\\__,_|\\__,_|_____|_| |_|\n"
    );
    console.log("%cDANGER!", "font-size:20px; color: rgb(215, 75, 75)");
    console.log("This browser feature is only intended for IT professionals.");
    console.log(
      "Do not paste code or text in here unless you know exactly what you are doing."
    );
  },
  watch: {
    primaryColor(val) {
      setCssVar("primary", val);
    },
    secondaryColor(val) {
      setCssVar("secondary", val);
    },
    accentColor(val) {
      setCssVar("accent", val);
    },
    accentColorDarken(val) {
      console.log("accentColorDarken", val);
      setCssVar("accent-darken", val);
    }
  }
};
</script>
