import { store } from "quasar/wrappers";
import { createStore } from "vuex";

import app from "./app";
import locale from "./locale";
import user from "./user";
import guest from "./guest";
import statistics from "./statistics";
import dataChanged from "./datechanged";
import basedata from "./basedata";
import masterdata from "./masterdata";
import content from "./content";
import menu from "./menu";

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default store(function (/* { ssrContext } */) {
  const Store = createStore({
    modules: {
      app,
      locale,
      user,
      guest,
      statistics,
      dataChanged,
      basedata,
      masterdata,
      content,
      menu,
    },

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: process.env.DEBUGGING,
  });

  return Store;
});
