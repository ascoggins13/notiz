import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { signOut } from 'firebase/auth';
import React, { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { api } from '../services/api';
import { auth } from '../services/firebase';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'Profile'
>;

type Profile = {
  displayName?: string;
  birthYear?: number;
  gender?: string;
  interestedIn?: string[];
};

export function ProfileScreen({
  navigation,
}: Props) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      const loadProfile = async () => {
        try {
          const result = await api<Profile>(
            '/api/users/me'
          );

          if (active) {
            setProfile(result);
          }
        } catch (e) {
          if (active) {
            Alert.alert(
              'Could not load profile',
              e instanceof Error
                ? e.message
                : 'Unknown error'
            );
          }
        } finally {
          if (active) {
            setLoading(false);
          }
        }
      };

      loadProfile();

      return () => {
        active = false;
      };
    }, [])
  );

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      Alert.alert(
        'Could not sign out',
        e instanceof Error
          ? e.message
          : 'Unknown error'
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator />
      </View>
    );
  }

  const initial =
    profile?.displayName?.charAt(0).toUpperCase() ?? '?';

  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.back}>‹</Text>
        </Pressable>

        <Text style={styles.headerTitle}>Profile</Text>

        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.identity}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {initial}
          </Text>
        </View>

        <Text style={styles.name}>
          {profile?.displayName ?? 'Notiz User'}
        </Text>

        <Text style={styles.member}>
          Your Notiz profile
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Birth year</Text>
          <Text style={styles.value}>
            {profile?.birthYear ?? '—'}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.label}>Gender</Text>
          <Text style={styles.value}>
            {profile?.gender ?? '—'}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.label}>Interested in</Text>
          <Text style={styles.value}>
            {profile?.interestedIn?.join(', ') ?? '—'}
          </Text>
        </View>
      </View>

      <Pressable
        style={styles.editButton}
        onPress={() =>
          navigation.navigate('EditProfile')
        }
      >
        <Text style={styles.editText}>
          EDIT PROFILE
        </Text>
      </Pressable>

      <Pressable
  style={styles.settingsButton}
  onPress={() =>
    navigation.navigate('Settings')
  }
>
  <Text style={styles.settingsText}>
    SETTINGS
  </Text>
</Pressable>

      <Pressable
        style={styles.signOutButton}
        onPress={handleSignOut}
      >
        <Text style={styles.signOutText}>
          Sign out
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#FAFAFC',
    paddingHorizontal: 24,
  },

  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  header: {
    paddingTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  back: {
    fontSize: 38,
    color: '#5427A5',
  },

  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#29272E',
  },

  headerSpacer: {
    width: 24,
  },

  identity: {
    alignItems: 'center',
    marginTop: 42,
  },

  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#EEE8F8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#5427A5',
  },

  name: {
    marginTop: 16,
    fontSize: 27,
    fontWeight: '800',
    color: '#29272E',
  },

  member: {
    marginTop: 4,
    color: '#918C96',
    fontSize: 13,
  },

  card: {
    marginTop: 36,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E9E5EC',
    paddingHorizontal: 18,
  },

  row: {
    minHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  label: {
    color: '#77727C',
    fontSize: 14,
  },

  value: {
    color: '#29272E',
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'capitalize',
  },

  divider: {
    height: 1,
    backgroundColor: '#EFECF1',
  },

  editButton: {
    marginTop: 22,
    minHeight: 56,
    borderRadius: 18,
    backgroundColor: '#5427A5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  editText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 0.7,
  },

  signOutButton: {
    marginTop: 12,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },

  signOutText: {
    color: '#8A858F',
    fontSize: 14,
    fontWeight: '700',
  },
  settingsButton: {
    marginTop: 12,
    minHeight: 54,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E1E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  settingsText: {
    color: '#5427A5',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.7,
  },
});
