import type { LinksFunction, MetaFunction } from "@remix-run/node"
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react"
import styles from "./tailwind.css"

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }]

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Hive Mind Tales",
  viewport: "width=device-width,initial-scale=1",
})

export default function App() {
  return (
    <html className="dark" lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="bg-yellow-50">
        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Outlet />
        </main>

        {/* Special Remix Components;*/}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
