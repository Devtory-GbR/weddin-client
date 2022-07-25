import { api } from "boot/axios";
const qs = require("qs");

/**
 * state of the store
 */
const state = {
  // Data
  guests: {},
  guestsPreferenceData: {},
};

/**
 * computed derived state based on store state
 */
const getters = {
  guests: (state) => {
    return Object.entries(state.guests)
      .map(([id, guest]) => guest)
      .sort((a, b) => {
        // if both new entries, we will sort after the id
        if (!a.fixed && !b.fixed) {
          return a.id - b.id;
        }

        if (a.fixed !== b.fixed) {
          if (a.fixed) {
            return -1;
          } else {
            return 1;
          }
        }
        if (a.stageOfLife !== b.stageOfLife) {
          if (a.stageOfLife === "adult") {
            return -1;
          }
          if (b.stageOfLife === "adult") {
            return 1;
          }
          if (a.stageOfLife === "child") {
            return -1;
          }
          if (b.stageOfLife === "child") {
            return 1;
          }
        }
        return a.name.localeCompare(b.name);
      });
  },

  // 0 - no response, 1 - confirmed,  2 - canceled
  responseState: (state) => {
    let foundCanceled = false;
    for (const [key, guest] of Object.entries(state.guests)) {
      if (guest.attend === "yes") {
        return 1;
      }
      if (guest.attend === "no") {
        foundCanceled = true;
      }
    }
    if (foundCanceled) {
      return 2;
    } else {
      return 0;
    }
  },

  numberPersons: (state) =>
    Object.entries(state.guests).filter(
      ([key, guest]) => guest.attend === "yes"
    ).length,

  numberPersonsAll: (state) => Object.entries(state.guests).length,

  canAddGuest: (state) =>
    Object.entries(state.guests).filter(
      ([key, guest]) =>
        guest.stageOfLife === "adult" &&
        (guest.attend === "yes" || guest.attend === "unknown")
    ).length < 2,

  canAttendGuest: (state) =>
    Object.entries(state.guests).filter(
      ([key, guest]) => guest.stageOfLife === "adult" && guest.attend === "yes"
    ).length < 2,
};

/**
 * way to change the state of a store direct
 */
