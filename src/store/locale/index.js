import { api } from "boot/axios";
import { Cookies } from "quasar";
import { i18n } from "src/boot/i18n";
import {
  getVueLocaleString,
  getMomentLocaleString,
  getQuasarLocaleString,
} from "src/utils/locale-helper";
import { Quasar } from "quasar";
import moment from "moment";

/**
 * state of the store
 */
const state = {
  lng:
    Cookies.get("lng") || navigator.language.split("-")[0].toLocaleLowerCase(),
  locales: [],
};

/**
 * computed derived state based on store state
 */
const getters = {
  localesToogle: (state) =>
    state.locales
      .map((locale) =>
        Object.assign(
          {},
          { label: locale.code.toUpperCase(), value: locale.code }
        )
      )
      .sort((a, b) => a.label.localeCompare(b.label)),
  fallbackLocale: (state) => {
    const lng = state.locales.filter((locale) => locale.isDefault);
    if (lng.length > 0) {
      return lng[0].code;
    } else {
      return null;
    }
  },
};

/**
 * way to change the state of a store direct
 */
const mutations = {
  set_locales(state, data) {
    state.locales = data;
  },
  set_lng(state, lng) {
    state.lng = lng;
    Cookies.set("lng", lng);
  },
};

/**
 * change the state of a store by commits and are typically asynchron
 */
const actions = {
  async load({ commit, dispatch }) {
    const resp = await api({
      url: `i18n/locales`,
      method: "GET",
    });
    const locales = resp.data.map((item) =>
      Object.assign({}, { code: item.code, isDefault: item.isDefault })
    );
    commit("set_locales", locales);
    if (
      locales.filter((locale) => locale.code.toLocaleLowerCase() === state.lng)
        .length === 0
    ) {
      const lng = locales.filter((locale) => locale.isDefault)[0].code;
      await dispatch("changeLng", lng);
    }
  },
  async changeLng({ commit }, lng) {
    commit("set_lng", lng);

    const localeVue = getVueLocaleString(lng);
    const localeMoment = getMomentLocaleString(lng);
    const localeQuasar = getQuasarLocaleString(lng);

    console.log("localeVue", localeVue);
    console.log("localeMoment", localeMoment);
    console.log("localeQuasar", localeQuasar);

    console.log("i18n store", i18n);
    /* set the vue locale */
    i18n.global.locale = localeVue;

    /* set moment locale */
    moment.locale(localeMoment);

    /* set quasar locale */
    try {
      await import(
        /* webpackInclude: /(de|en-US)\.js$/ */
        "quasar/lang/" + localeQuasar
      ).then((lang) => {
        Quasar.lang.set(lang.default);
      });
    } catch (err) {
      // Requested Quasar Language Pack does not exist,
      // let's not break the app, so catching error
      console.error(err);
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
