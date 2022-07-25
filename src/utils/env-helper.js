export function getMediaHost() {
  return process.env.mediaHost || "http://localhost:1337";
}

export function getAdminPanel() {
  return process.env.adminPanel || "hhttp://localhost:1337/admin";
}

export function getAPI() {
  return process.env.API || "http://localhost:1337/api";
}
