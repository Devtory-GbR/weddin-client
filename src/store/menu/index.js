import { api } from "boot/axios";
import moment from "moment";
const qs = require("qs");

/**
 * state of the store
 */
const state = {
  showInHeader: false,
  visibleFrom: null,
  content: [],
};

/**
 * computed derived state based on store state
 */
const getters = {
  showIconInHeader: (state) => {
    if (!state.showInHeader) return false;

    return moment().add(1, "d").isAfter(moment(state.visibleFrom), "day");
  },
};

/**
 * way to change the state of a store direct
 */
const mutations = {
  set_data(state, data) {
    state.showInHeader = data.showInHeader;
    state.visibleFrom = data.visibleFrom;
    state.content = data.content;
  },
};

/**
 * change the state of a store by commits and are typically asynchron
 */
const actions = {
  async loadMenu({ commit, dispatch }, { locale, fallbackLocale }) {
    const query = qs.stringify(
      {
        populate: {
          content: {
            populate: "*",
          },
        },
        locale: locale,
      },
      {
        encodeValuesOnly: true, // prettify url
      }
    );

    try {
      const resp = await api({
        url: `menu?${query}`,
        method: "GET",
      });
      commit("set_data", resp.data.data.attributes);
    } catch (e) {
      // check if only the languge record not available
      // then we try to reload the fallbaclLanguge
      if (
        e.isAxiosError &&
        e.response &&
        e.response.status === 404 &&
        locale !== fallbackLocale
      ) {
        await dispatch("loadMenu", {
          locale: fallbackLocale,
          fallbackLocale,
        });
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
