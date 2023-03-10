import {
  EventBridgeClient,
  PutEventsCommand,
} from "@aws-sdk/client-eventbridge"
import type { SQSEvent } from "aws-lambda"
import { EventBus } from "sst/node/event-bus"
import { Auth } from "~/server/domain/auth.js"

interface BusEvents {
  "send-magic-link": {
    email: string
    link: string
  }
}

type BusEventType = keyof BusEvents

const client = new EventBridgeClient({})

export abstract class Bus {
  public static async publish<EventType extends BusEventType>(args: {
    type: EventType
    properties: BusEvents[EventType]
  }) {
    await client.send(
      new PutEventsCommand({
        Entries: [
          {
            EventBusName: EventBus.bus.eventBusName,
            Detail: JSON.stringify(args.properties),
            DetailType: args.type,
            Source: "ck",
          },
        ],
      }),
    )
  }

  public static handler<Type extends BusEventType>(
    _type: Type,
    handler: (properties: BusEvents[Type]) => Promise<void>,
  ) {
    const result = async (event: SQSEvent) => {
      Auth.useSystemAuthentication()

      for (const record of event.Records) {
        const msg = JSON.parse(record.body)
        await handler(msg.detail)
        // TODO: Error handling for this
      }
    }

    return result
  }
}
