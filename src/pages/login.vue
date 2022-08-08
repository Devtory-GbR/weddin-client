<template>
  <q-layout id="login-layout">
    <q-page-container>
      <q-page id="login-page" class="window-height window-width column justify-center">
        <div id="login-wrapper">
          <div class="login-container shadow-2" :class="{ shake: shakeAnimation }">
            <div class="row justify-center">
              <q-img v-if="logo" :src="logo" spinner-color="white" style="max-width: 250px" />
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                class="logo"
                style="width: 250px"
                fill="none"
                viewBox="0 0 364 291"
              >
                <g class="Group 1">
                  <g class="rings">
                    <path
                      stroke="#FFC590"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="14"
                      d="M257 256c55.228 0 100-44.772 100-100S312.228 56 257 56s-100 44.772-100 100 44.772 100 100 100Z"
                      class="circle-right"
                    />
                    <path
                      stroke="#FFC590"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="14"
                      d="M107 256c55.228 0 100-44.772 100-100S162.228 56 107 56 7 100.772 7 156s44.772 100 100 100Z"
                      class="circle-left"
                    />
                  </g>
                  <path
                    fill="#7871C2"
                    d="M198.611 223.567c-2.322.871-4.554 5.932-5.953 13.47-1.042 5.742-1.369 9.116-1.548 16.735-.238 9.742.506 18.45 2.173 25.226 1.34 5.524 2.738 8.545 4.614 10.014.923.708 1.012.708 4.017.572 3.661-.191 7.263-.87 11.639-2.205 10.001-3.047 23.335-9.442 33.008-15.755l3.899-2.557 1.906.843 1.874.87h16.399l1.726-.734 1.757-.762 2.323 1.632c9.614 6.695 24.853 14.069 35.657 17.252 4.286 1.252 7.352 1.824 11.013 1.988l3.066.162.893-.789c3.215-2.776 5.537-11.129 6.519-23.376 1.369-17.388-1.666-37.363-6.31-41.417-.863-.762-.923-.762-4.494-.734-4.226.027-6.965.544-13.453 2.557-5.209 1.633-9.347 3.239-15.299 5.96-7.084 3.266-15.478 7.865-19.406 10.667l-1.101.789-1.428-.626c-1.4-.572-1.786-.598-9.793-.598-7.531 0-8.423.054-9.346.49-.982.517-.982.517-2.083-.217-13.724-9.171-32.833-17.443-44.619-19.321-2.708-.435-6.696-.517-7.65-.136Z"
                    class="bow-tie"
                  />
                  <path
                    fill="#FF847C"
                    fill-rule="evenodd"
                    d="M74.687 3.994c-6.51 6.972-7.002 7.5-11.257 12.07a1136.447 1136.447 0 0 1-5.303 5.666c-.62.649-1.127 1.3-1.127 1.447 0 .154 6.1.234 14.308.19l14.309-.078 2.166-4.655c1.191-2.56 3.414-7.358 4.94-10.66a1146.2 1146.2 0 0 1 3.195-6.88c.232-.478.422-.917.422-.974 0-.058-4.036-.105-8.97-.105h-8.967l-3.716 3.979Zm25.55.41c-1.152 2.421-2.095 4.447-2.095 4.502 0 .054-1.487 3.265-3.303 7.135-1.818 3.87-3.305 7.118-3.305 7.217 0 .1 6.96.181 15.466.181s15.466-.082 15.466-.182c0-.1-1.336-3.04-2.968-6.532s-4.04-8.646-5.349-11.454L111.766.166 107.05.083 102.334 0l-2.097 4.403Zm18.454-2.062a246.98 246.98 0 0 0 2.787 6.082 364.45 364.45 0 0 1 2.509 5.39c.402.9 1.558 3.4 2.568 5.555l1.837 3.92 14.304.077c8.705.048 14.304-.031 14.304-.201 0-.155-.377-.662-.837-1.13-.459-.466-3.595-3.822-6.966-7.456a3059.526 3059.526 0 0 0-9.868-10.585L135.591.015h-17.907l1.007 2.327ZM57 29.177c0 .184 2.31 3.402 4.911 6.158 2.602 2.755 6.486 6.896 8.632 9.2 2.145 2.306 4.743 5.077 5.771 6.16l1.87 1.966 57.372-.013 2.317-2.775a1028.52 1028.52 0 0 0 5.766-6.152 2277.23 2277.23 0 0 1 8.631-9.2c2.602-2.756 4.73-5.16 4.73-5.344 0-.464-28.105-.474-28.393-.009-.11.178-.921 2.442-1.802 5.03-.88 2.588-2.393 7.003-3.362 9.81l-1.761 5.106-1.185.086c-.652.048-1.889-.02-2.751-.15l-1.565-.236 1.21-3.453c.666-1.9 1.665-4.806 2.221-6.457.555-1.652 1.492-4.407 2.081-6.122.591-1.714 1.073-3.303 1.073-3.528 0-.341-2.641-.41-15.766-.41-13.126 0-15.766.069-15.766.41 0 .225.484 1.813 1.073 3.528.59 1.716 1.527 4.47 2.082 6.122a626.311 626.311 0 0 0 2.22 6.456l1.211 3.454-1.386.24c-.763.131-2 .199-2.75.15l-1.365-.09-1.762-5.105c-.968-2.808-2.481-7.223-3.362-9.811-.881-2.588-1.692-4.852-1.801-5.03-.288-.465-28.394-.455-28.394.01"
                    class="diamond"
                    clip-rule="evenodd"
                  />
                </g>
              </svg>
            </div>
            <div class="row font-pretty text-primary" style="margin-top: 1em">
              <div class="full-width text-h2 text-center">{{ coupleName }}</div>
            </div>
            <div class="row text-center" style="margin-top: 3em">
              <div class="text-center full-width text-h6 login-text-color">{{ title || "" }}</div>
            </div>
            <div class="row text-center">
              <div class="text-center full-width login-text-color">{{ subtitle || "" }}:</div>
            </div>
            <div class="row" style="margin-top: 1em">
              <q-input
                color="secondary"
                v-model="code"
                @keydown.enter.prevent="login()"
                :label="$t('code')"
                class="full-width"
              ></q-input>
            </div>
            <div class="row" style="margin-top: 1.5em">
              <q-btn
                unelevated
                outline
                rounded
                color="white"
                text-color="primary"
                size="lg"
                class="full-width"
                :label="$t('login')"
                @click="login()"
                :loading="loadingLogin"
              />
            </div>
          </div>
        </div>
        <div class="q-mt-sm text-center">
          <a
            :href="adminPanelLink"
            target="_blank"
            class="link link-admin"
          >{{ $t('Administration') }}</a>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
