import { Auth } from "~/server/domain/auth"
import { Bus } from "~/server/domain/event-bus"

export const onSendMagicLink = Bus.handler(
  "send-magic-link",
  async (payload) => {
    await Auth.sendMagicLink(payload)
  },
)
