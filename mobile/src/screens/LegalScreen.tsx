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

type Props = NativeStackScreenProps<
  RootStackParamList,
  'Legal'
>;

export function LegalScreen({
  navigation,
}: Props) {
  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.content}>
        <Text style={styles.eyebrow}>
          NOTIZ
        </Text>

        <Text style={styles.title}>
          Legal
        </Text>

        <Text style={styles.copy}>
          Review how Notiz handles your information
          and the terms that apply when using the app.
        </Text>

        <View style={styles.list}>
          <Pressable
            style={styles.row}
            onPress={() =>
              navigation.navigate('PrivacyPolicy')
            }
          >
            <View>
              <Text style={styles.rowTitle}>
                Privacy Policy
              </Text>

              <Text style={styles.rowCopy}>
                How we collect, use, and protect information.
              </Text>
            </View>

            <Text style={styles.chevron}>
              ›
            </Text>
          </Pressable>

          <Pressable
            style={styles.row}
            onPress={() =>
              navigation.navigate('TermsOfService')
            }
          >
            <View>
              <Text style={styles.rowTitle}>
                Terms of Service
              </Text>

              <Text style={styles.rowCopy}>
                Rules and responsibilities for using Notiz.
              </Text>
            </View>

            <Text style={styles.chevron}>
              ›
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#FAFAFC',
  },

  content: {
    flex: 1,
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
    fontSize: 32,
    fontWeight: '900',
    color: '#29272E',
  },

  copy: {
    marginTop: 8,
    marginBottom: 28,
    fontSize: 14,
    lineHeight: 21,
    color: '#89848E',
  },

  list: {
    gap: 10,
  },

  row: {
    minHeight: 82,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: '#E8E4EB',
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  rowTitle: {
    color: '#29272E',
    fontSize: 15,
    fontWeight: '800',
  },

  rowCopy: {
    marginTop: 5,
    color: '#918C96',
    fontSize: 12,
  },

  chevron: {
    marginLeft: 12,
    color: '#5427A5',
    fontSize: 26,
    fontWeight: '400',
  },
});
