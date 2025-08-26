import { api } from "boot/axios";
const qs = require("qs");

/**
 * state of the store
 */
const state = {
  // Data
  tables: {},
};

/**
 * computed derived state based on store state
 */
const getters = {
  tables: (state) => {
    return Object.values(state.tables).sort((a, b) => {
      const ao = a.order ?? a.id ?? 0;
      const bo = b.order ?? b.id ?? 0;
      return (
        ao - bo || String(a.name || "").localeCompare(String(b.name || ""))
      );
    });
  },
};

/**
 * way to change the state of a store direct
 */
const mutations = {
  set_tables(state, { tables }) {
    state.tables = tables.reduce((acc, curr) => {
      acc[curr.id] = curr;
      return acc;
    }, {});
  },
};

/**
 * change the state of a store by commits and are typically asynchron
 */
const actions = {
  async getTableData({ commit }) {
    const query = qs.stringify(
      {
        filters: {},
        pagination: { pageSize: 1000 },
        sort: ["order:asc", "id:asc"],
        populate: { guests: { populate: "*" } },
      },
      { encodeValuesOnly: true }
    );
    const resp = await api({ url: `tables?${query}`, method: "GET" });
    commit("set_tables", {
      tables: resp.data.data.map((table) =>
        Object.assign({ id: table.id }, table.attributes)
      ),
    });
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
