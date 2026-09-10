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
  View,
} from 'react-native';

import { api } from '../services/api';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'ConnectionReady'
>;

const counterProposalLabels: Record<
  string,
  { icon: string; label: string }
> = {
  approach_now: {
    icon: '👋',
    label: 'Come say hi',
  },
  chat_first: {
    icon: '💬',
    label: 'Chat first',
  },
  have_a_drink: {
    icon: '🥂',
    label: 'Have a drink with me',
  },
  exchange_contact: {
    icon: '📱',
    label: 'Exchange info',
  },
  meet_later: {
    icon: '📅',
    label: 'Meet another day',
  },
};

const agreedLabels: Record<string, string> = {
  approach_now: 'Come say hi',
  chat_first: 'Chat first',
  exchange_contact: 'Exchange info',
  meet_later: 'Meet another day',
  have_a_drink: 'Have a drink with me',
};

type MatchDetail = {
  id: string;
  status: string;
  myUserId: string;
  otherUser: {
    displayName: string;
  };
  myPreference: string | null;
  theirPreference: string | null;
myReady: boolean;
  theirReady: boolean;
myMeetingLocation: string | null;
  theirMeetingLocation: string | null;
myAfterWorkout: {
  minutes: number;
  estimatedReadyAt: string;
  acceptedByOther: boolean;
} | null;

theirAfterWorkout: {
  minutes: number;
  estimatedReadyAt: string;
  acceptedByOther: boolean;
} | null;
counterProposal: {
  fromUserId: string;
  preference: string;
  status: 'pending' | 'accepted' | 'declined';
  respondedBy?: string;
} | null;	
};

const preferenceContent: Record<
  string,
  {
    icon: string;
    title: (name: string) => string;
    copy: string;
  }
> = {
  approach_now: {
    icon: '👋',
    title: (name) => `${name} is ready to say hi.`,
    copy: 'You can approach them now.',
  },

  between_sets: {
    icon: '🏋️',
    title: (name) => `${name} is okay with you saying hi between sets.`,
    copy: 'Give them space while they are actively working out.',
  },

  after_workout: {
    icon: '✓',
    title: (name) => `${name} would rather meet after the workout.`,
    copy: 'Keep doing your thing for now. You can connect when they are finished.',
  },

  chat_first: {
    icon: '💬',
    title: (name) => `${name} would like to chat first.`,
    copy: 'Start with a private conversation in Notiz.',
  },

  have_a_drink: {
    icon: '🥂',
    title: (name) => `${name} would like to have a drink with you.`,
    copy: 'Meet them at the bar and say hi.',
  },

  exchange_contact: {
    icon: '📱',
    title: (name) => `${name} would rather exchange contact info.`,
    copy: 'Share only what you are comfortable sharing.',
  },

  meet_here: {
    icon: '📍',
    title: (name) => `${name} wants to meet somewhere here.`,
    copy: 'Choose a comfortable public meeting spot.',
  },

  meet_later: {
    icon: '📅',
    title: (name) => `${name} would rather meet another day.`,
    copy: 'You can choose a time that works for both of you.',
  },
};

export function ConnectionReadyScreen({
  route,
  navigation,
}: Props) {
  const [match, setMatch] = useState<MatchDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAlternatives, setShowAlternatives] = useState(false);	

