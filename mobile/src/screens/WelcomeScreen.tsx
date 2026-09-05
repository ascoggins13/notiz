import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

const messages = [
  'Someone noticed you.',
  'Maybe you noticed them too.',
  'Now you’ll know.',
];

export function WelcomeScreen({ navigation }: Props) {
  const [step, setStep] = useState(0);

  const isLast = step === messages.length - 1;

  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.logoArea}>
        <View style={styles.note}>
          <Text style={styles.logo}>Notiz</Text>
        </View>
      </View>

      <View style={styles.messageArea}>
        <Text style={styles.message}>{messages[step]}</Text>
      </View>

      <View style={styles.actions}>
        {!isLast ? (
          <Pressable
            style={styles.primaryButton}
            onPress={() => setStep((current) => current + 1)}
          >
            <Text style={styles.primaryText}>Continue</Text>
          </Pressable>
        ) : (
          <>
            <Pressable
              style={styles.primaryButton}
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={styles.primaryText}>Get Started</Text>
            </Pressable>

            <Pressable
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('GuestHome')}
            >
              <Text style={styles.secondaryText}>Explore as Guest</Text>
            </Pressable>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#FAFAFC',
    paddingHorizontal: 28,
    justifyContent: 'space-between',
  },

  logoArea: {
    alignItems: 'center',
    paddingTop: 90,
  },

  note: {
    width: 150,
    height: 105,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '-3deg' }],
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
  },

  logo: {
    fontSize: 38,
    fontWeight: '700',
    fontStyle: 'italic',
    color: '#5427A5',
  },

  messageArea: {
    flex: 1,
    justifyContent: 'center',
  },

  message: {
    fontSize: 38,
    lineHeight: 46,
    fontWeight: '600',
    color: '#242329',
    textAlign: 'center',
  },

  actions: {
    gap: 12,
    paddingBottom: 40,
  },

  primaryButton: {
    backgroundColor: '#5427A5',
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: 'center',
  },

  primaryText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },

  secondaryButton: {
    paddingVertical: 17,
    alignItems: 'center',
  },

  secondaryText: {
    color: '#5427A5',
    fontSize: 16,
    fontWeight: '600',
  },
});
