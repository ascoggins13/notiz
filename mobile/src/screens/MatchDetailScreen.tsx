import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { api } from '../services/api';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'MatchDetail'>;

type MatchDetail = {
  id: string;
  status: string;
  venueId: string;
  otherUser: {
    displayName: string;
  };
  myPreference: string | null;
  theirPreference: string | null;
};

const options = [
  {
    value: 'approach_now',
    icon: '👋',
    label: 'Come say hi',
    copy: 'I’m comfortable meeting now.',
  },
  {
    value: 'between_sets',
    icon: '🏋️',
    label: 'Between sets',
    copy: 'Catch me during a break.',
  },
  {
    value: 'after_workout',
    icon: '✓',
    label: 'After my workout',
    copy: 'Let me finish first.',
  },
  {
    value: 'chat_first',
    icon: '💬',
    label: 'Chat first',
    copy: 'Let’s talk in Notiz first.',
  },
  {
    value: 'exchange_contact',
    icon: '📱',
    label: 'Exchange info',
    copy: 'Let’s connect privately.',
  },
  {
    value: 'meet_here',
    icon: '📍',
    label: 'Meet somewhere here',
    copy: 'Choose a spot at this location.',
  },
  {
    value: 'meet_later',
    icon: '📅',
    label: 'Meet another day',
    copy: 'Let’s plan something later.',
  },
] as const;

export function MatchDetailScreen({
  route,
  navigation,
}: Props) {  const [match, setMatch] = useState<MatchDetail | null>(null);
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(true);
const [showAfterWorkoutTimes, setShowAfterWorkoutTimes] = useState(false);

  const noteScale = useRef(new Animated.Value(0.78)).current;
  const noteOpacity = useRef(new Animated.Value(0)).current;
  const choicesOpacity = useRef(new Animated.Value(0)).current;
  const choicesTranslate = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    const loadMatch = async () => {
      try {
        const result = await api<MatchDetail>(
          `/api/matches/${route.params.matchId}`
        );

        setMatch(result);
        setSelected(result.myPreference ?? '');

        Animated.sequence([
          Animated.parallel([
            Animated.timing(noteOpacity, {
              toValue: 1,
              duration: 450,
              useNativeDriver: true,
            }),
            Animated.spring(noteScale, {
              toValue: 1,
              friction: 7,
              tension: 50,
              useNativeDriver: true,
            }),
          ]),

          Animated.delay(500),

          Animated.parallel([
            Animated.timing(choicesOpacity, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(choicesTranslate, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }),
          ]),
        ]).start();
      } catch (e) {
        Alert.alert(
          'Could not open Notiz',
          e instanceof Error ? e.message : 'Unknown error'
        );
      } finally {
        setLoading(false);
      }
    };

    loadMatch();
  }, [
    choicesOpacity,
    choicesTranslate,
    noteOpacity,
    noteScale,
    route.params.matchId,
  ]);

  const save = async (preference: string) => {
  if (preference === 'after_workout') {
  setShowAfterWorkoutTimes(true);
  return;
} 
 try {
      await api(`/api/matches/${route.params.matchId}/preference`, {
        method: 'POST',
        body: JSON.stringify({ preference }),
      });

      setSelected(preference);
	navigation.navigate('ConnectionReady', {
  matchId: route.params.matchId,
});
    } catch (e) {
      Alert.alert(
        'Could not save',
        e instanceof Error ? e.message : 'Unknown error'
      );
    }
  };
