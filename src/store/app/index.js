import interceptorSetup from "src/utils/http-interceptor";
import {
  loadAferWithoutSignIn,
  loadAfterSignIn,
  loadInit,
} from "src/utils/data-loader";

/**
 * state of the store
 */
const state = {
  appInit: false
};

/**
 * computed derived state based on store state
 */
const getters = {
};

/**
 * way to change the state of a store direct
 */
const mutations = {
  set_appInit(state, init) {
    state.appInit = init;
  },
};

/**
 * change the state of a store by commits and are typically asynchron
 */
const actions = {
  async initApp({ commit, dispatch }, store) {
    commit("set_appInit", false);

    interceptorSetup({ store: store });

    await new Promise((resolve) => setTimeout(resolve, 500));

    await loadInit({ store });
    if (store.getters["user/isLoggedIn"]) {
      await loadAfterSignIn({ store });
    } else if (!store.getters["basedata/signInRequired"]) {
      await loadAferWithoutSignIn({ store });
    }

    commit("set_appInit", true);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
