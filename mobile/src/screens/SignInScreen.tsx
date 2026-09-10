import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Field } from '../components/Field';
import { PrimaryButton } from '../components/PrimaryButton';
import { auth } from '../services/firebase';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'SignIn'>;
export function SignInScreen({
  navigation,
}: Props) {
  const forgotPassword = async () => {
    const trimmedEmail = email.trim();
  
    if (!trimmedEmail) {
      Alert.alert(
        'Enter your email',
        'Enter your email address first, then tap Forgot password?'
      );
      return;
    }
  
    try {
      await sendPasswordResetEmail(
        auth,
        trimmedEmail
      );
  
      Alert.alert(
        'Check your email',
        'We sent you a password reset link.'
      );
    } catch (e) {
      Alert.alert(
        'Could not send reset email',
        e instanceof Error
          ? e.message
          : 'Unknown error'
      );
    }
  };

  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [loading, setLoading] = useState(false);
  const submit = async () => {
    try {
      setLoading(true);
  
      await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
    } catch (e) {
      Alert.alert(
        'Could not sign in',
        e instanceof Error
          ? e.message
          : 'Unknown error'
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={styles.page}>
      <Text style={styles.logo}>Notiz</Text>
  
      <Text style={styles.tagline}>
        Real connections begin with being noticed.
      </Text>
  
      <Field
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
  
      <Field
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

<Pressable
  onPress={forgotPassword}
  style={styles.forgotButton}
>
  <Text style={styles.forgotText}>
    Forgot password?
  </Text>
</Pressable>
  
      <PrimaryButton
        title="Sign in"
        loading={loading}
        onPress={submit}
      />
  
      <PrimaryButton
        title="Create account"
        disabled={loading}
        onPress={() =>
          navigation.navigate('Register')
        }
      />
    </View>
  );
  }

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },

  logo: {
    fontSize: 48,
    fontWeight: '800',
  },

  tagline: {
    fontSize: 18,
    marginBottom: 16,
  },

  forgotButton: {
    alignSelf: 'flex-end',
    marginTop: -6,
    marginBottom: 2,
  },

  forgotText: {
    color: '#5427A5',
    fontSize: 14,
    fontWeight: '700',
  },
});