const chooseAfterWorkoutTime = async (minutes: number) => {
  try {
    await api(`/api/matches/${route.params.matchId}/preference`, {
      method: 'POST',
      body: JSON.stringify({
        preference: 'after_workout',
      }),
    });

    await api(`/api/matches/${route.params.matchId}/after-workout`, {
      method: 'POST',
      body: JSON.stringify({
        minutes,
      }),
    });

    setSelected('after_workout');

    navigation.navigate('ConnectionReady', {
      matchId: route.params.matchId,
    });
  } catch (e) {
    Alert.alert(
      'Could not save',
      e instanceof Error ? e.message : 'Unknown error'
    );
  }
};

  if (loading || !match) {
    return (
      <View style={styles.loadingPage}>
        <ActivityIndicator color="#5427A5" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.page}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Animated.View
          style={[
            styles.noteWrap,
            {
              opacity: noteOpacity,
              transform: [{ scale: noteScale }],
            },
          ]}
        >
          <View style={styles.note}>
            <View style={styles.redMargin} />

            <View style={styles.lineOne} />
            <View style={styles.lineTwo} />
            <View style={styles.lineThree} />
            <View style={styles.lineFour} />

            <Text style={styles.yes}>YES ♡</Text>

            <Text style={styles.hello}>
              Hi, I'm {match.otherUser.displayName}.
            </Text>

            <Text style={styles.noticed}>
              I noticed you too.
            </Text>

            <Text style={styles.signature}>— Notiz</Text>
          </View>
        </Animated.View>

        <Animated.View
          style={{
            opacity: choicesOpacity,
            transform: [{ translateY: choicesTranslate }],
          }}
        >
          <Text style={styles.mutual}>YOU NOTICED EACH OTHER</Text>

          <Text style={styles.question}>
            How would you like to connect?
          </Text>

          <Text style={styles.helper}>
            Choose what feels comfortable for you.
          </Text>

          <View style={styles.options}>
            {options.map((option) => {
              const active = selected === option.value;

              return (
                <Pressable
                  key={option.value}
                  style={[
                    styles.optionCard,
                    active && styles.optionActive,
                  ]}
                  onPress={() => save(option.value)}
                >
                  <View
                    style={[
                      styles.optionIcon,
                      active && styles.optionIconActive,
                    ]}
                  >
                    <Text style={styles.optionEmoji}>{option.icon}</Text>
                  </View>

                  <View style={styles.optionCopy}>
                    <Text
                      style={[
                        styles.optionLabel,
                        active && styles.optionLabelActive,
                      ]}
                    >
                      {option.label}
                    </Text>

                    <Text style={styles.optionDescription}>
                      {option.copy}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.radio,
                      active && styles.radioActive,
                    ]}
                  >
                    {active && <View style={styles.radioInner} />}
                  </View>
                </Pressable>
              );
            })}
          </View>
{showAfterWorkoutTimes && (
  <View style={styles.timePanel}>
    <Text style={styles.timeTitle}>
      About how much longer?
    </Text>

    <Text style={styles.timeCopy}>
      Give them a realistic estimate so they can decide whether waiting works for them.
    </Text>

    <View style={styles.timeOptions}>
      {[15, 30, 45, 60].map((minutes) => (
        <Pressable
          key={minutes}
          style={styles.timeButton}
          onPress={() => chooseAfterWorkoutTime(minutes)}
        >
          <Text style={styles.timeButtonText}>
            {minutes} min
          </Text>
        </Pressable>
      ))}
    </View>
  </View>
)}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#FAFAFC',
  },

  loadingPage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFAFC',
  },

  content: {
    padding: 24,
    paddingBottom: 50,
  },

  noteWrap: {
    alignItems: 'center',
    marginTop: 24,
  },

  note: {
    width: '92%',
    minHeight: 270,
    backgroundColor: '#FFFDF6',
    borderRadius: 4,
    paddingHorizontal: 32,
    paddingTop: 42,
    paddingBottom: 28,
    transform: [{ rotate: '-2deg' }],
    shadowColor: '#5427A5',
    shadowOpacity: 0.13,
    shadowRadius: 28,
    shadowOffset: {
      width: 0,
      height: 14,
    },
    borderWidth: 1,
    borderColor: '#EEE8DF',
    overflow: 'hidden',
  },

  redMargin: {
    position: 'absolute',
    left: 22,
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: '#E4A6AD',
  },

  lineOne: {
    position: 'absolute',
    top: 65,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#CFDBEF',
  },

  lineTwo: {
    position: 'absolute',
    top: 105,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#CFDBEF',
  },

  lineThree: {
    position: 'absolute',
    top: 145,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#CFDBEF',
  },

  lineFour: {
    position: 'absolute',
    top: 185,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#CFDBEF',
  },

  yes: {
    alignSelf: 'center',
    fontSize: 37,
    fontWeight: '900',
    fontStyle: 'italic',
    color: '#5427A5',
    transform: [{ rotate: '-3deg' }],
  },

  hello: {
    marginTop: 31,
    fontSize: 25,
    fontWeight: '700',
    fontStyle: 'italic',
    color: '#302D34',
    textAlign: 'center',
  },

  noticed: {
    marginTop: 12,
    fontSize: 23,
    fontStyle: 'italic',
    color: '#5427A5',
    textAlign: 'center',
  },

  signature: {
    marginTop: 28,
    fontSize: 14,
    fontStyle: 'italic',
    color: '#958E98',
    textAlign: 'right',
  },

  mutual: {
    marginTop: 45,
    color: '#5427A5',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
    textAlign: 'center',
  },

  question: {
    marginTop: 10,
    color: '#29272E',
    fontSize: 28,
    lineHeight: 35,
    fontWeight: '800',
    textAlign: 'center',
  },

  helper: {
    marginTop: 8,
    color: '#8B8690',
    fontSize: 14,
    textAlign: 'center',
  },

  options: {
    marginTop: 27,
    gap: 11,
  },

  optionCard: {
    minHeight: 78,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E5EB',
    flexDirection: 'row',
    alignItems: 'center',
  },

  optionActive: {
    borderColor: '#5427A5',
    backgroundColor: '#F1ECF8',
  },

  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#F1EEF4',
    alignItems: 'center',
    justifyContent: 'center',
  },

  optionIconActive: {
    backgroundColor: '#E4D9F4',
  },

  optionEmoji: {
    fontSize: 21,
  },

  optionCopy: {
    flex: 1,
    marginLeft: 13,
  },

  optionLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#37333B',
  },

  optionLabelActive: {
    color: '#5427A5',
  },

  optionDescription: {
    marginTop: 3,
    fontSize: 12,
    color: '#928D96',
  },

  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#C9C4CC',
    alignItems: 'center',
    justifyContent: 'center',
  },

  radioActive: {
    borderColor: '#5427A5',
  },

  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#5427A5',
  },
timePanel: {
  marginTop: 22,
  padding: 20,
  borderRadius: 22,
  backgroundColor: '#F1ECF8',
  borderWidth: 1,
  borderColor: '#DDD3EC',
},

timeTitle: {
  fontSize: 20,
  fontWeight: '800',
  color: '#302D34',
  textAlign: 'center',
},

timeCopy: {
  marginTop: 8,
  fontSize: 13,
  lineHeight: 19,
  color: '#85808A',
  textAlign: 'center',
},

timeOptions: {
  marginTop: 18,
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 10,
  justifyContent: 'center',
},

timeButton: {
  minWidth: 105,
  paddingVertical: 14,
  paddingHorizontal: 18,
  backgroundColor: '#FFFFFF',
  borderRadius: 16,
  borderWidth: 1,
  borderColor: '#D8CEE8',
  alignItems: 'center',
},

timeButtonText: {
  color: '#5427A5',
  fontSize: 15,
  fontWeight: '800',
},
});
