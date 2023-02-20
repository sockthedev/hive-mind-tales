/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ["**/.*"],
  future: {
    unstable_tailwind: true,
    v2_routeConvention: true,
  },
  serverDependenciesToBundle: ["lodash-es", /^d3-.*/],
}
