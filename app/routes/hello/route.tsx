// app/routes/hello/route.tsx

import { useLoaderData } from "@remix-run/react"
import type { Loader } from "./server"

export * from "./server"

export default function HelloRoute() {
  const data = useLoaderData<Loader>()
  return <h1>{data.message}</h1>
}
