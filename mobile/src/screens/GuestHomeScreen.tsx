import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'GuestHome'>;

export function GuestHomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.logo}>Notiz</Text>
        <Text style={styles.guest}>Guest</Text>
      </View>

      <View style={styles.center}>
        <Text style={styles.title}>Ready when you notice someone.</Text>

        <Text style={styles.copy}>
          Check into a place, describe yourself, and privately connect
          if you both noticed each other.
        </Text>

        <Pressable
          style={styles.checkInButton}
          onPress={() => navigation.navigate('SignIn')}
        >
          <Text style={styles.checkInText}>CHECK IN</Text>
        </Pressable>

        <Text style={styles.note}>
          Create an account when you're ready to participate.
        </Text>
      </View>

      <Pressable onPress={() => navigation.navigate('SignIn')}>
        <Text style={styles.signIn}>Sign in or create account</Text>
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

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  logo: {
    fontSize: 28,
    fontWeight: '800',
    color: '#5427A5',
  },

  guest: {
    fontSize: 14,
    color: '#85828C',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    fontSize: 30,
    lineHeight: 37,
    fontWeight: '700',
    color: '#25242A',
    textAlign: 'center',
    maxWidth: 330,
  },

  copy: {
    marginTop: 16,
    fontSize: 16,
    lineHeight: 24,
    color: '#737079',
    textAlign: 'center',
    maxWidth: 330,
  },

  checkInButton: {
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: '#5427A5',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    shadowColor: '#5427A5',
    shadowOpacity: 0.18,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
  },

  checkInText: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '800',
    letterSpacing: 1,
  },

  note: {
    marginTop: 22,
    color: '#96929C',
    fontSize: 13,
  },

  signIn: {
    textAlign: 'center',
    paddingVertical: 18,
    color: '#5427A5',
    fontWeight: '600',
  },
});
