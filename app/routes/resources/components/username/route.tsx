import type { LoaderArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import { useFetcher } from "@remix-run/react"
import clsx from "clsx"
import React from "react"
import { zfd } from "zod-form-data"

import { apiClient } from "~/app/server/api-client.server"

const searchParamsSchema = zfd.formData({
  userId: zfd.text(),
})

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url)
  const { userId } = searchParamsSchema.parse(url.searchParams)

  const username = await apiClient({
    request,
    thunk: (client) => client.users.username.query({ userId }),
  })

  // TODO:
  // - Consider a caching strategy here.
  return json({ username }, 200)
}

export type FullStackUsernameProps = {
  userId: string
  className?: string
}

export const FullStackUsername: React.FC<FullStackUsernameProps> = (props) => {
  const fetcher = useFetcher()

  React.useEffect(() => {
    if (fetcher.type === "init") {
      fetcher.load(`/resources/components/username?userId=${props.userId}`)
    }
  }, [fetcher, props.userId])

  const username = fetcher.data?.username
  if (!username) {
    return null
  }

  return <span className={clsx("font-bold", props.className)}>@{username}</span>
}
