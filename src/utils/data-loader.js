export async function loadInit({ store }) {
  // add these point we wann load the data in  the specific order
  await store.dispatch("locale/load");
  await store.dispatch("user/checkToken");

  const locale = store.state.locale.lng;
  const fallbackLocale = store.getters["locale/fallbackLocale"];

  await store.dispatch("basedata/loadInit", { locale, fallbackLocale });
  await store.dispatch("menu/loadMenu", { locale, fallbackLocale });
}

export async function loadAfterSignIn({ store }) {
  const locale = store.state.locale.lng;
  const fallbackLocale = store.getters["locale/fallbackLocale"];

  await Promise.all([
    store.dispatch("basedata/loadInitAfterSignIn"),
    store.dispatch("content/loadHeader", { locale, fallbackLocale }),
    store.dispatch("content/loadFooter", { locale, fallbackLocale }),
    store.dispatch("content/loadSections", { locale, fallbackLocale }),
    store.dispatch("masterdata/loadGuestPrefrences", {
      locale,
      fallbackLocale,
    }),
    store.dispatch("guest/getGuestData"),
  ]);
}

export async function loadAferWithoutSignIn({ store }) {
  const locale = store.state.locale.lng;
  const fallbackLocale = store.getters["locale/fallbackLocale"];

  await Promise.all([
    store.dispatch("basedata/loadInitAfterSignIn"),
    store.dispatch("content/loadHeader", { locale, fallbackLocale }),

    store.dispatch("content/loadSections", { locale, fallbackLocale }),
  ]);
}

export async function loadWhenLanguageChange({ store }) {
  const locale = store.state.locale.lng;
  const fallbackLocale = store.getters["locale/fallbackLocale"];

  const load = [
    store.dispatch("content/loadHeader", { locale, fallbackLocale }),
    store.dispatch("content/loadFooter", { locale, fallbackLocale }),
    store.dispatch("content/loadSections", { locale, fallbackLocale }),
    store.dispatch("menu/loadMenu", { locale, fallbackLocale }),
  ];

  if (store.getters["basedata/signInRequired"]) {
    load.push(
      store.dispatch("masterdata/loadGuestPrefrences", {
        locale,
        fallbackLocale,
      })
    );
  }
  await Promise.all(load);
}
