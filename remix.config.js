/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ["**/.*"],
  future: {
    unstable_tailwind: true,
    v2_routeConvention: true,
    v2_errorBoundary: true,
    v2_normalizeFormMethod: true,
    v2_meta: true,
  },
  serverDependenciesToBundle: [
    /^d3-.*/,
    "codsen-utils",
    "lodash-es",
    "lodash.clonedeep",
    "lodash.without",
    "lodash.trim",
    "html-entities",
    "ranges-apply",
    "ranges-merge",
    "ranges-push",
    "ranges-sort",
    "string-collapse-leading-whitespace",
    "string-left-right",
    "string-strip-html",
  ],
}
