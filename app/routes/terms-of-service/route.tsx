import { H1, H2, P, Spacer } from "~/app/components"
import { NarrowContent } from "~/app/components/narrow-content"

export default function TermsOfServiceRoute() {
  return (
    <NarrowContent>
      <Spacer size="lg" />

      <H1>Terms of Service</H1>

      <P className="text-sm">Last updated: 2023-03-28</P>

      <H2>1. Introduction</H2>
      <P>
        Welcome to Hive Mind Tales ("we," "us," or "our"). Hive Mind Tales is a
        web-based platform that allows users to create, collaborate on, and
        share stories. By accessing or using our website and its services
        (collectively, the "Services"), you ("you," "your," or "user") agree to
        be bound by these Terms of Service ("Terms"). If you do not agree to
        these Terms, please do not use the Services.
      </P>

      <H2>2. Eligibility</H2>
      <P>
        To use the Services, you must be at least 13 years old and have the
        legal capacity to enter into a binding agreement. By using the Services,
        you represent and warrant that you meet these requirements.
      </P>

      <H2>3. User Accounts and Authentication</H2>
      <P>
        To create a user account, you can authenticate via OAuth with your
        Twitter or Google account, or provide your email address to receive a
        magic link. You are responsible for maintaining the confidentiality of
        your login credentials and for all activities that occur under your
        account. If you need assistance recovering your account or resetting
        your password, please contact us.
      </P>

      <H2>4. User Content and Conduct</H2>
      <P>
        "User Content" refers to any stories, contributions to stories, and any
        other content submitted to the Services by users. By submitting User
        Content, you represent that you have the necessary rights and
        permissions to do so. You are responsible for your own User Content and
        for any consequences that may arise from it.
      </P>
      <P>
        You agree not to submit User Content that is illegal, offensive, or
        otherwise violates these Terms. We reserve the right to remove or modify
        User Content at our discretion. By submitting User Content, you grant us
        a non-exclusive, royalty-free, worldwide license to use, display, and
        distribute your User Content, subject to the limitations necessary to
        protect your privacy.
      </P>

      <H2>5. Privacy and Data Use</H2>
      <P>
        We collect, use, and store user data, including email addresses and
        OAuth information, to provide and improve the Services. We do not expose
        email addresses or send automated emails to users. For more detailed
        information about our data handling practices, please review our Privacy
        Policy.
      </P>

      <H2>6. Collaboration and Story Ratings</H2>
      <P>
        Users can invite others to collaborate on their stories by adding
        branches to the original story. Users can also choose whether their
        stories appear in our top-rated or most recent lists.
      </P>

      <H2>7. Intellectual Property</H2>
      <P>
        Users retain ownership of their User Content, subject to the license
        granted to us in these Terms. By submitting User Content, you grant us a
        non-exclusive, royalty-free, worldwide license to use, display, and
        distribute your User Content, subject to the limitations necessary to
        protect your privacy.
      </P>
      <P>
        The Services and their underlying technology, including all software,
        designs, text, images, and other content are the intellectual property
        of [Your Website Name] or our licensors, and are protected by copyright,
        trademark, and other intellectual property laws.
      </P>

      <H2>8. Termination</H2>
      <P>
        We reserve the right to suspend or terminate your access to the
        Services, with or without notice, if we believe you have violated these
        Terms or for any other reason at our sole discretion.
      </P>

      <H2>9. Disclaimer of Warranties</H2>
      <P>
        The Services are provided on an "as is" and "as available" basis,
        without warranties of any kind, either express or implied, including,
        but not limited to, warranties of merchantability, fitness for a
        particular purpose, or non-infringement. We do not warrant that the
        Services will be uninterrupted, error-free, or free from viruses or
        other harmful components.
      </P>

      <H2>10. Limitation of Liability</H2>
      <P>
        To the maximum extent permitted by law, in no event will Hive Mind Tales
        be liable for any direct, indirect, incidental, special, consequential,
        or punitive damages, including, but not limited to, loss of profits,
        data, or use, whether in an action in contract, tort, or otherwise,
        arising out of or in connection with your access to, use of, or
        inability to use the Services, even if we have been advised of the
        possibility of such damages.
      </P>

      <H2>11. Indemnification</H2>
      <P>
        You agree to indemnify, defend, and hold harmless Hive Mind Tales, its
        affiliates, and their respective officers, directors, employees, and
        agents from and against any and all claims, liabilities, damages,
        losses, or expenses, including reasonable attorneys' fees, arising out
        of or in connection with your access to, use of, or inability to use the
        Services, or any violation of these Terms.
      </P>

      <H2>12. Governing Law and Jurisdiction</H2>
      <P>
        These Terms are governed by and construed in accordance with the laws of
        the United Kingdom, without regard to its conflict of law principles.
        You agree to submit to the exclusive jurisdiction of the courts located
        in the United Kingdom to resolve any dispute arising out of or in
        connection with these Terms or your use of the Services.
      </P>

      <H2>13. Changes to These Terms</H2>
      <P>
        We reserve the right to modify or update these Terms at any time, with
        or without notice. Your continued use of the Services after any changes
        to these Terms constitutes your acceptance of the revised Terms. We
        recommend that you review these Terms periodically to stay informed
        about any changes or updates.
      </P>

      <H2>14. Contact Information</H2>
      <P>
        If you have any questions or concerns about these Terms or the Services,
        please contact us at sockthedev@gmail.com.
      </P>
    </NarrowContent>
  )
}
