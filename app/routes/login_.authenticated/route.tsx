import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { forbidden } from "remix-utils";
import { parseLoginActionCookie } from "~/app/server/login-action-cookie.server";
import { getToken } from "~/app/server/session.server";
import { trpc } from "~/app/server/trpc.server";

export const loader = async ({ request, params }: LoaderArgs) => {
  const token = await getToken(request)
  if (token == null) {
    throw forbidden({ token: null });
  }

  const loginAction = await parseLoginActionCookie(request);

  let redirectTo = '/';

  if (loginAction) {
    switch (loginAction.type) {
      case 'create-story':
        const { story, part } = await trpc(token).stories.create.mutate({
          title: loginAction.payload.title,
          content: loginAction.payload.content,
          visibleInFeeds: loginAction.payload.visibleInFeeds,
        })
        throw redirect(`/stories/${story.storyId}/${part.partId}/share`, {
          status: 302,
        })
    }
  }

  if (params["isFirstLogin"] !== "true") {
    throw redirect(redirectTo);
  }

  return {
    redirect: redirectTo,
  };
};

export default function AuthenticatedRoute() {
  const data = useLoaderData<typeof loader>();
  return (
    <div>
      <h1>Welcome to Hive Mind Tales</h1>
      <p>{data.redirect}</p>
    </div>
  );
}

