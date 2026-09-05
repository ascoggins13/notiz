import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { createUserWithEmailAndPassword } from 'firebase/auth';
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

import { auth } from '../services/firebase';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'Register'
>;

export function RegisterScreen({
  navigation,
}: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] =
    useState('');
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const createAccount = async () => {
    const cleanEmail = email.trim();
  
    if (!cleanEmail) {
      Alert.alert(
        'Email required',
        'Enter an email address to continue.'
      );
      return;
    }
  
    if (password.length < 6) {
      Alert.alert(
        'Password too short',
        'Use at least 6 characters.'
      );
      return;
    }
  
    if (password !== confirmPassword) {
      Alert.alert(
        'Passwords do not match',
        'Enter the same password twice.'
      );
      return;
    }
  
    if (!agreedToTerms) {
      Alert.alert(
        'Agreement required',
        'Please agree to the Terms of Service, acknowledge the Privacy Policy, and confirm that you are at least 18 years old.'
      );
      return;
    }
  
    try {
      setLoading(true);
  
      await createUserWithEmailAndPassword(
        auth,
        cleanEmail,
        password
      );
  
      navigation.navigate('ProfileSetup');
    } catch (e) {
      Alert.alert(
        'Could not create account',
        e instanceof Error
          ? e.message
          : 'Unknown error'
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>
          CREATE YOUR NOTIZ
        </Text>

        <Text style={styles.title}>
          Let’s get you started.
        </Text>

        <Text style={styles.copy}>
          Your profile stays simple. Notiz only needs
          what helps people connect comfortably.
        </Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Email</Text>

        <TextInput
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="you@example.com"
          placeholderTextColor="#AAA6AF"
          style={styles.input}
        />

        <Text style={styles.label}>Password</Text>

        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="At least 6 characters"
          placeholderTextColor="#AAA6AF"
          style={styles.input}
        />

        <Text style={styles.label}>
          Confirm password
        </Text>

        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          placeholder="Enter it again"
          placeholderTextColor="#AAA6AF"
          style={styles.input}
        />
      </View>

      <View style={styles.bottom}>
  <Pressable
    style={styles.agreementRow}
    onPress={() =>
      setAgreedToTerms((current) => !current)
    }
  >
    <View
      style={[
        styles.checkbox,
        agreedToTerms && styles.checkboxSelected,
      ]}
    >
      {agreedToTerms && (
        <Text style={styles.checkmark}>
          ✓
        </Text>
      )}
    </View>

    <View style={styles.agreementCopy}>
  <Text style={styles.agreementText}>
    I agree to the{' '}
    <Text
      style={styles.agreementLink}
      onPress={() =>
        navigation.navigate('TermsOfService')
      }
    >
      Terms of Service
    </Text>
    {' '}and acknowledge the{' '}
    <Text
      style={styles.agreementLink}
      onPress={() =>
        navigation.navigate('PrivacyPolicy')
      }
    >
      Privacy Policy
    </Text>
    . I confirm that I am at least 18 years old.
  </Text>
</View>
  </Pressable>

  <Pressable
    style={[
      styles.primaryButton,
      loading && styles.disabled,
    ]}
    disabled={loading}
    onPress={createAccount}
  >
          <Text style={styles.primaryText}>
            {loading
              ? 'CREATING ACCOUNT...'
              : 'CONTINUE'}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate('SignIn')}
        >
          <Text style={styles.signIn}>
            Already have an account? Sign in
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#FAFAFC',
    padding: 26,
  },

  header: {
    paddingTop: 32,
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
    lineHeight: 39,
    fontWeight: '800',
    color: '#29272E',
  },

  copy: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 22,
    color: '#85808A',
  },

  form: {
    marginTop: 40,
    gap: 10,
  },

  label: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '800',
    color: '#57525D',
  },

  input: {
    height: 56,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E1E8',
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#29272E',
  },

  bottom: {
    marginTop: 'auto',
    gap: 18,
    paddingBottom: 20,
  },

  primaryButton: {
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

  signIn: {
    color: '#5427A5',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
  },
  agreementRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginTop: 8,
    marginBottom: 4,
  },
  
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#C9C4CC',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  
  checkboxSelected: {
    backgroundColor: '#5427A5',
    borderColor: '#5427A5',
  },
  
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
  
  agreementText: {
    flex: 1,
    color: '#77717B',
    fontSize: 12,
    lineHeight: 18,
  },
  agreementCopy: {
    flex: 1,
  },
  
  agreementLink: {
    color: '#5427A5',
    fontWeight: '800',
    textDecorationLine: 'underline',
  },

});
