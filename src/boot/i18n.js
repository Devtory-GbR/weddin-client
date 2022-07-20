import moment from "moment";
import "moment/locale/de";
import "moment/locale/es";
import "moment/locale/it";
import "moment/locale/fr";
import "moment/locale/cs";
import "moment/locale/cs";

import { Quasar } from "quasar";
import { boot } from "quasar/wrappers";
import messages from "src/i18n";
import {
  fallBackVue,
  getMomentLocaleString,
  getQuasarLocaleString,
  getVueLocaleString,
} from "src/utils/locale-helper";
import { createI18n } from "vue-i18n";

let i18n;

export default boot(async ({ app, store }) => {
  const lng = store.state.locale.lng;
  const localeVue = getVueLocaleString(lng);
  const localeMoment = getMomentLocaleString(lng);
  const localeQuasar = getQuasarLocaleString(lng);

  /* set up vue locale */
  i18n = createI18n({
    locale: localeVue,
    fallbackLocale: fallBackVue,
    messages,
  });

  /* set moment locale */
  moment.locale(localeMoment);

  /* set quasar locale */
  try {
    await import(
      /* webpackInclude: /(de|es|fr|cs|it|en-US)\.js$/ */
      "quasar/lang/" + localeQuasar
    ).then((lang) => {
      Quasar.lang.set(lang.default);
    });
  } catch (err) {
    // Requested Quasar Language Pack does not exist,
    // let's not break the app, so catching error
    console.error(err);
  }

  // Set i18n instance on app
  app.use(i18n);
});

export { i18n };
