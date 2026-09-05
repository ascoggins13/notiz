import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { api } from '../services/api';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'EditProfile'
>;

type Profile = {
  displayName?: string;
  birthYear?: number;
  gender?: string;
  interestedIn?: string[];
};

export function EditProfileScreen({
  navigation,
}: Props) {
  const [displayName, setDisplayName] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [gender, setGender] = useState('');
  const [interestedIn, setInterestedIn] =
    useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      const load = async () => {
        try {
          const profile = await api<Profile>(
            '/api/users/me'
          );

          if (!active) return;

          setDisplayName(profile.displayName ?? '');
          setBirthYear(
            profile.birthYear
              ? String(profile.birthYear)
              : ''
          );
          setGender(profile.gender ?? '');
          setInterestedIn(
            profile.interestedIn ?? []
          );
        } catch (e) {
          Alert.alert(
            'Could not load profile',
            e instanceof Error
              ? e.message
              : 'Unknown error'
          );
        } finally {
          if (active) {
            setLoading(false);
          }
        }
      };

      load();

      return () => {
        active = false;
      };
    }, [])
  );

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
      Alert.alert(
        'Name required',
        'Enter your first name.'
      );
      return;
    }

    if (!Number.isInteger(year)) {
      Alert.alert(
        'Birth year required',
        'Enter a valid birth year.'
      );
      return;
    }

    if (new Date().getFullYear() - year < 18) {
      Alert.alert(
        'Notiz is for adults',
        'You must be at least 18 to use Notiz.'
      );
      return;
    }

    if (!gender) {
      Alert.alert(
        'Gender required',
        'Choose your gender.'
      );
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
      setSaving(true);

      await api('/api/users/me', {
        method: 'PUT',
        body: JSON.stringify({
          displayName: displayName.trim(),
          birthYear: year,
          gender,
          interestedIn,
          profileComplete: true,
        }),
      });

      navigation.goBack();
    } catch (e) {
      Alert.alert(
        'Could not save changes',
        e instanceof Error
          ? e.message
          : 'Unknown error'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color="#5427A5" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.page}>
      <Text style={styles.eyebrow}>
        EDIT PROFILE
      </Text>

      <Text style={styles.title}>
        Keep your details current.
      </Text>

      <View style={styles.section}>
        <Text style={styles.label}>
          First name
        </Text>

        <TextInput
          value={displayName}
          onChangeText={setDisplayName}
          style={styles.input}
        />

        <Text style={styles.label}>
          Birth year
        </Text>

        <TextInput
          value={birthYear}
          onChangeText={setBirthYear}
          keyboardType="number-pad"
          maxLength={4}
          style={styles.input}
        />

        <Text style={styles.label}>
          Gender
        </Text>

        <View style={styles.options}>
          {['man', 'woman', 'nonbinary'].map(
            (item) => (
              <Pressable
                key={item}
                style={[
                  styles.option,
                  gender === item &&
                    styles.optionActive,
                ]}
                onPress={() => setGender(item)}
              >
                <Text
                  style={[
                    styles.optionText,
                    gender === item &&
                      styles.optionTextActive,
                  ]}
                >
                  {item}
                </Text>
              </Pressable>
            )
          )}
        </View>

        <Text style={styles.label}>
          Interested in
        </Text>

        <View style={styles.options}>
          {['men', 'women', 'nonbinary'].map(
            (item) => {
              const active =
                interestedIn.includes(item);

              return (
                <Pressable
                  key={item}
                  style={[
                    styles.option,
                    active &&
                      styles.optionActive,
                  ]}
                  onPress={() =>
                    toggleInterestedIn(item)
                  }
                >
                  <Text
                    style={[
                      styles.optionText,
                      active &&
                        styles.optionTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              );
            }
          )}
        </View>
      </View>

      <Pressable
        style={[
          styles.primaryButton,
          saving && styles.disabled,
        ]}
        disabled={saving}
        onPress={save}
      >
        <Text style={styles.primaryText}>
          {saving ? 'SAVING...' : 'SAVE CHANGES'}
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

  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFAFC',
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
