import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'PrivacySafety'
>;

export function PrivacySafetyScreen({
  navigation,
}: Props) {
  return (
    <SafeAreaView style={styles.page}>
      <Text style={styles.eyebrow}>
        PRIVACY & SAFETY
      </Text>

      <Text style={styles.title}>
        Stay comfortable.
      </Text>

      <Text style={styles.copy}>
        You control who can interact with you on Notiz.
      </Text>

      <View style={styles.card}>
      <SafetyRow
  title="Blocked users"
  subtitle="View and manage people you've blocked."
  onPress={() =>
    navigation.navigate('BlockedUsers')
  }
/>

        <SafetyRow
          title="Reporting"
          subtitle="Learn what happens when you report someone."
          onPress={() =>
            Alert.alert(
              'Reporting',
              'Reports help us respond to behavior that violates Notiz guidelines.'
            )
          }
        />
      </View>

      <View style={styles.safetyCard}>
        <Text style={styles.safetyTitle}>
          In-person safety
        </Text>

        <Text style={styles.safetyText}>
          A mutual Notiz means both people expressed interest.
          It does not create an obligation to meet, talk, share
          contact information, or continue an interaction.
        </Text>

        <Text style={styles.safetyText}>
          You can change your mind at any time. Keep first
          interactions in public spaces and use Notiz's block
          and report tools whenever you need them.
        </Text>
      </View>

      <Pressable
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backText}>
          DONE
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}

type SafetyRowProps = {
  title: string;
  subtitle: string;
  onPress: () => void;
};

function SafetyRow({
  title,
  subtitle,
  onPress,
}: SafetyRowProps) {
  return (
    <Pressable
      style={styles.row}
      onPress={onPress}
    >
      <View style={styles.rowCopy}>
        <Text style={styles.rowTitle}>
          {title}
        </Text>

        <Text style={styles.rowSubtitle}>
          {subtitle}
        </Text>
      </View>

      <Text style={styles.arrow}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#FAFAFC',
    paddingHorizontal: 24,
  },

  eyebrow: {
    marginTop: 20,
    color: '#5427A5',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.3,
  },

  title: {
    marginTop: 8,
    color: '#29272E',
    fontSize: 32,
    fontWeight: '900',
  },

  copy: {
    marginTop: 8,
    color: '#89848E',
    fontSize: 14,
    lineHeight: 21,
  },

  card: {
    marginTop: 28,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EAE6ED',
    overflow: 'hidden',
  },

  row: {
    minHeight: 72,
    paddingHorizontal: 17,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F0EDF2',
  },

  rowCopy: {
    flex: 1,
  },

  rowTitle: {
    color: '#29272E',
    fontSize: 15,
    fontWeight: '800',
  },

  rowSubtitle: {
    marginTop: 4,
    color: '#918C96',
    fontSize: 12,
    lineHeight: 17,
  },

  arrow: {
    marginLeft: 12,
    color: '#AAA5AE',
    fontSize: 26,
  },

  safetyCard: {
    marginTop: 20,
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#EEE8F8',
  },

  safetyTitle: {
    color: '#5427A5',
    fontSize: 16,
    fontWeight: '900',
  },

  safetyText: {
    marginTop: 10,
    color: '#625A6C',
    fontSize: 13,
    lineHeight: 20,
  },

  backButton: {
    marginTop: 'auto',
    marginBottom: 24,
    minHeight: 56,
    borderRadius: 18,
    backgroundColor: '#5427A5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  backText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
});
