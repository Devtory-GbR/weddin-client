import { api } from "boot/axios";

export default function setup({ store }) {
  api.interceptors.request.use(function (config) {
    if (store.getters["user/isLoggedIn"]) {
      config.headers.Authorization = `Bearer ${store.getters["user/token"]}`;
    }
    return config;
  });
}
