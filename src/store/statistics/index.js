import { api } from "boot/axios";

const state = {
  users: [],
  guests: [],
};

const getters = {
  invitationsConfirmed: (state) => {
    return state.users.filter((user) => user.attend === "yes");
  },
  invitationsCanceled: (state) => {
    return state.users.filter((user) => user.attend === "no");
  },
  invitationsNoResponse: (state) => {
    return state.users.filter((user) => user.attend === "unknown");
  },
  invitationsConfirmedWithHotel: (state) =>
    state.users.filter(
      (user) =>
        user.attend === "yes" &&
        user.invitations_feedback &&
        user.invitations_feedback.needHotel
    ),
  invitationsConfirmedWithShuttle: (state) =>
    state.users.filter(
      (user) =>
        user.attend === "yes" &&
        user.invitations_feedback &&
        user.invitations_feedback.needShuttle
    ),
  invitationsConfirmedWithOther: (state) =>
    state.users.filter((user) => user.attend === "yes" && user.otherFilled),
  guestsAdults: (state) => {
    return state.guests.filter((guest) => guest.stageOfLife === "adult");
  },
  guestsChilds: (state) => {
    return state.guests.filter((guest) => guest.stageOfLife === "child");
  },
  guestsBabys: (state) => {
    return state.guests.filter((guest) => guest.stageOfLife === "baby");
  },
  guestsAttend: (state) => {
    return state.guests.filter((guest) => guest.attend === "yes");
  },
  guestsAttendAdults: (state) => {
    return state.guests.filter(
      (guest) => guest.stageOfLife === "adult" && guest.attend === "yes"
    );
  },
  guestsAttendChilds: (state) => {
    return state.guests.filter(
      (guest) => guest.stageOfLife === "child" && guest.attend === "yes"
    );
  },
  guestsAttendBabys: (state) => {
    return state.guests.filter(
      (guest) => guest.stageOfLife === "baby" && guest.attend === "yes"
    );
  },
  guestsAttendWithHotel: (state) => {
    const guests = [];
    const users = state.users.filter(
      (user) => user.attend === "yes" && user.takeHotel
    );
    for (const user of users) {
      guests.push(...user.guests.filter((guest) => guest.attend === "yes"));
    }
    return guests;
  },
};

const mutations = {
  update_data(state, users) {
    const guests = [];
    for (const user of users) {
      guests.push(...user.guests);
    }
    state.users = users
      .map((user) => {
        let foundCanceled = false;
        for (const guest of user.guests) {
          if (guest.guest_preference) {
            Object.keys(guest.guest_preference).forEach((key) => {
              if (
                guest.guest_preference[key].other &&
                guest.guest_preference[key].other > ""
              ) {
                user.otherFilled = true;
              }
            });
          }
          if (guest.attend === "yes") {
            user.attend = "yes";
          } else if (guest.attend === "no") {
            foundCanceled = true;
          }
        }
        if (foundCanceled && user.attend !== "yes") {
          user.attend = "no";
        } else if (user.attend !== "yes") {
          user.attend = "unknown";
        }
        return user;
      })
      .map((user) => {
        let count = 0;
        let countAttend = 0;
        for (const guest of user.guests) {
          count++;
          if (guest.attend === "yes") {
            countAttend++;
          }
        }
        user.guestsCount = count;
        user.guestsCountAttend = countAttend;
        return user;
      });
    state.guests = guests;
  },
};

const actions = {
  async loadData({ commit }) {
    const resp = await api({
      url: `/statistics/allguests`,
      method: "GET",
    });
    commit("update_data", resp.data);
    return resp.data;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
