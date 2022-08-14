export const fallBackMoment = "en";
export const fallBackQuasar = "en-US";
export const fallBackVue = "en-US";

export function getMomentLocaleString(localeString) {
  const lang = localeString.split("-")[0].toLowerCase();
  switch (lang) {
    case "en":
      return "en";
    case "de":
      return "de";
    case "cs":
      return "cs";
    // case "es":
    //   return "es";
    // case "fr":
    //   return "fr";
    // case "it":
    //   return "it";
    default:
      return fallBackMoment;
  }
}

export function getQuasarLocaleString(localeString) {
  const lang = localeString.split("-")[0].toLowerCase();
  switch (lang) {
    case "en":
      return "en-US";
    case "de":
      return "de";
    case "cs":
      return "cs";
    // case "es":
    //   return "es";
    // case "fr":
    //   return "fr";
    // case "it":
    //   return "it";
    default:
      return fallBackQuasar;
  }
}

export function getVueLocaleString(localeString) {
  const lang = localeString.split("-")[0].toLowerCase();
  switch (lang) {
    case "en":
      return "en-US";
    case "de":
      return "de-DE";
    case "cs":
      return "cs";
    // case "es":
    //   return "es";
    // case "fr":
    //   return "fr";
    // case "it":
    //   return "it";
    default:
      return fallBackVue;
  }
}
