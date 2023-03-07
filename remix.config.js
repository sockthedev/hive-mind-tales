/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ["**/.*"],
  future: {
    unstable_tailwind: true,
    v2_routeConvention: true,
  },
  serverDependenciesToBundle: [
    /^d3-.*/,
    "codsen-utils",
    "lodash-es",
    "lodash.clonedeep",
    "lodash.without",
    "lodash.trim",
    "date-fns",
    "kysely",
    "kysely-planetscale",
    "@planetscale/database",
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
