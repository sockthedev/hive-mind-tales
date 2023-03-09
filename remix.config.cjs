/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ["**/.*"],
  serverModuleFormat: "esm",
  future: {
    unstable_tailwind: true,
    v2_routeConvention: true,
  },
  serverDependenciesToBundle: "all",
}
