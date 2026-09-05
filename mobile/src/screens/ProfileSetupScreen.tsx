import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'ProfileSetup'
>;

export function ProfileSetupScreen({
  navigation,
}: Props) {
  const { refreshProfile } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [gender, setGender] = useState('');
  const [interestedIn, setInterestedIn] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleInterestedIn = (value: string) => {
    setInterestedIn((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    );
  };

  const save = async () => {
    const year = Number(birthYear);

    if (!displayName.trim()) {
      Alert.alert('Name required', 'Enter your first name.');
      return;
    }

    if (!Number.isInteger(year)) {
      Alert.alert('Birth year required', 'Enter a valid birth year.');
      return;
    }

    const age = new Date().getFullYear() - year;

    if (age < 18) {
      Alert.alert(
        'Notiz is for adults',
        'You must be at least 18 to use Notiz.'
      );
      return;
    }

    if (!gender) {
      Alert.alert('Gender required', 'Choose your gender.');
      return;
    }

    if (interestedIn.length === 0) {
      Alert.alert(
        'Choose who you’re interested in',
        'Select at least one option.'
      );
      return;
    }

    try {
      setLoading(true);

      await api('/api/users/me', {
        method: 'PUT',
        body: JSON.stringify({
          displayName: displayName.trim(),
          birthYear: year,
          gender,
          interestedIn,
          profileComplete: true,

          termsAcceptedAt: new Date().toISOString(),
          privacyAcceptedAt: new Date().toISOString(),
          termsVersion: '2026-09-03',
          privacyVersion: '2026-09-03',
        }),
      });

      await refreshProfile();

    } catch (e) {
      Alert.alert(
        'Could not save profile',
        e instanceof Error ? e.message : 'Unknown error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.page}>
      <Text style={styles.eyebrow}>YOUR PROFILE</Text>

      <Text style={styles.title}>
        A few details before you start.
      </Text>

      <Text style={styles.copy}>
        Notiz keeps profiles simple. These details help with matching and comfort.
      </Text>

      <View style={styles.section}>
        <Text style={styles.label}>First name</Text>

        <TextInput
          value={displayName}
          onChangeText={setDisplayName}
          placeholder="Aaron"
          placeholderTextColor="#AAA6AF"
          style={styles.input}
        />

        <Text style={styles.label}>Birth year</Text>

        <TextInput
          value={birthYear}
          onChangeText={setBirthYear}
          keyboardType="number-pad"
          placeholder="1983"
          placeholderTextColor="#AAA6AF"
          style={styles.input}
          maxLength={4}
        />

        <Text style={styles.label}>Gender</Text>

        <View style={styles.options}>
          {['man', 'woman', 'nonbinary'].map((item) => (
            <Pressable
              key={item}
              style={[
                styles.option,
                gender === item && styles.optionActive,
              ]}
              onPress={() => setGender(item)}
            >
              <Text
                style={[
                  styles.optionText,
                  gender === item && styles.optionTextActive,
                ]}
              >
                {item}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Interested in</Text>

        <View style={styles.options}>
          {['men', 'women', 'nonbinary'].map((item) => {
            const active = interestedIn.includes(item);

            return (
              <Pressable
                key={item}
                style={[
                  styles.option,
                  active && styles.optionActive,
                ]}
                onPress={() => toggleInterestedIn(item)}
              >
                <Text
                  style={[
                    styles.optionText,
                    active && styles.optionTextActive,
                  ]}
                >
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <Pressable
        style={[
          styles.primaryButton,
          loading && styles.disabled,
        ]}
        disabled={loading}
        onPress={save}
      >
        <Text style={styles.primaryText}>
          {loading ? 'SAVING...' : 'FINISH SETUP'}
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#FAFAFC',
    padding: 26,
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
    fontSize: 31,
    lineHeight: 38,
    fontWeight: '800',
    color: '#29272E',
  },

  copy: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 22,
    color: '#85808A',
  },

  section: {
    marginTop: 30,
    gap: 12,
  },

  label: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '800',
    color: '#57525D',
  },

  input: {
    height: 54,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E1E8',
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#29272E',
  },

  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  option: {
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#DED9E3',
    backgroundColor: '#FFFFFF',
  },

  optionActive: {
    backgroundColor: '#EEE8F8',
    borderColor: '#5427A5',
  },

  optionText: {
    color: '#6B6670',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'capitalize',
  },

  optionTextActive: {
    color: '#5427A5',
  },

  primaryButton: {
    marginTop: 'auto',
    minHeight: 58,
    borderRadius: 18,
    backgroundColor: '#5427A5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  disabled: {
    opacity: 0.55,
  },

  primaryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.7,
  },
});
