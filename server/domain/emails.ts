import { SendEmailCommand, SESClient } from "@aws-sdk/client-ses"

const sesClient = new SESClient({})

export abstract class Mailer {
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

export abstract class Emails {
  public static async sendMagicLink(args: { email: string; link: string }) {
    // https://mjml.io/try-it-live/hF2AbPq6f
    const html = `
  <!doctype html>
  <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

  <head>
    <title>
    </title>
    <!--[if !mso]><!-->
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!--<![endif]-->
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style type="text/css">
      #outlook a {
        padding: 0;
      }

      body {
        margin: 0;
        padding: 0;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
      }

      table,
      td {
        border-collapse: collapse;
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
      }

      img {
        border: 0;
        height: auto;
        line-height: 100%;
        outline: none;
        text-decoration: none;
        -ms-interpolation-mode: bicubic;
      }

      p {
        display: block;
        margin: 13px 0;
      }
    </style>
    <!--[if mso]>
          <noscript>
          <xml>
          <o:OfficeDocumentSettings>
            <o:AllowPNG/>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
          </xml>
          </noscript>
          <![endif]-->
    <!--[if lte mso 11]>
          <style type="text/css">
            .mj-outlook-group-fix { width:100% !important; }
          </style>
          <![endif]-->
    <!--[if !mso]><!-->
    <link href="https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700" rel="stylesheet" type="text/css">
    <style type="text/css">
      @import url(https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700);
    </style>
    <!--<![endif]-->
    <style type="text/css">
      @media only screen and (min-width:480px) {
        .mj-column-per-100 {
          width: 100% !important;
          max-width: 100%;
        }
      }
    </style>
    <style media="screen and (min-width:480px)">
      .moz-text-html .mj-column-per-100 {
        width: 100% !important;
        max-width: 100%;
      }
    </style>
    <style type="text/css">
    </style>
  </head>

  <body style="word-spacing:normal;">
    <div style="">
      <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
      <div style="margin:0px auto;max-width:600px;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
          <tbody>
            <tr>
              <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
                <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                    <tbody>
                      <tr>
                        <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                          <div style="font-family:verdana;font-size:32px;font-weight:bold;line-height:1;text-align:center;color:#dc2626;">Hive Mind Tales</div>
                        </td>
                      </tr>
                      <tr>
                        <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                          <div style="font-family:verdana;font-size:16px;line-height:26px;text-align:left;color:#1c1917;">Yo.</div>
                        </td>
                      </tr>
                      <tr>
                        <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                          <div style="font-family:verdana;font-size:16px;line-height:26px;text-align:left;color:#1c1917;">You asked us to send you a sign in link for Hive Mind Tales.</div>
                        </td>
                      </tr>
                      <tr>
                        <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                          <div style="font-family:verdana;font-size:16px;line-height:26px;text-align:left;color:#1c1917;">Click the button below to log in.</div>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" vertical-align="middle" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                          <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;width:100%;line-height:100%;">
                            <tr>
                              <td align="center" bgcolor="#dc2626" role="presentation" style="border:none;border-radius:3px;cursor:auto;mso-padding-alt:10px 25px;background:#dc2626;" valign="middle">
                                <a href="${args.link}" style="display:inline-block;background:#dc2626;color:#ffffff;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:20px;font-weight:normal;line-height:120%;margin:0;text-decoration:none;text-transform:none;padding:10px 25px;mso-padding-alt:0px;border-radius:3px;" target="_blank"> LOGIN </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                          <div style="font-family:verdana;font-size:16px;line-height:26px;text-align:left;color:#1c1917;">The link is valid for 24 hours or until it is used. You will stay logged in for 60 days.</div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!--[if mso | IE]></td></tr></table><![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!--[if mso | IE]></td></tr></table><![endif]-->
    </div>
  </body>

  </html>
  `

    await Mailer.send({
      to: args.email,
      subject: "Sign in link for Hive Mind Tales",
      html,
    })
  }
}
