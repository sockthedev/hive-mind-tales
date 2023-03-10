import { Emails } from "~/server/domain/emails"
import { Bus } from "~/server/domain/event-bus"

export const onSendMagicLink = Bus.handler(
  "send-magic-link",
  async (payload) => {
    await Emails.sendMagicLink(payload)
  },
)