<!-- Notice lang="scss" -->
<style lang="scss">
#login-layout {
  background: #eeeeee;
}
#login-page {
  align-items: center;
}

.link-admin {
  color: rgba(0, 0, 0, 0.3);
}
.login-container {
  padding: 2em;

  width: 100%;
  min-width: 400px;
  max-width: 450px;

  background: white;
  border: rgba(0, 0, 0, 0.25);
  border-radius: 5px;
}
#waring-date {
  //background-color: #e67e22;
  //color: #ffffff;
  border-radius: 4px;
  border: rgba(0, 0, 0, 0.25);
  font-weight: bold;
}
@media (max-width: 500px) {
  #login-layout {
    background: #ffffff;
  }
  #login-page {
    align-items: unset;
  }
  #login-wrapper {
    width: 100%;
  }
  .login-container {
    min-width: unset;
    max-width: unset;

    border: unset;
    box-shadow: unset;
  }
}
.shake {
  animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
}
@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }
  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }
  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}
</style>
<script>
import { getAdminPanel } from "src/utils/env-helper";
import { mapGetters, mapState } from "vuex";
import { loadAfterSignIn } from "../utils/data-loader";
import { getErrMessage } from "../utils/error-helper";

export default {
  name: "Login",
  data() {
    return {
      code: "",
      loadingLogin: false,
      notifyMessage: undefined,
      shakeAnimation: false,
      adminPanelLink: getAdminPanel()
    };
  },
  computed: {
    ...mapState({
      title: (state) => state.basedata.signIn.title,
      subtitle: (state) => state.basedata.signIn.subtitle
    }),
    ...mapGetters({
      coupleName: "basedata/coupleName",
      logo: "basedata/logoSmallURL"
    })
  },
  created() {
    // when the user is logged in or no login required, we will reroute
    if (
      this.$store.getters["user/isLoggedIn"] ||
      !this.$store.getters["basedata/signInRequired"]
    ) {
      this.$router.push("/");
    }
  },

  methods: {
    async login() {
      const code = this.code;
      if (code === "") {
        return;
      }

      this.loadingLogin = true;
      try {
        await this.$store.dispatch("user/login", code.toLowerCase());
        await loadAfterSignIn({ store: this.$store });
        this.$router.push("/");
      } catch (err) {
        this.shakeAnimation = true;
        setTimeout(() => (this.shakeAnimation = false), 1000);

        let errText = "";
        if (err.isAxiosError && err.response.status === 400) {
          errText = this.$t("loginError");
        } else {
          errText = getErrMessage(err, this.$t);
        }
        this.closeNotifyMessage();
        this.notifyMessage = this.$q.notify({
          color: "negative",
          timeout: 5000,
          icon: "error",
          position: "bottom",
          message: errText,
          multiLine: true
        });
      } finally {
        this.loadingLogin = false;
      }
    },
    closeNotifyMessage() {
      if (this.notifyMessage) {
        this.notifyMessage();
      }
    }
  }
};
</script>
