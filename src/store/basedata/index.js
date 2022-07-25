import { api } from "src/boot/axios";
import moment from "moment";
import { colors } from "quasar";
import { getMediaHost } from "src/utils/env-helper";
const qs = require("qs");

/**
 * state of the store
 */
const state = {
  general: {
    coupleName: null,
    weddingDate: null,
    confirmLatest: null,
    countdown: null,
    logo: null,
  },
  appearance: {
    primaryColor: null,
    secondaryColor: null,
    accentColor: null,
    accentColorDarken: null,
    titleColor: null,
    dividerTitleColor: null,
  },
  signIn: {
    signInRequired: null,
    title: null,
    subtitle: null,
  },
  guestFeedback: {
    plusOneForSinglePersonh: null,
    canEditAfterConfirmLatest: null,
  },
};

/**
 * computed derived state based on store state
 */
const getters = {
  coupleName: (state) => state.general.coupleName,
  weddingDate: (state) => state.general.weddingDate,
  confirmLatest: (state) => state.general.confirmLatest,
  countdown: (state) => state.general.countdown,
  logoSmallURL: (state) => {
    if (state.general.logo) {
      if (state.general.logo.formats.small) {
        return `${getMediaHost()}${state.general.logo.formats.small.url}`;
      } else {
        return `${getMediaHost()}${state.general.logo.formats.thumbnail.url}`;
      }
    } else {
      return null;
    }
  },
  logoThumbnailURL: (state) => {
    if (state.general.logo) {
      return `${getMediaHost()}${state.general.logo.formats.thumbnail.url}`;
    } else {
      return null;
    }
  },
  primaryColor: (state) => state.appearance.primaryColor,
  secondaryColor: (state) => state.appearance.secondaryColor,
  accentColor: (state) => state.appearance.accentColor,
  accentColorDarken: (state) => state.appearance.accentColorDarken,
  titleColor: (state) => state.appearance.titleColor,
  dividerTitleColor: (state) => state.appearance.dividerTitleColor,

  signInRequired: (state) => state.signIn.signInRequired,

  plusOneForSinglePerson: (state) => state.guestFeedback.plusOneForSinglePerson,
  canEditAfterConfirmLatest: (state) =>
    state.guestFeedback.canEditAfterConfirmLatest,
  canChooseEatPreference: (state) => state.guestFeedback.canChooseEatPreference,
  canChooseDrinkPreference: (state) =>
    state.guestFeedback.canChooseDrinkPreference,
  canChooseNeedShuttle: (state) => state.guestFeedback.canChooseNeedShuttle,
  canChooseNeedHotel: (state) => state.guestFeedback.canChooseNeedHotel,

  canGuestEdit: (state) => {
    if (state.guestFeedback.canEditAfterConfirmLatest) return true;
    if (!state.general.confirmLatest) return false;

    return moment()
      .subtract(1, "d")
      .isBefore(moment(state.general.confirmLatest), "day");
  },
  primaryOverlayColor: (state) => {
    return colors.changeAlpha(state.appearance.primaryColor, 0.75);
  },
};

/**
 * way to change the state of a store direct
 */
const mutations = {
  set_general(state, data) {
    state.general.coupleName = data.coupleName;
    state.general.weddingDate = data.weddingDate;
    state.general.confirmLatest = data.confirmLatest;
    state.general.countdown = data.countdown;
    state.general.logo = data.logo?.data?.attributes || null;
  },
  set_appearance(state, data) {
    state.appearance.primaryColor = data.primaryColor;
    state.appearance.secondaryColor = data.secondaryColor;
    state.appearance.accentColor = data.accentColor;
    state.appearance.accentColorDarken = data.accentColorDarken;
    state.appearance.titleColor = data.titleColor;
    state.appearance.dividerTitleColor = data.dividerTitleColor;
  },
  set_signin(state, data) {
    state.signIn = data;
  },
  set_guestfeedback(state, data) {
    state.guestFeedback.plusOneForSinglePerson = data.plusOneForSinglePerson;
    state.guestFeedback.canEditAfterConfirmLatest =
      data.canEditAfterConfirmLatest;
    state.guestFeedback.canChooseEatPreference = data.canChooseEatPreference;
    state.guestFeedback.canChooseDrinkPreference =
      data.canChooseDrinkPreference;
    state.guestFeedback.canChooseNeedShuttle = data.canChooseNeedShuttle;
    state.guestFeedback.canChooseNeedHotel = data.canChooseNeedHotel;
  },
};

/**
 * change the state of a store by commits and are typically asynchron
 */
const actions = {
  async loadInit({ dispatch }, { locale, fallbackLocale }) {
    return await Promise.all([
      dispatch("loadGeneral"),
      dispatch("loadAppearance"),
      dispatch("loadSign", { locale, fallbackLocale }),
    ]);
  },
  async loadInitAfterSignIn({ dispatch }) {
    return await Promise.all([dispatch("loadGuestFeedback")]);
  },
  async loadGeneral({ commit }) {
    const query = qs.stringify(
      {
        populate: ["logo"],
      },
      {
        encodeValuesOnly: true, // prettify url
      }
    );
    const resp = await api({
      url: `/general?${query}`,
      method: "GET",
    });

    commit("set_general", resp.data.data.attributes);

    return resp;
  },
  async loadAppearance({ commit }) {
    const resp = await api({
      url: `appearance`,
      method: "GET",
    });

    commit("set_appearance", resp.data.data.attributes);

    return resp;
  },
  async loadSign({ commit, dispatch }, { locale, fallbackLocale }) {
    const query = qs.stringify(
      {
        locale: locale,
      },
      {
        encodeValuesOnly: true, // prettify url
      }
    );
    try {
      const resp = await api({
        url: `sign-in-setting?${query}`,
        method: "GET",
      });

      commit("set_signin", resp.data.data.attributes);
    } catch (e) {
      console.log("error", e);
      if (
        e.isAxiosError &&
        e.response &&
        e.response.status === 404 &&
        locale !== fallbackLocale
      ) {
        await dispatch("loadSign", { locale: fallbackLocale, fallbackLocale });
      } else {
        throw e;
      }
    }
  },
  async loadGuestFeedback({ commit }) {
    const resp = await api({
      url: `guest-feedback`,
      method: "GET",
    });

    commit("set_guestfeedback", resp.data.data.attributes);

    return resp;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
