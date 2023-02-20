import type { LinksFunction, MetaFunction } from "@remix-run/node"
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react"
import { Column } from "./components"
import { Header } from "./components/header"
import stylesheet from "./tailwind.css"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
]

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Hive Mind Tales",
  viewport:
    "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
})

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="bg-yellow-50">
        <Column>
          <Header />
        </Column>

        <main>
          <Outlet />
        </main>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
