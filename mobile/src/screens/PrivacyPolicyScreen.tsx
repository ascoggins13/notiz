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
  'PrivacyPolicy'
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

export function PrivacyPolicyScreen(_: Props) {
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
          Privacy Policy
        </Text>

        <Text style={styles.updated}>
          Last updated: September 3, 2026
        </Text>

        <Section title="1. About Notiz">
  Notiz is designed to help people discover whether
  interest is mutual when they notice one another at
  participating or identifiable real-world locations.
  This Privacy Policy explains how information is
  collected, used, stored, and shared when you use
  Notiz.
</Section>

<Section title="2. Information You Provide">
  When you create and use a Notiz account, you may
  provide information including your display name,
  birth year, gender, interests, appearance
  descriptions, check-in information, communication
  preferences, messages, reports, and other
  information you choose to submit through the app.
</Section>

<Section title="3. Check-Ins and Venue Information">
  Notiz uses check-ins to determine which users are
  participating at the same venue or location. Your
  check-in may include the selected venue, areas or
  activities within that venue, appearance information,
  and the time your check-in is active.

  {'\n\n'}
  Notiz is designed around intentional check-ins and
  does not require continuous background location
  tracking for its core matching experience.
</Section>

<Section title="4. Appearance and Matching Information">
  Notiz allows users to describe themselves and a
  person they noticed using characteristics such as
  clothing, identifying features, venue area, activity,
  and other appearance information.

  {'\n\n'}
  We use this information to identify potential
  connections and determine whether two users may have
  noticed each other. A description submitted by
  another user may therefore relate to you even though
  you did not create that description yourself.
</Section>

<Section title="5. Connections and Messages">
  When interest becomes mutual, Notiz may create a
  connection between users. We process information
  about that connection, including communication
  preferences, readiness or meeting preferences,
  messages, unread-message information, and related
  activity needed to provide the connection experience.
</Section>

<Section title="6. Safety Information">
  If you block or report another user, we process
  information necessary to enforce that action.
  Reports may include the users involved, the related
  connection, the reason for the report, additional
  details you provide, and the time the report was
  submitted.

  {'\n\n'}
  We may retain information associated with reports or
  safety incidents when reasonably necessary to
  investigate abuse, enforce our rules, protect users,
  or comply with legal obligations.
</Section>

<Section title="7. Notifications">
  If you enable notifications, Notiz may store a push
  notification token associated with your account so
  we can send notifications about activity such as
  Notiz interactions, connections, and messages.
</Section>

<Section title="8. How We Use Information">
  We use information to operate Notiz, provide
  check-ins and matching, create mutual connections,
  enable communication, send requested notifications,
  maintain account functionality, prevent abuse,
  investigate reports, improve the service, and
  protect the security and integrity of Notiz.
</Section>

<Section title="9. Service Providers">
  Notiz uses third-party technology providers to
  operate the service. These providers may process
  information on our behalf for functions such as
  authentication, database storage, application
  infrastructure, and notifications.

  {'\n\n'}
  Our current infrastructure includes Firebase
  services provided by Google. Service providers
  process information subject to their applicable
  terms and privacy practices.
</Section>

<Section title="10. Sharing of Information">
  We do not make your private account information
  publicly available simply because you create a
  Notiz account.

  {'\n\n'}
  Information may be shared with another user when
  necessary to provide a Notiz interaction or mutual
  connection, with service providers operating on our
  behalf, when required by law, or when reasonably
  necessary to protect the rights, safety, and security
  of users, Notiz, or others.
</Section>

<Section title="11. Data Retention">
  We retain information for as long as reasonably
  necessary to provide Notiz, maintain the security
  and integrity of the service, resolve disputes,
  enforce our agreements, and satisfy applicable legal
  obligations.

  {'\n\n'}
  Different categories of information may have
  different retention periods. Certain safety,
  reporting, transactional, or legally required
  records may be retained after other account
  information is deleted.
</Section>

<Section title="12. Account Deletion">
  You can request permanent account deletion directly
  from the Notiz app through Settings. Deleting your
  account removes your active Notiz profile and
  authentication account and ends your active Notiz
  connections.

  {'\n\n'}
  Some limited information may remain where necessary
  for safety, fraud prevention, legal compliance, or
  because it forms part of another user's legitimate
  interaction history.
</Section>

<Section title="13. Your Choices">
  You can choose whether to check in, what optional
  information to provide, whether to enable
  notifications, and whether to communicate after a
  mutual connection. You can also block users, report
  safety concerns, manage blocked users, and delete
  your account through the app.
</Section>

<Section title="14. Age Requirement">
  Notiz is intended only for adults who are at least
  18 years old. We do not knowingly permit children
  under 18 to create Notiz accounts.
</Section>

<Section title="15. Security">
  We use reasonable administrative and technical
  measures intended to protect information. However,
  no electronic system or method of transmission can
  be guaranteed to be completely secure.
</Section>

<Section title="16. Changes to This Policy">
  We may update this Privacy Policy as Notiz evolves.
  When we make material changes, we may provide notice
  through the app or by other appropriate means and
  update the date shown at the top of this policy.
</Section>

<Section title="17. Contact">
  Questions about this Privacy Policy or privacy
  requests may be directed to Scoggins Technologies
  through the contact information provided by Notiz.
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
