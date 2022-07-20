import axios from "axios";
const qs = require("qs");

/**
 * state of the store
 */
const state = {
  guestPreferences: [],
};

/**
 * computed derived state based on store state
 */
const getters = {};

/**
 * way to change the state of a store direct
 */
const mutations = {
  set_guestPrefrences(state, data) {
    state.guestPreferences = data;
    this.commit('guest/updated_preferencesMaster', state.guestPreferences, { root: true });
  },
};

/**
 * change the state of a store by commits and are typically asynchron
 */
const actions = {
  async loadGuestPrefrences({ commit, dispatch }, { locale, fallbackLocale }) {
    const query = qs.stringify(
      {
        pagination: {
          pageSize: 100,
        },
        sort: "sort",
        populate: {
          guest_prefrence_items: "*",
        },
        locale: locale,
        filters: {
          active: {
            $eq: true,
          },
        },
      },
      {
        encodeValuesOnly: true, // prettify url
      }
    );
    try {
      const resp = await axios({
        url: `${process.env.API}/guest-preferences?${query}`,
        method: "GET",
      });
      if (resp.data.data && resp.data.data.length === 0 &&
        locale !== fallbackLocale
      ) {
        await dispatch("loadGuestPrefrences", { locale: fallbackLocale, fallbackLocale });
      } else {
        commit("set_guestPrefrences", resp.data.data);

      }
    } catch (e) {
      // check if only the languge record not available
      // then we try to reload the fallbaclLanguge
      if (e.isAxiosError &&
        e.response && e.response.status === 404 &&
        locale !== fallbackLocale
      ) {
        await dispatch("loadGuestPrefrences", { locale: fallbackLocale, fallbackLocale });
      } else {
        throw e;
      }
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
