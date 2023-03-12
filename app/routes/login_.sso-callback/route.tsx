import { LoaderArgs, redirect } from "@remix-run/node";
import { forbidden } from "remix-utils";
import { createSessionCookie } from "~/app/server/session.server";

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);

  const token = url.searchParams.get("token");
  if (token == null) {
    throw forbidden({ token: null });
  }

  const isFirstLogin = url.searchParams.get("isFirstLogin");
  return redirect(`/login/authenticated?isFirstLogin=${isFirstLogin}`, {
    headers: {
      "Set-Cookie": await createSessionCookie({ request, token })
    },
  })
};
