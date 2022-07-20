import axios from "axios";
import { colors } from "quasar";
import { scroll } from "quasar";
import components from "src/utils/components";

const { getScrollTarget, setVerticalScrollPosition } = scroll;
const qs = require("qs");

const headerHeight = 50;

/**
 * state of the store
 */
const state = {
  header: {
    title: null,
    showCoupleName: null,
    showDate: null,
    showGuestName: null,
    showInvitationButton: null,
    brightText: null,
    headerOverlayColor: null,
    opacityOverlayColor: null,
    image: {},
    showCountdown: false,
  },
  footer: {
    text: null,
  },
  sections: [],
  activeMenu: null,
  anchorsMenu: [],
};

/**
 * computed derived state based on store state
 */
const getters = {
  headerImage: (state) => {
    if (state.header.image.data) {
      return `${process.env.server}${state.header.image.data.attributes.url}`;
    } else {
      return `imgs/header_placeholder.JPG`;
    }
  },
  headerOverlayColor: (state) => {
    if (!state.header.headerOverlayColor || !state.header.opacityOverlayColor) {
      return "#FFFFFF00";
    }
    return colors.changeAlpha(
      state.header.headerOverlayColor,
      state.header.opacityOverlayColor
    );
  },
  sectionsForUser: (state, getters, rootState) =>
    state.sections.filter((section) => {
      const user = rootState.user.user;
      if (section.attributes.invitation_types.data.length === 0) {
        return true;
      }
      if (!user || user.invitation_type === null) {
        return (
          section.attributes.invitation_types.data.findIndex(
            (item) => item.attributes.default
          ) > -1
        );
      } else {
        return (
          section.attributes.invitation_types.data.findIndex(
            (item) => item.attributes.type === user.invitation_type.type
          ) > -1
        );
      }
    }),
  menu: (state, getters) =>
    getters.sectionsForUser
      .filter((section) => section.attributes.showInMenu)
      .map((section) =>
        Object.assign({}, { title: section.attributes.title, id: section.id })
      ),
};

/**
 * way to change the state of a store direct
 */
const mutations = {
  set_header(state, data) {
    state.header = data;
  },
  set_footer(state, data) {
    state.footer = data;
  },
  set_sections(state, data) {
    /* at these point we group widgets together wich are next to each other */
    state.sections = data.map((item) => {
      const groupedContent = item.attributes.content.reduce(
        (accumulator, currentValue) => {
          if (
            accumulator.length > 0 &&
            accumulator[accumulator.length - 1].component ===
              currentValue.__component
          ) {
            accumulator[accumulator.length - 1].items.push(currentValue);
            return accumulator;
          }
          accumulator.push(
            Object.assign({
              component: currentValue.__component,
              items: [currentValue],
            })
          );

          return accumulator;
        },
        []
      );

      item.attributes.content = groupedContent;
      return item;
    });
  },
  set_activeMenu(state, id) {
    if (id) {
      id = parseInt(id);
    }
    state.activeMenu = id;
  },
};

/**
 * change the state of a store by commits and are typically asynchron
 */
const actions = {
  async loadHeader({ commit, dispatch }, { locale, fallbackLocale }) {
    const query = qs.stringify(
      {
        populate: ["image"],
        locale: locale,
      },
      {
        encodeValuesOnly: true, // prettify url
      }
    );
    try {
      const resp = await axios({
        url: `${process.env.API}/header?${query}`,
        method: "GET",
      });
      commit("set_header", resp.data.data.attributes);
    } catch (e) {
      // check if only the languge record not available
      // then we try to reload the fallbaclLanguge
      if (
        e.isAxiosError &&
        e.response &&
        e.response.status === 404 &&
        locale !== fallbackLocale
      ) {
        await dispatch("loadHeader", {
          locale: fallbackLocale,
          fallbackLocale,
        });
      } else {
        throw e;
      }
    }
  },
  async loadFooter({ commit, dispatch }, { locale, fallbackLocale }) {
    const query = qs.stringify(
      {
        locale: locale,
      },
      {
        encodeValuesOnly: true, // prettify url
      }
    );
    try {
      const resp = await axios({
        url: `${process.env.API}/footer?${query}`,
        method: "GET",
      });
      commit("set_footer", resp.data.data.attributes);
    } catch (e) {
      // check if only the languge record not available
      // then we try to reload the fallbaclLanguge
      if (
        e.isAxiosError &&
        e.response &&
        e.response.status === 404 &&
        locale !== fallbackLocale
      ) {
        await dispatch("loadFooter", {
          locale: fallbackLocale,
          fallbackLocale,
        });
      } else {
        throw e;
      }
    }
  },
  async loadSections({ commit, dispatch }, { locale, fallbackLocale }) {
    const query = qs.stringify(
      {
        pagination: {
          pageSize: 100,
        },
        sort: "sort",
        populate: {
          invitation_types: {
            populate: "*",
          },
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
      const resp = await axios({
        url: `${process.env.API}/sections?${query}`,
        method: "GET",
      });

      /* when data is empty we maybe want load in an other lng */
      if (
        resp.data.data &&
        resp.data.data.length === 0 &&
        locale !== fallbackLocale
      ) {
        await dispatch("loadSections", {
          locale: fallbackLocale,
          fallbackLocale,
        });
      } else {
        commit("set_sections", resp.data.data);
        commit("set_activeMenu", null);
      }
    } catch (e) {
      // check if only the languge record not available
      // then we try to reload the fallbaclLanguge
      if (
        e.isAxiosError &&
        e.response &&
        e.response.status === 404 &&
        locale !== fallbackLocale
      ) {
        await dispatch("loadSections", {
          locale: fallbackLocale,
          fallbackLocale,
        });
      } else {
        throw e;
      }
    }
  },
  navToTop({ commit }) {
    commit("set_activeMenu", null);
    setVerticalScrollPosition(window, 0, 500);
  },
  navToConfirmSection({ state, dispatch }) {
    const confirmSections = state.sections.filter((section) => {
      return (
        section.attributes.content?.filter(
          (item) => item.component === components.confirm
        ).length > 0
      );
    });
    if (confirmSections && confirmSections.length > 0) {
      dispatch("navToSection", confirmSections[0].id);
    }
  },
  navToSection({ commit }, id) {
    commit("set_activeMenu", id);
    const ele = document.getElementById(`section_${id}`);
    const target = getScrollTarget(ele);
    const offset = ele.offsetTop - headerHeight;
    const duration = 500;
    setVerticalScrollPosition(target, offset, duration);
  },
  scroll({ commit }, scrollTop) {
    const sections = document.querySelectorAll("section");
    for (let i = sections.length - 1; i >= 0; i--) {
      if (scrollTop >= sections[i].offsetTop - headerHeight) {
        commit("set_activeMenu", sections[i].getAttribute("data-id"));
        return;
      }
    }
    commit("set_activeMenu", null);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
