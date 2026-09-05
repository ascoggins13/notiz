import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'NotizSent'>;

export function NotizSentScreen({ route, navigation }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('ActiveVenue', route.params);
    }, 2200);

    return () => clearTimeout(timer);
  }, [navigation, route.params]);

  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.center}>
        <View style={styles.noteShadow}>
          <View style={styles.note}>
            <View style={styles.fold} />

            <View style={styles.line} />
            <View style={styles.line} />
            <View style={styles.lineShort} />

            <Text style={styles.logo}>Notiz</Text>
          </View>
        </View>

        <Text style={styles.title}>Your Notiz was sent.</Text>

        <Text style={styles.copy}>
          Keep doing your thing. We’ll let you know if they noticed you too.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#FAFAFC',
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 34,
  },

  noteShadow: {
    shadowColor: '#5427A5',
    shadowOpacity: 0.13,
    shadowRadius: 28,
    shadowOffset: {
      width: 0,
      height: 14,
    },
  },

  note: {
    width: 190,
    height: 145,
    backgroundColor: '#FFFEFA',
    borderRadius: 5,
    transform: [{ rotate: '-5deg' }],
    padding: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EEE9E2',
  },

  fold: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 46,
    height: 46,
    backgroundColor: '#EEEAF3',
  },

  line: {
    height: 1,
    backgroundColor: '#CFD9EB',
    marginTop: 20,
  },

  lineShort: {
    width: '65%',
    height: 1,
    backgroundColor: '#CFD9EB',
    marginTop: 20,
  },

  logo: {
    position: 'absolute',
    bottom: 18,
    right: 22,
    fontSize: 26,
    fontStyle: 'italic',
    fontWeight: '700',
    color: '#5427A5',
  },

  title: {
    marginTop: 48,
    fontSize: 28,
    fontWeight: '800',
    color: '#29272E',
    textAlign: 'center',
  },

  copy: {
    marginTop: 12,
    maxWidth: 330,
    fontSize: 15,
    lineHeight: 23,
    color: '#85808A',
    textAlign: 'center',
  },
});
