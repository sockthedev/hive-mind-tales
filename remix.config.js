/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ["**/.*"],
  future: {
    v2_routeConvention: true,
  },
  serverDependenciesToBundle: [
    /^@tiptap.*/,
    "lodash-es",
    "@sockthedev/react-d3-tree",
    /^d3-.*/,
  ],
}
