import axios from "axios";
import { Cookies } from "quasar";

/**
 * state of the store
 */
const state = {
  // Data
  token: Cookies.get("token") || null,
  user: null,
};

/**
 * computed derived state based on store state
 */
const getters = {
  isLoggedIn: (state) => !!state.token,
  token: (state) => state.token,
  isAdmin: (state) => state.user && state.user.role.type === "admin",
  getInitals: (state) => {
    if (!state.user || !state.user.invitationname) {
      return "U";
    }
    const res = state.user.invitationname.split(" ");
    if (res.length === 1) {
      return res[0].charAt(0);
    }
    if (res.length === 2) {
      return res[0].charAt(0) + res[1].charAt(0);
    }
    if (res.length >= 3) {
      return (
        res[0].charAt(0) +
        (res[1].charAt(0) === "&" ? res[2].charAt(0) : res[1].charAt(0))
      );
    }
  },
  needHotel: (state) => {
    if (!state.user) {
      return false;
    }
    if (!state.user.invitations_feedback) {
      return false;
    }
    return state.user.invitations_feedback.needHotel;
  },
  needShuttle: (state) => {
    if (!state.user) {
      return false;
    }
    if (!state.user.invitations_feedback) {
      return false;
    }

    return state.user.invitations_feedback.needShuttle;
  },
  canConfirm: (state) => {
    return state.user &&
      !state.user.isGroupInvitation &&
      ((state.user.invitation_type &&
        state.user.invitation_type.canConfirm) ||
        !state.user.invitation_type);
  },
};

/**
 * way to change the state of a store direct
 */
const mutations = {
  auth_success(state, token) {
    state.token = token;
    Cookies.set("token", token);
  },
  auth_clear(state) {
    state.token = null;
    state.user = null;
    Cookies.remove("token");
  },
  refresh_user(state, user) {
    state.user = user;
  },
  update_feedback(state, feedback) {
    if (state.user.invitations_feedback) {
      state.user.invitations_feedback = Object.assign(state.user.invitations_feedback, feedback);
    }
    state.user.invitations_feedback = feedback;
  },
  set_feedback(state, data) {
    state.user.invitations_feedback = data;
  },
  update_subscriber(state, sub) {
    state.user.subscriber = sub;
  },
};

/**
 * change the state of a store by commits and are typically asynchron
 */
const actions = {
  async checkToken({ commit, state }) {
    if (!state.token) {
      return;
    }
    try {
      const resp = await axios({
        url: `${process.env.API}/users/me`,
        method: "GET",
      });
      commit("refresh_user", resp.data);
    } catch (e) {
      /* when status 401 there is an error with the save token
        and we wil delete it
      */
      if (e.response.status === 401) {
        commit("auth_clear");
      } else {
        throw e;
      }
    }
  },
  async login({ commit, dispatch }, code) {
    const authReq = {
      identifier: code,
      password: code,
    };
    const respLogin = await axios({
      url: `${process.env.API}/auth/local`,
      data: authReq,
      method: "POST",
    });
    commit("auth_success", respLogin.data.jwt);

    const respUser = await axios({
      url: `${process.env.API}/users/me`,
      method: "GET",
    });
    commit("refresh_user", respUser.data);
  },
  logout({ commit }) {
    commit("auth_clear");
  },
  async loadUserData({ commit, state }) {
    const resp = await axios({
      url: `${process.env.API}/users/me`,
      method: "GET",
    });
    commit("refresh_user", resp.data);
  },
  async updateUserFeedback({ commit, state }, {
    needHotel = state.user.invitations_feedback?.needHotel || false,
    needShuttle = state.user.invitations_feedback?.needShuttle || false }) {
    const method = state.user.invitations_feedback ? "PUT" : "POST";
    const url = state.user.invitations_feedback ?
      `${process.env.API}/invitations-feedbacks/${state.user.invitations_feedback.id}` :
      `${process.env.API}/invitations-feedbacks`;
    const data = {
      needHotel: needHotel,
      needShuttle: needShuttle
    }

    /* set data in advance, so just that the ui has change to upddate 
       when the loading is damn long
    */
    commit("update_feedback", data);

    const resp = await axios({
      url, data: { data }, method
    });
    commit("set_feedback", Object.assign({}, { id: resp.data.data.id }, resp.data.data.attributes));
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
