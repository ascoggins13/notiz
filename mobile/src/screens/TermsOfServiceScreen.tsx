import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';

import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'TermsOfService'
>;
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Text style={styles.sectionTitle}>
        {title}
      </Text>

      <Text style={styles.body}>
        {children}
      </Text>
    </>
  );
}

export function TermsOfServiceScreen(_: Props) {
  return (
    <SafeAreaView style={styles.page}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.eyebrow}>
          NOTIZ
        </Text>

        <Text style={styles.title}>
          Terms of Service
        </Text>

        <Text style={styles.updated}>
          Last updated: September 3, 2026
        </Text>

        <Section title="1. Acceptance of Terms">
  These Terms of Service govern your use of Notiz,
  a service provided by Scoggins Technologies. By
  creating an account or using Notiz, you agree to
  these Terms and our Privacy Policy.
</Section>

<Section title="2. Eligibility">
  You must be at least 18 years old to create an
  account or use Notiz. By using Notiz, you represent
  that you meet this age requirement and are legally
  able to agree to these Terms.
</Section>

<Section title="3. What Notiz Does">
  Notiz helps people discover whether interest may be
  mutual when they notice one another at real-world
  locations. Users can check in, provide appearance
  and venue information, send a Notiz, establish a
  mutual connection, select communication preferences,
  and communicate when the available features permit.

  {'\n\n'}
  Notiz facilitates introductions. We do not guarantee
  that another user will respond, that a description
  will identify the intended person, that interest
  will be mutual, or that any interaction will result
  in a relationship or meeting.
</Section>

<Section title="4. Your Account">
  You are responsible for the activity associated with
  your account and for providing accurate information
  when using Notiz. You may not impersonate another
  person, create an account for someone else without
  authorization, or use another person's account.

  {'\n\n'}
  You are responsible for maintaining the security of
  your account credentials and should notify us if you
  believe your account has been accessed without
  authorization.
</Section>

<Section title="5. Respectful Use">
  Notiz is designed to make introductions more
  comfortable, not to create a new way to pressure,
  follow, monitor, or harass people.

  {'\n\n'}
  You must respect another person's decision not to
  respond, connect, communicate, meet, or continue an
  interaction. A Notiz, match, message, or other
  interaction does not create an obligation for
  another person to engage with you.
</Section>

<Section title="6. Prohibited Conduct">
  You may not use Notiz to harass, threaten, stalk,
  intimidate, exploit, deceive, impersonate, or harm
  another person; send abusive or unlawful content;
  create fraudulent or spam accounts; interfere with
  the operation or security of the service; attempt
  unauthorized access to accounts or systems; or use
  Notiz for unlawful purposes.

  {'\n\n'}
  You also may not use information obtained through
  Notiz to track another person outside the intended
  connection experience or circumvent another user's
  block or other safety choice.
</Section>

<Section title="7. Real-World Interactions">
  You are responsible for your decisions and conduct
  when interacting with other users, including whether
  to approach, communicate with, meet, or share
  information with another person.

  {'\n\n'}
  Notiz does not conduct or guarantee comprehensive
  identity, criminal-history, or background
  verification of users unless we expressly state
  otherwise. Use appropriate judgment when interacting
  with people you do not know.
</Section>

<Section title="8. User Content">
  You may provide information or content through
  Notiz, including profile information, appearance
  descriptions, messages, reports, and other
  submissions.

  {'\n\n'}
  You remain responsible for the content you submit.
  You may not submit content that violates another
  person's rights or applicable law.

  {'\n\n'}
  You grant Notiz the limited rights necessary to
  host, process, transmit, display, and otherwise use
  your submissions for operating, securing, and
  improving the service.
</Section>

<Section title="9. Blocking and Reporting">
  Notiz provides safety controls that may allow users
  to block and report other users. Blocking may end
  an existing connection and prevent further
  interactions through that connection.

  {'\n\n'}
  We may review reports and take action when we
  reasonably believe these Terms, our Community
  Guidelines, applicable law, or the safety of users
  has been violated.
</Section>

<Section title="10. Suspension and Termination">
  We may restrict, suspend, or terminate access to
  Notiz when reasonably necessary to protect users,
  investigate abuse, enforce these Terms, comply with
  legal requirements, protect the service, or address
  conduct that creates risk to Notiz or others.

  {'\n\n'}
  You may stop using Notiz at any time and may delete
  your account through the account settings available
  in the app.
</Section>

<Section title="11. Privacy">
  Our Privacy Policy explains how information is
  collected, used, stored, and shared in connection
  with Notiz. By using the service, you acknowledge
  the data practices described in that policy.
</Section>

<Section title="12. Ownership of Notiz">
  Notiz, including its software, branding, interface,
  design, features, and other proprietary materials,
  is owned by Scoggins Technologies or its licensors
  and is protected by applicable intellectual property
  laws.

  {'\n\n'}
  These Terms do not grant you ownership of Notiz or
  permission to copy, modify, distribute, sell, or
  exploit our proprietary technology except as
  expressly permitted by law or by us.
</Section>

<Section title="13. Service Availability">
  We may modify, improve, suspend, or discontinue
  features of Notiz as the service evolves. We do not
  guarantee that every feature will always be
  available, uninterrupted, or error-free.
</Section>

<Section title="14. Disclaimer">
  To the extent permitted by applicable law, Notiz is
  provided on an "as is" and "as available" basis.
  We do not guarantee matches, compatibility,
  responses, meetings, relationships, user identity,
  or the conduct of other users.
</Section>

<Section title="15. Limitation of Liability">
  To the extent permitted by applicable law, Scoggins
  Technologies will not be responsible for indirect,
  incidental, special, consequential, or punitive
  damages arising from your use of Notiz or your
  interactions with other users.

  {'\n\n'}
  Nothing in these Terms excludes or limits liability
  that cannot legally be excluded or limited.
</Section>

<Section title="16. Changes to These Terms">
  We may update these Terms as Notiz evolves. If we
  make material changes, we may provide notice through
  the app or by other appropriate means. Continued use
  of Notiz after updated Terms become effective may
  constitute acceptance where permitted by law.
</Section>

<Section title="17. Contact">
  Questions about these Terms may be directed to
  Scoggins Technologies through the contact
  information provided by Notiz.
</Section>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#FAFAFC',
  },

  content: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 50,
  },

  eyebrow: {
    color: '#5427A5',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.3,
  },

  title: {
    marginTop: 8,
    fontSize: 32,
    fontWeight: '900',
    color: '#29272E',
  },

  updated: {
    marginTop: 8,
    color: '#98929C',
    fontSize: 12,
  },

  sectionTitle: {
    marginTop: 28,
    color: '#29272E',
    fontSize: 17,
    fontWeight: '900',
  },
  
  body: {
    marginTop: 8,
    color: '#4F4A54',
    fontSize: 14,
    lineHeight: 23,
  },
});
