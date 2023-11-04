/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ["**/.*"],
  serverModuleFormat: "cjs",
  env: {
    API_URL: process.env.API_URL
  },
  serverDependenciesToBundle: ["remix-utils/client-only"]
};