const mutations = {
  set_guests(state, { guests, preferencesMaster }) {
    state.guests = guests.reduce((acc, curr) => {
      acc[curr.id] = curr;
      return acc;
    }, {});
    this.commit("guest/updated_preferencesMaster", preferencesMaster, {
      root: true,
    });
  },
  updated_preferencesMaster(state, preferencesMaster) {
    Object.entries(state.guests).forEach(([id, guest]) => {
      this.commit(
        "guest/update_preferencesMasterForGuest",
        { guest, preferencesMaster },
        { root: true }
      );
    });
  },
  update_preferencesMasterForGuest(state, { guest, preferencesMaster }) {
    // fill the master data for each guest
    state.guestsPreferenceData[guest.id] = preferencesMaster
      .filter((preference) => {
        return (
          preference.attributes.active &&
          ((guest.stageOfLife === "baby" &&
            preference.attributes.canBabyChoose) ||
            (guest.stageOfLife === "child" &&
              preference.attributes.canChildChoose) ||
            (guest.stageOfLife === "adult" &&
              preference.attributes.canAdultChoose)) &&
          preference.attributes.guest_prefrence_items.data.filter((item) => {
            return (
              (guest.stageOfLife === "baby" && item.attributes.forBaby) ||
              (guest.stageOfLife === "child" && item.attributes.forChild) ||
              (guest.stageOfLife === "adult" && item.attributes.forAdult)
            );
          }).length > 0
        );
      })
      .map((preference) => {
        const newPeference = Object.assign({}, preference.attributes, {
          items: [],
        });

        newPeference.items = preference.attributes.guest_prefrence_items.data
          .filter((item) => {
            return (
              (guest.stageOfLife === "baby" && item.attributes.forBaby) ||
              (guest.stageOfLife === "child" && item.attributes.forChild) ||
              (guest.stageOfLife === "adult" && item.attributes.forAdult)
            );
          })
          .map((item) => item.attributes)
          .sort((a, b) => {
            if (a.sort === b.sort) {
              return a.label.localeCompare(b.label);
            }
            return a.sort - b.sort;
          });

        return newPeference;
      });

    // set maybe a default value for the guest
    if (!guest.guest_preference) {
      guest.guest_preference = {};
    }
    state.guestsPreferenceData[guest.id].forEach((preference) => {
      const key = preference.key;

      if (!guest.guest_preference[key]) {
        guest.guest_preference[key] = {};
      }

      if (
        guest.guest_preference[key].items === undefined &&
        preference.defaultSelection !== null
      ) {
        guest.guest_preference[key].items = [];
        guest.guest_preference[key].items.push(
          preference.items[preference.defaultSelection].value
        );
      }
      if (
        (!guest.guest_preference[key].items ||
          guest.guest_preference[key].items.length === 0) &&
        preference.isOneSelectionRequired
      ) {
        guest.guest_preference[key].items = [];
        guest.guest_preference[key].items.push(preference.items[0].value);
      }
    });
  },
  update_response(state, { id, attend }) {
    if (attend) {
      state.guests[id].attend = "yes";
    } else {
      state.guests[id].attend = "no";
    }
  },
  update_name(state, { id, name }) {
    state.guests[id].name = name;
  },
  update_preference(state, { id, key, items }) {
    if (!state.guests[id].guest_preference[key]) {
      state.guests[id].guest_preference[key] = {};
    }
    state.guests[id].guest_preference[key].items = items;
  },
  update_preferenceOther(state, { id, key, other }) {
    if (!state.guests[id].guest_preference[key]) {
      state.guests[id].guest_preference[key] = {};
    }
    state.guests[id].guest_preference[key].other = other;
  },
  add_guest(state, { guest, preferencesMaster }) {
    state.guests[guest.id] = guest;
    this.commit(
      "guest/update_preferencesMasterForGuest",
      { guest, preferencesMaster },
      { root: true }
    );
  },
  delete_guest(state, id) {
    delete state.guests[id];
    delete state.guestsPreferenceData[id];
  },
};

/**
 * change the state of a store by commits and are typically asynchron
 */
const actions = {
  async getGuestData({ commit, rootState }) {
    const query = qs.stringify(
      {
        // at these point we don't need nay filtering
        // it happens all in the backend during the isSameUser Policy
        filters: {
          invitation: {
            id: {
              $eq: rootState.user.user.id,
            },
          },
        },
        pagination: {
          pageSize: 100,
        },
        sort: "id",
        populate: "*",
      },
      {
        encodeValuesOnly: true, // prettify url
      }
    );
    const resp = await api({
      url: `guests?${query}`,
      method: "GET",
    });
    commit("set_guests", {
      guests: resp.data.data.map((guestRaw) =>
        Object.assign({ id: guestRaw.id }, guestRaw.attributes)
      ),
      preferencesMaster: rootState.masterdata.guestPreferences,
    });
  },
  saveData({ commit, state }, id) {
    return api({
      url: `guests/${id}`,
      method: "PUT",
      data: { data: state.guests[id] },
    });
  },
  async addGuest({ commit, state, rootState }) {
    const resp = await api({
      url: `guests`,
      method: "POST",
      data: {
        data: {
          invitation: rootState.user.user.id,
          name: "",
          stageOfLife: "adult",
          fixed: false,
          attend: "unknown",
        },
      },
    });
    commit("add_guest", {
      guest: Object.assign(
        { id: resp.data.data.id },
        resp.data.data.attributes
      ),
      preferencesMaster: rootState.masterdata.guestPreferences,
    });
    return resp;
  },
  async deleteGuest({ commit }, id) {
    await api({
      url: `guests/${id}`,
      method: "DELETE",
    });
    commit("delete_guest", id);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
