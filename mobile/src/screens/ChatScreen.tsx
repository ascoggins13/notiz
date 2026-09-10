import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  Keyboard,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { api } from '../services/api';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Chat'>;

type Message = {
  id: string;
  senderId: string;
  text: string;
  createdAt?: {
    _seconds?: number;
    seconds?: number;
  };
};

type MatchDetail = {
  id: string;
  myUserId: string;
  otherUser: {
    id: string;
    displayName: string;
  };
};

function formatMessageTime(message: Message): string {
  const seconds =
    message.createdAt?.seconds ??
    message.createdAt?._seconds;

  if (!seconds) return '';

  return new Date(seconds * 1000).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function ChatScreen({ route, navigation }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [match, setMatch] = useState<MatchDetail | null>(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showSafetyMenu, setShowSafetyMenu] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const listRef = useRef<FlatList<Message>>(null);

  useEffect(() => {
    const showSubscription = Keyboard.addListener(
      'keyboardWillShow',
      (event) => {
        setKeyboardHeight(event.endCoordinates.height);
      }
    );
  
    const hideSubscription = Keyboard.addListener(
      'keyboardWillHide',
      () => {
        setKeyboardHeight(0);
      }
    );
  
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      const load = async () => {
        try {
          const [matchResult, messageResult] = await Promise.all([
            api<MatchDetail>(
              `/api/matches/${route.params.matchId}`
            ),
            api<Message[]>(
              `/api/matches/${route.params.matchId}/messages`
            ),
          ]);

          if (active) {
            setMatch(matchResult);
            setMessages(messageResult);
            setLoading(false);
          }
          try {
            await api(
              `/api/matches/${route.params.matchId}/messages/read`,
              {
                method: 'POST',
                body: JSON.stringify({}),
              }
            );
          } catch (e) {
            console.warn(
              'Could not mark chat as read:',
              e instanceof Error ? e.message : e
            );
          }
        } catch (e) {
          if (active) {
            setLoading(false);

            Alert.alert(
              'Could not load chat',
              e instanceof Error ? e.message : 'Unknown error'
            );
          }
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

  const send = async () => {
    const message = text.trim();

    if (!message || sending) return;

    try {
      setSending(true);

      await api(
        `/api/matches/${route.params.matchId}/messages`,
        {
          method: 'POST',
          body: JSON.stringify({
            text: message,
          }),
        }
      );

      setText('');

      const updated = await api<Message[]>(
        `/api/matches/${route.params.matchId}/messages`
      );
      try {
        await api(
          `/api/matches/${route.params.matchId}/messages/read`,
          {
            method: 'POST',
            body: JSON.stringify({}),
          }
        );
      } catch (e) {
        console.warn(
          'Could not mark chat as read:',
          e instanceof Error ? e.message : e
        );
      }
      setMessages(updated);

    } catch (e) {
      Alert.alert(
        'Could not send message',
        e instanceof Error ? e.message : 'Unknown error'
      );
    } finally {
      setSending(false);
    }
  };
  const blockUser = () => {
    Alert.alert(
      `Block ${match?.otherUser.displayName ?? 'this person'}?`,
      'They will no longer be able to connect with you through Notiz.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Block',
          style: 'destructive',
          onPress: async () => {
            if (!match) return;
  
            try {
              await api('/api/users/block', {
                method: 'POST',
                body: JSON.stringify({
                  userId: match.otherUser.id,
                }),
              });
  
              navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
              });
            } catch (e) {
              Alert.alert(
                'Could not block user',
                e instanceof Error
                  ? e.message
                  : 'Unknown error'
              );
            }
          },
        },
      ]
    );
  };

  if (loading || !match) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color="#5427A5" />
      </View>
    );
  }

  return (

      <SafeAreaView style={styles.page}>
       <View style={styles.header}>
  <Text style={styles.eyebrow}>
    YOU NOTICED EACH OTHER
  </Text>

  <Text style={styles.title}>
    {match.otherUser.displayName}
  </Text>

  <Text style={styles.subtitle}>
    Say hi. Keep it comfortable.
  </Text>
  <Pressable
  style={styles.moreButton}
  onPress={() => setShowSafetyMenu((current) => !current)}
>
  <Text style={styles.moreButtonText}>•••</Text>
</Pressable>

{showSafetyMenu && (
  <View style={styles.safetyMenu}>
    <Pressable
      style={styles.safetyMenuItem}
      onPress={() => {
        setShowSafetyMenu(false);

        navigation.navigate('ReportUser', {
          userId: match.otherUser.id,
          displayName: match.otherUser.displayName,
          matchId: route.params.matchId,
        });
      }}
    >
      <Text style={styles.safetyMenuText}>
        Report
      </Text>
    </Pressable>

    <View style={styles.safetyMenuDivider} />

    <Pressable
      style={styles.safetyMenuItem}
      onPress={() => {
        setShowSafetyMenu(false);
        blockUser();
      }}
    >
      <Text style={styles.safetyMenuDestructive}>
        Block
      </Text>
    </Pressable>
  </View>
)}
  <Pressable
  style={styles.homeButton}
  onPress={() => {
    const state = navigation.getState();
  
    const activeVenueRoute = [...state.routes]
      .reverse()
      .find((item) => item.name === 'ActiveVenue');
  
    if (activeVenueRoute) {
      navigation.dispatch({
        type: 'SET_PARAMS',
        source: activeVenueRoute.key,
        payload: {
          params: {
            handledMatchId: route.params.matchId,
          },
        },
      });
    }
  
    navigation.pop(3);
  }}
  >
    <Text style={styles.homeButtonText}>
      HOME
    </Text>
  </Pressable>

</View>

        <FlatList
  ref={listRef}
  data={messages}
  keyExtractor={(item) => item.id}
  contentContainerStyle={styles.messages}
  keyboardShouldPersistTaps="handled"
  keyboardDismissMode="interactive"
  onContentSizeChange={() =>
    listRef.current?.scrollToEnd({ animated: true })
  }
  onLayout={() =>
    listRef.current?.scrollToEnd({ animated: false })
  }
  renderItem={({ item }) => {
    const mine = item.senderId === match.myUserId;
  
    

    return (
      <View
        style={[
          styles.messageRow,
          mine
            ? styles.myMessageRow
            : styles.theirMessageRow,
        ]}
      >
        <View
          style={[
            styles.bubble,
            mine
              ? styles.myBubble
              : styles.theirBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              mine && styles.myMessageText,
            ]}
          >
            {item.text}
          </Text>

          <Text
            style={[
              styles.messageTime,
              mine && styles.myMessageTime,
            ]}
          >
            {formatMessageTime(item)}
          </Text>
        </View>
      </View>
    );
  }}
  ListEmptyComponent={
    <View style={styles.empty}>
      <Text style={styles.emptyTitle}>
        The hard part is already over.
      </Text>

      <Text style={styles.emptyCopy}>
        You both noticed each other. Someone just has to say hi.
      </Text>
    </View>
  }
/>
      
        

<View
  style={[
    styles.composer,
    keyboardHeight > 0 && {
      marginBottom: keyboardHeight,
    },
  ]}
>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder={`Message ${match.otherUser.displayName}`}
            placeholderTextColor="#99949F"
            style={styles.input}
            multiline
            maxLength={1000}
            returnKeyType="send"
  blurOnSubmit={false}
  onFocus={() => {
    setTimeout(() => {
      listRef.current?.scrollToEnd({
        animated: true,
      });
    }, 250);
  }}
  onSubmitEditing={() => {
    if (text.trim()) {
      send();
    }
  }}
          />

          <Pressable
            style={[
              styles.sendButton,
              (!text.trim() || sending) &&
                styles.sendButtonDisabled,
            ]}
            disabled={!text.trim() || sending}
            onPress={send}
          >
            <Text style={styles.sendText}>
              {sending ? '...' : '↑'}
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
  },

  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFC',
  },

  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEAF1',
  },

  eyebrow: {
    color: '#5427A5',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.3,
    textAlign: 'center',
  },

  title: {
    marginTop: 6,
    fontSize: 25,
    fontWeight: '800',
    color: '#29272E',
    textAlign: 'center',
  },

  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: '#85808A',
    textAlign: 'center',
  },

  messages: {
    flexGrow: 1,
    padding: 18,
    paddingBottom: 28,
  },

  messageRow: {
    width: '100%',
    marginBottom: 10,
  },

  myMessageRow: {
    alignItems: 'flex-end',
  },

  theirMessageRow: {
    alignItems: 'flex-start',
  },

  bubble: {
    maxWidth: '78%',
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 20,
  },

  myBubble: {
    backgroundColor: '#5427A5',
    borderBottomRightRadius: 6,
  },

  theirBubble: {
    backgroundColor: '#EEEAF1',
    borderBottomLeftRadius: 6,
  },

  messageText: {
    color: '#29272E',
    fontSize: 15,
    lineHeight: 21,
  },

  myMessageText: {
    color: '#FFFFFF',
  },

  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 35,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#29272E',
    textAlign: 'center',
  },

  emptyCopy: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    color: '#85808A',
    textAlign: 'center',
  },

  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEEAF1',
    backgroundColor: '#FFFFFF',
  },

  input: {
    flex: 1,
    minHeight: 46,
    maxHeight: 120,
    backgroundColor: '#F5F3F7',
    borderRadius: 23,
    paddingHorizontal: 17,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 15,
    color: '#29272E',
  },

  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#5427A5',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },

  sendButtonDisabled: {
    opacity: 0.35,
  },

  sendText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },
