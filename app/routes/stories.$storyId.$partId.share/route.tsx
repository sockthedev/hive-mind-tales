import { H1, P } from "~/app/components";
import { NarrowContent } from "~/app/components/narrow-content";

export default function ShareStoryPartRoute() {
  return (
    <NarrowContent>
      <H1>Share</H1>
      <P>Invite others to continue this story by using one of the methods below.</P>
      <a className="twitter-share-button"
        href="https://twitter.com/intent/tweet?text=Hello%20world">
        Tweet</a>
    </NarrowContent>
  )
}
