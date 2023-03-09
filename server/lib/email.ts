import { SendEmailCommand, SESClient } from "@aws-sdk/client-ses"

const sesClient = new SESClient({})

export abstract class Email {
  private static createSendEmailCommand(args: {
    to: string
    from: string
    replyTo?: string
    subject: string
    html: string
  }) {
    return new SendEmailCommand({
      Destination: {
        CcAddresses: [],
        ToAddresses: [args.to],
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: args.html,
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: args.subject,
        },
      },
      Source: args.from,
      ReplyToAddresses: args.replyTo ? [args.replyTo] : [],
    })
  }

  public static async send(args: {
    to: string
    subject: string
    html: string
  }) {
    const sendEmailCommand = this.createSendEmailCommand({
      to: args.to,
      // TODO: Make this configurable;
      from: "no-reply@development.hivemindtales.com",
      subject: args.subject,
      html: args.html,
    })

    await sesClient.send(sendEmailCommand)
  }
}
