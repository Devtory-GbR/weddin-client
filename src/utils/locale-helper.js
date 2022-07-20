export const fallBackMoment = "en";
export const fallBackQuasar = "en-US";
export const fallBackVue = "en-US";

export function getMomentLocaleString(localeString) {
  const lang = localeString.split("-")[0].toLowerCase();
  switch (lang) {
    case "de":
      return "de";
    case "es":
      return "es";
    case "fr":
      return "fr";
    case "cs":
      return "cs";
    case "it":
      return "it";
    case "en":
      return "en";
    default:
      return fallBackMoment;
  }
}

export function getQuasarLocaleString(localeString) {
  const lang = localeString.split("-")[0].toLowerCase();
  switch (lang) {
    case "de":
      return "de";
    case "es":
      return "es";
    case "fr":
      return "fr";
    case "cs":
      return "cs";
    case "it":
      return "it";
    case "en":
      return "en-US";
    default:
      return fallBackQuasar;
  }
}

export function getVueLocaleString(localeString) {
  const lang = localeString.split("-")[0].toLowerCase();
  switch (lang) {
    case "de":
      return "de-DE";
    case "es":
      return "es";
    case "fr":
      return "fr";
    case "cs":
      return "cs";
    case "it":
      return "it";
    case "en":
      return "en-US";
    default:
      return fallBackVue;
  }
}