useFocusEffect(
  useCallback(() => {
    let active = true;
    let firstLoad = true;

    const load = async () => {
      try {
        const result = await api<MatchDetail>(
          `/api/matches/${route.params.matchId}`
        );

        if (active) {
          setMatch(result);
        }
      } catch (e) {
        if (firstLoad) {
          Alert.alert(
            'Could not load connection',
            e instanceof Error ? e.message : 'Unknown error'
          );
        }
      } finally {
        if (active && firstLoad) {
          setLoading(false);
        }

        firstLoad = false;
      }
    };

    load();

    const interval = setInterval(load, 30000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [route.params.matchId])
);

const markReady = async () => {
  try {
    await api(`/api/matches/${route.params.matchId}/ready`, {
      method: 'POST',
      body: JSON.stringify({
        ready: true,
      }),
    });
  } catch (e) {
    Alert.alert(
      'Could not update',
      e instanceof Error ? e.message : 'Unknown error'
    );
  }
};

const chooseMeetingLocation = async (location: string) => {
  try {
    await api(
      `/api/matches/${route.params.matchId}/meeting-location`,
      {
        method: 'POST',
        body: JSON.stringify({
          location,
        }),
      }
    );
  } catch (e) {
    Alert.alert(
      'Could not save meeting spot',
      e instanceof Error ? e.message : 'Unknown error'
    );
  }
};

const acceptAfterWorkout = async () => {
  try {
    await api(
      `/api/matches/${route.params.matchId}/after-workout/accept`,
      {
        method: 'POST',
        body: JSON.stringify({}),
      }
    );
  } catch (e) {
    Alert.alert(
      'Could not accept',
      e instanceof Error ? e.message : 'Unknown error'
    );
  }
};
const sendCounterProposal = async (preference: string) => {
  try {
    await api(
      `/api/matches/${route.params.matchId}/counter-proposal`,
      {
        method: 'POST',
        body: JSON.stringify({
          preference,
        }),
      }
    );

    setShowAlternatives(false);
  } catch (e) {
    Alert.alert(
      'Could not send suggestion',
      e instanceof Error ? e.message : 'Unknown error'
    );
  }
};

const respondToCounterProposal = async (
  response: 'accepted' | 'declined'
) => {
  try {
    await api(
      `/api/matches/${route.params.matchId}/counter-proposal/respond`,
      {
        method: 'POST',
        body: JSON.stringify({
          response,
        }),
      }
    );
  } catch (e) {
    Alert.alert(
      'Could not respond',
      e instanceof Error ? e.message : 'Unknown error'
    );
  }
};

  if (loading || !match) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color="#5427A5" />
      </View>
    );
  }

  if (!match.theirPreference) {
    return (
      <SafeAreaView style={styles.page}>
        <View style={styles.center}>
          <View style={styles.waitIcon}>
            <Text style={styles.waitEmoji}>📝</Text>
          </View>

          <Text style={styles.title}>
            Waiting for {match.otherUser.displayName}
          </Text>

          <Text style={styles.copy}>
            They’re choosing how they’d like to connect.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const content =
    preferenceContent[match.theirPreference];

  if (!content) {
    return (
      <SafeAreaView style={styles.page}>
        <View style={styles.center}>
          <Text style={styles.title}>You connected.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.top}>
        <Text style={styles.eyebrow}>YOUR NOTIZ WAS ANSWERED</Text>
      </View>

      <View style={styles.center}>
        <View style={styles.iconCircle}>
          <Text style={styles.icon}>{content.icon}</Text>
        </View>

        <Text style={styles.title}>
          {content.title(match.otherUser.displayName)}
        </Text>

        <Text style={styles.copy}>{content.copy}</Text>
      </View>

<View style={styles.bottom}>
{match.counterProposal &&
  match.counterProposal.status === 'accepted' && (
    <View style={styles.agreedCard}>
      <Text style={styles.agreedEyebrow}>
        YOU AGREED
      </Text>

      <Text style={styles.agreedTitle}>
        {
          agreedLabels[
            match.counterProposal.preference
          ]
        }
      </Text>

      <Text style={styles.agreedCopy}>
        You both agreed on how to connect.
      </Text>

      {match.counterProposal.preference === 'chat_first' && (
<Pressable
  style={styles.primaryButton}
  onPress={() =>
    navigation.navigate('Chat', {
      matchId: route.params.matchId,
    })
  }
>
  <Text style={styles.primaryText}>OPEN CHAT</Text>
</Pressable>	
      )}

      {match.counterProposal.preference === 'approach_now' && (
        <Text style={styles.doneText}>
          Notiz has done its job. Go say hi when you're ready.
        </Text>
      )}

      {match.counterProposal.preference === 'exchange_contact' && (
        <Pressable style={styles.primaryButton}>
          <Text style={styles.primaryText}>
            EXCHANGE INFO
          </Text>
        </Pressable>
      )}



      {match.counterProposal.preference === 'meet_later' && (
        <Pressable style={styles.primaryButton}>
          <Text style={styles.primaryText}>
            PLAN A TIME
          </Text>
        </Pressable>
      )}
    </View>
  )}
  {match.counterProposal &&
  match.counterProposal.status === 'pending' &&
  match.counterProposal.fromUserId === match.myUserId && (
    <View style={styles.actionBox}>
      <Text style={styles.actionTitle}>
        Suggestion sent.
      </Text>

      <Text style={styles.actionCopy}>
        Waiting for {match.otherUser.displayName} to respond.
      </Text>
    </View>
  )}

{match.counterProposal &&
  match.counterProposal.status === 'pending' &&
  match.counterProposal.fromUserId !== match.myUserId && (
    <View style={styles.counterCard}>
      <Text style={styles.counterEyebrow}>
        ANOTHER IDEA
      </Text>

      <Text style={styles.actionTitle}>
        {match.otherUser.displayName} suggested another way.
      </Text>

      <View style={styles.counterChoice}>
        <Text style={styles.counterIcon}>
          {
            counterProposalLabels[
              match.counterProposal.preference
            ]?.icon
          }
        </Text>

        <Text style={styles.counterLabel}>
          {
            counterProposalLabels[
              match.counterProposal.preference
            ]?.label
          }
        </Text>
      </View>

      <Pressable
        style={styles.acceptButton}
        onPress={() =>
          respondToCounterProposal('accepted')
        }
      >
        <Text style={styles.acceptButtonText}>
          SOUNDS GOOD
        </Text>
      </Pressable>

      <Pressable
        style={styles.alternativeButton}
        onPress={() =>
          respondToCounterProposal('declined')
        }
      >
        <Text style={styles.alternativeButtonText}>
          CHOOSE SOMETHING ELSE
        </Text>
      </Pressable>
    </View>
  )}  

  {match.counterProposal?.status !== 'accepted' &&
  match.theirPreference === 'after_workout' && (
    <View style={styles.actionBox}>
      {!match.theirAfterWorkout ? (
        <>
          <Text style={styles.actionTitle}>
            {match.otherUser.displayName} is choosing a time.
          </Text>

          <Text style={styles.actionCopy}>
            We’ll update you when they’re ready.
          </Text>
        </>
      ) : !match.theirAfterWorkout.acceptedByOther ? (
        <>
          <Text style={styles.actionTitle}>
            {match.otherUser.displayName} would like to connect in about{' '}
            {match.theirAfterWorkout.minutes} minutes.
          </Text>
      
          <Text style={styles.actionCopy}>
            Does that timing work for you?
          </Text>
      
          <Pressable
            style={styles.acceptButton}
            onPress={acceptAfterWorkout}
          >
            <Text style={styles.acceptButtonText}>
              SOUNDS GOOD
            </Text>
          </Pressable>
      
          <Pressable
            style={styles.alternativeButton}
            onPress={() => setShowAlternatives(true)}
          >
            <Text style={styles.alternativeButtonText}>
              SUGGEST ANOTHER WAY
            </Text>
          </Pressable>
      
          {showAlternatives && (
            <View style={styles.alternativeOptions}>
              {[
  ['approach_now', '👋', 'Come say hi'],
  ['chat_first', '💬', 'Chat first'],
  ['have_a_drink', '🥂', 'Have a drink with me'],
].map(([value, icon, label]) => (
                <Pressable
                  key={value}
                  style={styles.alternativeOption}
                  onPress={() => sendCounterProposal(value)}
                >
                  <Text style={styles.alternativeIcon}>
                    {icon}
                  </Text>
      
                  <Text style={styles.alternativeLabel}>
                    {label}
                  </Text>
      
                  <Text style={styles.alternativeArrow}>
                    ›
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        </>
      ) : !match.theirReady ? (
        <>
          <Text style={styles.actionTitle}>
            You're all set.
          </Text>

          <Text style={styles.actionCopy}>
            {match.otherUser.displayName} expects to be ready in about{' '}
            {match.theirAfterWorkout.minutes} minutes.
          </Text>
        </>
      ) : (
        <>
          <Text style={styles.actionTitle}>
            {match.otherUser.displayName} is ready.
          </Text>

          {match.theirMeetingLocation ? (
            <Text style={styles.meetingSpot}>
              Meet at {match.theirMeetingLocation}.
            </Text>
          ) : (
            <Text style={styles.actionCopy}>
              They’re choosing where to meet.
            </Text>
          )}
        </>
      )}
    </View>
  )}

{match.counterProposal?.status !== 'accepted' &&
  match.myPreference === 'after_workout' && (
  <View style={styles.myActionBox}>
    {!match.myAfterWorkout?.acceptedByOther ? (
      <View style={styles.actionBox}>
        <Text style={styles.actionTitle}>
          Waiting for {match.otherUser.displayName}
        </Text>

        <Text style={styles.actionCopy}>
          They’re deciding whether your timing works for them.
        </Text>
      </View>
    ) : !match.myReady ? (
      <>
        <View style={styles.actionBox}>
          <Text style={styles.actionTitle}>
            {match.otherUser.displayName} is good with your timing.
          </Text>

          <Text style={styles.actionCopy}>
            Finish your workout. Let them know when you’re ready.
          </Text>
        </View>

        <Pressable
          style={styles.primaryButton}
          onPress={markReady}
        >
          <Text style={styles.primaryText}>
            I'M READY NOW
          </Text>
        </Pressable>
      </>
    ) : (
      <>
        <Text style={styles.actionTitle}>
          Where should you meet?
        </Text>

        <View style={styles.meetingOptions}>
          {[
            'Water fountains',
            'Smoothie bar',
            'Front entrance',
            'Outside',
          ].map((spot) => (
            <Pressable
              key={spot}
              style={[
                styles.meetingButton,
                match.myMeetingLocation === spot &&
                  styles.meetingButtonActive,
              ]}
              onPress={() => chooseMeetingLocation(spot)}
            >
              <Text
                style={[
                  styles.meetingButtonText,
                  match.myMeetingLocation === spot &&
                    styles.meetingButtonTextActive,
                ]}
              >
                {spot}
              </Text>
            </Pressable>
          ))}
        </View>
      </>
    )}
  </View>
)}

{match.theirPreference === 'chat_first' && (
  <Pressable
    style={styles.primaryButton}
    onPress={() =>
      navigation.navigate('Chat', {
        matchId: route.params.matchId,
      })
    }
  >
    <Text style={styles.primaryText}>
      OPEN CHAT
    </Text>
  </Pressable>
)}
        {match.theirPreference === 'meet_here' && (
          <Pressable style={styles.primaryButton}>
            <Text style={styles.primaryText}>
              CHOOSE MEETING SPOT
            </Text>
          </Pressable>
        )}

        {match.theirPreference === 'exchange_contact' && (
          <Pressable style={styles.primaryButton}>
            <Text style={styles.primaryText}>
              EXCHANGE INFO
            </Text>
          </Pressable>
        )}

        {match.theirPreference === 'meet_later' && (
          <Pressable style={styles.primaryButton}>
            <Text style={styles.primaryText}>
              PLAN A TIME
            </Text>
          </Pressable>
        )}

{(match.theirPreference === 'approach_now' ||
  match.theirPreference === 'between_sets' ||
  match.theirPreference === 'have_a_drink') && (
  <>
    <Text style={styles.doneText}>
      Notiz has done its job. The rest happens in person.
    </Text>

    <Pressable
      style={[styles.primaryButton, { marginTop: 18 }]}
      onPress={() => {
        navigation.popToTop();
      }}
    >
      <Text style={styles.primaryText}>
        BACK TO HOME
      </Text>
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
    padding: 26,
  },

  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFC',
  },

  top: {
    paddingTop: 20,
  },

  eyebrow: {
    textAlign: 'center',
    color: '#5427A5',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.4,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  iconCircle: {
    width: 105,
    height: 105,
    borderRadius: 53,
    backgroundColor: '#EEE8F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },

  icon: {
    fontSize: 42,
  },

  waitIcon: {
    width: 105,
    height: 105,
    borderRadius: 53,
    backgroundColor: '#EEE8F8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  waitEmoji: {
    fontSize: 40,
  },

  title: {
    maxWidth: 330,
    fontSize: 30,
    lineHeight: 38,
    fontWeight: '800',
    color: '#29272E',
    textAlign: 'center',
  },

  copy: {
    marginTop: 14,
    maxWidth: 320,
    fontSize: 16,
    lineHeight: 24,
    color: '#85808A',
    textAlign: 'center',
  },

  bottom: {
    paddingBottom: 30,
  },

  primaryButton: {
    height: 62,
    backgroundColor: '#5427A5',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  primaryText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  doneText: {
    color: '#8D8891',
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
  },
actionBox: {
  backgroundColor: '#F1ECF8',
  borderRadius: 22,
  padding: 20,
  marginBottom: 16,
},

myActionBox: {
  marginBottom: 16,
},

actionTitle: {
  color: '#302D34',
  fontSize: 18,
  fontWeight: '800',
  textAlign: 'center',
},

actionCopy: {
  marginTop: 8,
  color: '#85808A',
  fontSize: 14,
  lineHeight: 21,
  textAlign: 'center',
},

meetingSpot: {
  marginTop: 10,
  color: '#5427A5',
  fontSize: 20,
  fontWeight: '900',
  textAlign: 'center',
},

meetingOptions: {
  marginTop: 14,
  gap: 9,
},

meetingButton: {
  height: 54,
  backgroundColor: '#FFFFFF',
  borderRadius: 17,
  borderWidth: 1,
  borderColor: '#E5E1E8',
  justifyContent: 'center',
  alignItems: 'center',
},

meetingButtonActive: {
  backgroundColor: '#EEE8F8',
  borderColor: '#5427A5',
},

meetingButtonText: {
  color: '#5D5962',
  fontWeight: '700',
},

meetingButtonTextActive: {
  color: '#5427A5',
},
acceptButton: {
  marginTop: 20,
  height: 58,
  borderRadius: 18,
  backgroundColor: '#5427A5',
  alignItems: 'center',
  justifyContent: 'center',
},

acceptButtonText: {
  color: '#FFFFFF',
  fontSize: 14,
  fontWeight: '900',
  letterSpacing: 0.8,
},

alternativeButton: {
  marginTop: 10,
  height: 52,
  borderRadius: 18,
  backgroundColor: '#FFFFFF',
  borderWidth: 1,
  borderColor: '#D9D3DE',
  alignItems: 'center',
  justifyContent: 'center',
},

alternativeButtonText: {
  color: '#625D67',
  fontSize: 13,
  fontWeight: '800',
},
alternativeOptions: {
  marginTop: 12,
  gap: 8,
},

alternativeOption: {
  minHeight: 58,
  paddingHorizontal: 16,
  borderRadius: 16,
  backgroundColor: '#FFFFFF',
  borderWidth: 1,
  borderColor: '#E5E1E8',
  flexDirection: 'row',
  alignItems: 'center',
},

alternativeIcon: {
  fontSize: 21,
  marginRight: 12,
},

alternativeLabel: {
  flex: 1,
  color: '#302D34',
  fontSize: 15,
  fontWeight: '700',
},

alternativeArrow: {
  color: '#AAA5AE',
  fontSize: 24,
},
counterCard: {
  backgroundColor: '#F1ECF8',
  borderRadius: 22,
  padding: 20,
  marginBottom: 16,
  borderWidth: 1,
  borderColor: '#DDD3EC',
},

counterEyebrow: {
  color: '#5427A5',
  fontSize: 9,
  fontWeight: '900',
  letterSpacing: 1.2,
  textAlign: 'center',
  marginBottom: 10,
},

counterChoice: {
  marginTop: 18,
  minHeight: 64,
  borderRadius: 18,
  backgroundColor: '#FFFFFF',
  borderWidth: 1,
  borderColor: '#E5E1E8',
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 18,
},

counterIcon: {
  fontSize: 24,
  marginRight: 13,
},

counterLabel: {
  color: '#302D34',
  fontSize: 17,
  fontWeight: '800',
},
agreedCard: {
  backgroundColor: '#F1ECF8',
  borderRadius: 22,
  padding: 22,
  marginBottom: 18,
  borderWidth: 1,
  borderColor: '#D9CDEE',
},

agreedEyebrow: {
  color: '#5427A5',
  fontSize: 9,
  fontWeight: '900',
  letterSpacing: 1.3,
  textAlign: 'center',
},

agreedTitle: {
  marginTop: 8,
  color: '#302D34',
  fontSize: 24,
  fontWeight: '900',
  textAlign: 'center',
},

agreedCopy: {
  marginTop: 7,
  marginBottom: 18,
  color: '#85808A',
  fontSize: 14,
  textAlign: 'center',
},
});
