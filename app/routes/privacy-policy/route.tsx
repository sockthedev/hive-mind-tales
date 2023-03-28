import { H1, H2, P, Spacer } from "~/app/components"
import { NarrowContent } from "~/app/components/narrow-content"

export default function PrivacyPolicyRoute() {
  return (
    <NarrowContent>
      <Spacer size="lg" />

      <H1>Privacy Policy</H1>

      <P className="text-sm">Last updated: 2023-03-28</P>

      <H2>1. Introduction</H2>
      <P>
        Hive Mind Tales ("we," "us," or "our") respects your privacy and is
        committed to protecting it through our compliance with this Privacy
        Policy. This Privacy Policy describes how we collect, use, and share
        your personal information when you use our website and its services
        (collectively, the "Services").
      </P>

      <H2>2. Information We Collect</H2>
      <P>
        We collect the following types of information when you use the Services:
      </P>
      <ul>
        <li>
          <strong>Account Information:</strong> When you create an account, we
          collect your email address and OAuth information from your Twitter or
          Google account, if applicable.
        </li>
        <li>
          <strong>User Content:</strong> We collect any stories, contributions
          to stories, and other content you submit to the Services.
        </li>
        <li>
          <strong>Usage Data:</strong> We automatically collect certain
          information about your interactions with the Services, such as your IP
          address, browser type, and device information.
        </li>
      </ul>

      <H2>3. How We Use Your Information</H2>
      <P>We use the information we collect to:</P>
      <ul>
        <li>Provide, maintain, and improve the Services;</li>
        <li>Authenticate your identity and manage your account;</li>
        <li>Respond to your questions or requests for support;</li>
        <li>Analyze usage trends and user preferences;</li>
        <li>Enforce our Terms of Service;</li>
        <li>
          Prevent, detect, and address fraud or other illegal activities; and
        </li>
        <li>Comply with legal obligations and protect our rights.</li>
      </ul>

      <H2>4. How We Share Your Information</H2>
      <P>
        We do not sell or rent your personal information to third parties. We
        may share your information with third parties in the following
        circumstances:
      </P>
      <ul>
        <li>
          <strong>Service Providers:</strong> We may share your information with
          vendors and other service providers who perform services on our
          behalf, such as web hosting, analytics, and email delivery.
        </li>
        <li>
          <strong>Legal Compliance:</strong> We may disclose your information if
          required to do so by law or in response to a court order, subpoena, or
          other legal process.
        </li>
        <li>
          <strong>Protection of Rights:</strong> We may disclose your
          information if we believe it is necessary to protect our rights,
          property, or safety, or the rights, property, or safety of others.
        </li>
        <li>
          <strong>Business Transfers:</strong> In the event of a merger,
          acquisition, or sale of assets, we may transfer your information to
          the acquiring or surviving entity.
        </li>
      </ul>

      <H2>5. Security</H2>
      <P>
        We take reasonable measures to protect your personal information from
        unauthorized access, use, or disclosure. However, no method of
        transmission or storage is completely secure, and we cannot guarantee
        the absolute security of your information.
      </P>

      <H2>6. Data Retention</H2>
      <P>
        We will retain your personal information for as long as necessary to
        provide the Services or for other legitimate purposes, such as legal
        compliance, dispute resolution, or the enforcement of our agreements.
      </P>

      <H2>7. Children's Privacy</H2>
      <P>
        The Services are not intended for or directed to children under the age
        of 13. We do not knowingly collect personal information from children
        under 13. If you believe that we have collected personal information
        from a child under 13, please contact us so that we can take appropriate
        action.
      </P>

      <H2>8. International Users</H2>
      <P>
        If you are using the Services from outside the United Kingdom, please be
        aware that your information may be transferred to, stored, and processed
        in the United Kingdom and other countries where our servers or service
        providers are located. By using the Services, you consent to the
        transfer, storage, and processing of your information in these
        countries.
      </P>

      <H2>9. Changes to This Privacy Policy</H2>
      <P>
        We reserve the right to update or modify this Privacy Policy at any
        time, with or without notice. If we make changes to this Privacy Policy,
        we will post the updated Privacy Policy on this page and update the
        "Last updated" date at the top of this Privacy Policy. Your continued
        use of the Services after any changes to this Privacy Policy constitutes
        your acceptance of the revised Privacy Policy.
      </P>

      <H2>10. Contact Information</H2>
      <P>
        If you have any questions or concerns about this Privacy Policy or our
        privacy practices, please contact us at sockthedev@gmail.com.
      </P>
    </NarrowContent>
  )
}
