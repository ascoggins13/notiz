import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { signOut } from 'firebase/auth';
import React from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { auth } from '../services/firebase';
import { RootStackParamList } from '../types';
import { api } from '../services/api';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'Settings'
>;

export function SettingsScreen({
  navigation,
}: Props) {
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      Alert.alert(
        'Could not sign out',
        e instanceof Error ? e.message : 'Unknown error'
      );
    }
  };

  return (
    <SafeAreaView style={styles.page}>
      <Text style={styles.eyebrow}>
        ACCOUNT & SAFETY
      </Text>

      <Text style={styles.title}>
        Settings
      </Text>

      <Text style={styles.copy}>
        Manage your Notiz account, privacy, and safety.
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Safety
        </Text>

        <SettingRow
  title="Privacy & Safety"
  subtitle="Blocked users, reporting, and safety controls."
  onPress={() =>
    navigation.navigate('PrivacySafety')
  }
/>

<SettingRow
  title="Community Guidelines"
  subtitle="How we keep Notiz respectful and comfortable."
  onPress={() =>
    navigation.navigate('CommunityGuidelines')
  }
/>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Legal
        </Text>

        <SettingRow
  title="Privacy Policy"
  subtitle="How Notiz handles your information."
  onPress={() =>
    navigation.navigate('PrivacyPolicy')
  }
/>

<SettingRow
  title="Terms of Service"
  subtitle="Rules for using Notiz."
  onPress={() =>
    navigation.navigate('TermsOfService')
  }
/>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Account
        </Text>

        <SettingRow
          title="Sign out"
          onPress={handleSignOut}
        />

<SettingRow
  title="Delete account"
  destructive
  onPress={() => {
    Alert.alert(
      'Delete your Notiz account?',
      'This permanently deletes your profile and ends your Notiz connections. This cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete account',
          style: 'destructive',
          onPress: async () => {
            try {
              await api('/api/users/me', {
                method: 'DELETE',
              });

              await signOut(auth);
            } catch (e) {
              Alert.alert(
                'Could not delete account',
                e instanceof Error
                  ? e.message
                  : 'Unknown error'
              );
            }
          },
        },
      ]
    );
  }}
/>
      </View>

      <View style={styles.about}>
        <Text style={styles.aboutTitle}>
          Notiz
        </Text>

        <Text style={styles.aboutCopy}>
          Real connections begin with being noticed.
        </Text>
      </View>
    </SafeAreaView>
  );
}

type SettingRowProps = {
  title: string;
  subtitle?: string;
  destructive?: boolean;
  onPress: () => void;
};

function SettingRow({
  title,
  subtitle,
  destructive = false,
  onPress,
}: SettingRowProps) {
  return (
    <Pressable
      style={styles.row}
      onPress={onPress}
    >
      <View style={styles.rowCopy}>
        <Text
          style={[
            styles.rowTitle,
            destructive &&
              styles.destructiveText,
          ]}
        >
          {title}
        </Text>

        {subtitle && (
          <Text style={styles.rowSubtitle}>
            {subtitle}
          </Text>
        )}
      </View>

      <Text
        style={[
          styles.arrow,
          destructive &&
            styles.destructiveText,
        ]}
      >
        ›
      </Text>
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
    marginTop: 7,
    color: '#29272E',
    fontSize: 32,
    fontWeight: '900',
  },

  copy: {
    marginTop: 8,
    color: '#89848E',
    fontSize: 14,
  },

  section: {
    marginTop: 28,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EAE6ED',
    overflow: 'hidden',
  },

  sectionTitle: {
    paddingHorizontal: 17,
    paddingTop: 15,
    paddingBottom: 5,
    color: '#8F8994',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  row: {
    minHeight: 65,
    paddingHorizontal: 17,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0EDF2',
  },

  rowCopy: {
    flex: 1,
  },

  rowTitle: {
    color: '#29272E',
    fontSize: 15,
    fontWeight: '700',
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

  destructiveText: {
    color: '#B54343',
  },

  about: {
    marginTop: 'auto',
    alignItems: 'center',
    paddingBottom: 28,
  },

  aboutTitle: {
    color: '#5427A5',
    fontSize: 16,
    fontWeight: '900',
  },

  aboutCopy: {
    marginTop: 4,
    color: '#A19CA5',
    fontSize: 11,
  },
});
