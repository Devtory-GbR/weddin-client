const routes = [
  { path: "/", redirect: "home" },
  {
    path: "/init",
    component: () => import("src/pages/init.vue")
  },
  {
    path: "/login",
    component: () => import("src/pages/login.vue"),
  },
  {
    path: "/home",
    component: () => import("src/pages/home.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/dashboard",
    component: () => import("pages/dashboard/dashboard.vue"),
    meta: {
      requiresAdmin: true,
    },
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue"),
  },
];

export default routes;