messageTime: {
  marginTop: 4,
  fontSize: 10,
  color: '#8F8994',
  alignSelf: 'flex-end',
},

myMessageTime: {
  color: 'rgba(255,255,255,0.65)',
},
homeButton: {
  alignSelf: 'center',
  marginTop: 12,
  paddingHorizontal: 16,
  paddingVertical: 8,
  borderRadius: 14,
  backgroundColor: '#EEE8F8',
},

homeButtonText: {
  color: '#5427A5',
  fontSize: 11,
  fontWeight: '900',
  letterSpacing: 0.8,
},
blockButton: {
  alignSelf: 'center',
  marginTop: 8,
  paddingHorizontal: 14,
  paddingVertical: 7,
},

blockButtonText: {
  color: '#B54343',
  fontSize: 10,
  fontWeight: '900',
  letterSpacing: 0.8,
},
reportButton: {
  alignSelf: 'center',
  marginTop: 2,
  paddingHorizontal: 14,
  paddingVertical: 6,
},

reportButtonText: {
  color: '#9B929F',
  fontSize: 10,
  fontWeight: '800',
  letterSpacing: 0.8,
},
safetyActions: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: 4,
},

safetyDivider: {
  color: '#C9C4CC',
  fontSize: 10,
},
moreButton: {
  alignSelf: 'center',
  marginTop: 8,
  paddingHorizontal: 14,
  paddingVertical: 6,
},

moreButtonText: {
  color: '#8F8994',
  fontSize: 18,
  fontWeight: '900',
  letterSpacing: 2,
},

safetyMenu: {
  alignSelf: 'center',
  marginTop: 4,
  width: 150,
  backgroundColor: '#FFFFFF',
  borderRadius: 14,
  borderWidth: 1,
  borderColor: '#E8E4EB',
  overflow: 'hidden',
},

safetyMenuItem: {
  minHeight: 46,
  alignItems: 'center',
  justifyContent: 'center',
},

safetyMenuDivider: {
  height: 1,
  backgroundColor: '#EEEAF0',
},

safetyMenuText: {
  color: '#4F4A54',
  fontSize: 13,
  fontWeight: '700',
},

safetyMenuDestructive: {
  color: '#B54343',
  fontSize: 13,
  fontWeight: '800',
},
});
