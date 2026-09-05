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
  'CommunityGuidelines'
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

export function CommunityGuidelinesScreen(_: Props) {
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
          Community Guidelines
        </Text>

        <Text style={styles.updated}>
          Last updated: September 3, 2026
        </Text>

        <Text style={styles.intro}>
          Notiz is built to make real-world introductions
          more comfortable, respectful, and intentional.
          These guidelines explain the behavior we expect
          from everyone using the app.
        </Text>

        <Section title="1. Mutual interest matters">
          A Notiz is an expression of interest, not permission
          to approach, pressure, follow, or contact someone
          outside the choices they make in the app.

          {'\n\n'}
          If interest is not mutual, respect that and move on.
        </Section>

        <Section title="2. No means no">
          If someone declines, does not respond, ends a
          connection, blocks you, or otherwise indicates that
          they do not want further interaction, do not attempt
          to continue the interaction through another account,
          another platform, or in person.
        </Section>

        <Section title="3. Do not follow or monitor people">
          Notiz is not a tracking tool. Do not use venue,
          appearance, timing, or other information from the app
          to follow, monitor, locate, or repeatedly approach
          another person.
        </Section>

        <Section title="4. Keep interactions respectful">
          Harassment, threats, intimidation, sexual pressure,
          abusive language, discriminatory behavior, unwanted
          explicit content, and other conduct that makes someone
          feel unsafe or targeted are not allowed.
        </Section>

        <Section title="5. Be honest">
          Do not impersonate another person, create deceptive
          profiles, misrepresent your identity, or intentionally
          submit false information to manipulate Notiz matching.
        </Section>

        <Section title="6. Respect personal boundaries">
          A mutual connection does not obligate anyone to talk,
          meet, exchange contact information, share personal
          details, or continue an interaction.

          {'\n\n'}
          Either person can change their mind at any time.
        </Section>

        <Section title="7. Use public judgment">
          When meeting or approaching someone you do not know,
          use appropriate judgment and remain aware of your
          surroundings. Keep first interactions in public spaces
          when possible and do not place yourself or another
          person in an unsafe situation.
        </Section>

        <Section title="8. Do not misuse reports or blocks">
          Blocking and reporting are safety tools. Do not abuse
          them to harass, retaliate against, threaten, or falsely
          target another user.
        </Section>

        <Section title="9. No illegal or exploitative use">
          Do not use Notiz to facilitate unlawful activity,
          exploitation, coercion, fraud, trafficking, or other
          harmful conduct.
        </Section>

        <Section title="10. We may take action">
          We may investigate reports and restrict, suspend, or
          remove accounts when we reasonably believe these
          Guidelines, our Terms of Service, applicable law, or
          the safety of users has been violated.
        </Section>

        <Section title="11. Use the safety tools">
          If an interaction makes you uncomfortable, you can
          block the user, submit a report, end the connection,
          or stop using the interaction features at any time.

          {'\n\n'}
          If you believe you are in immediate danger, contact
          local emergency services rather than relying on Notiz
          as an emergency-response service.
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

  intro: {
    marginTop: 24,
    color: '#625C67',
    fontSize: 15,
    lineHeight: 24,
    fontWeight: '600',
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
