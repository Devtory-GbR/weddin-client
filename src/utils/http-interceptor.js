import axios from "axios";

export default function setup({ store }) {
  axios.interceptors.request.use(function (config) {
    if (store.getters["user/isLoggedIn"]) {
      config.headers.Authorization = `Bearer ${store.getters["user/token"]}`;
    }
    return config;
  });
}
