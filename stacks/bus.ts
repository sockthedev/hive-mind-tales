import * as iam from "aws-cdk-lib/aws-iam"
import type { StackContext } from "sst/constructs"
import { EventBus, Queue } from "sst/constructs"

export function Bus(ctx: StackContext) {
  const bus = new EventBus(ctx.stack, "bus", {
    rules: {
      send_magic_link: {
        pattern: {
          detailType: ["send-magic-link"],
        },
        targets: {
          auth: new Queue(ctx.stack, "auth-on-send-magic-link-queue", {
            consumer: {
              function: {
                handler: "server/functions/bus/auth.onSendMagicLink",
                permissions: [
                  new iam.PolicyStatement({
                    actions: ["ses:SendEmail", "SES:SendRawEmail"],
                    resources: ["*"],
                    effect: iam.Effect.ALLOW,
                  }),
                ],
              },
            },
          }),
        },
      },
    },
  })

  return { bus }
}
