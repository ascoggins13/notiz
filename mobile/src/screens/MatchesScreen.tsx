import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
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
  'Matches'
>;

type MatchItem = {
  id: string;
  status: string;

  otherUser: {
    displayName: string;
  };

  myUnreadCount: number;

  chatAvailable: boolean;

  latestMessage: {
    id: string;
    senderId: string;
    text: string;
  } | null;
};

export function MatchesScreen({
  navigation,
}: Props) {
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const result = await api<MatchItem[]>(
        '/api/matches'
      );

      setMatches(result);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#5427A5" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>
          YOUR CONNECTIONS
        </Text>

        <Text style={styles.pageTitle}>
          Notiz
        </Text>
      </View>

      <FlatList
        data={matches}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>
              No connections yet.
            </Text>

            <Text style={styles.emptyCopy}>
              Mutual Notiz connections will appear here.
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const hasUnread =
            item.myUnreadCount > 0;

          const preview =
            item.latestMessage?.text ??
            'You noticed each other.';

          return (
            <Pressable
              style={styles.card}
              onPress={() => {
                if (item.chatAvailable) {
                  navigation.navigate('Chat', {
                    matchId: item.id,
                  });
                } else {
                  navigation.navigate(
                    'MatchDetail',
                    {
                      matchId: item.id,
                    }
                  );
                }
              }}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {item.otherUser.displayName
                    .charAt(0)
                    .toUpperCase()}
                </Text>
              </View>

              <View style={styles.cardBody}>
                <View style={styles.nameRow}>
                  <Text style={styles.name}>
                    {item.otherUser.displayName}
                  </Text>

                  {hasUnread && (
                    <View style={styles.unreadBadge}>
                      <Text
                        style={styles.unreadBadgeText}
                      >
                        {item.myUnreadCount > 9
                          ? '9+'
                          : item.myUnreadCount}
                      </Text>
                    </View>
                  )}
                </View>

                <Text
                  style={[
                    styles.preview,
                    hasUnread &&
                      styles.previewUnread,
                  ]}
                  numberOfLines={1}
                >
                  {preview}
                </Text>
              </View>

              <Text style={styles.arrow}>
                ›
              </Text>
            </Pressable>
          );
        }}
      />
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFC',
  },

  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
  },

  eyebrow: {
    color: '#5427A5',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.3,
  },

  pageTitle: {
    marginTop: 5,
    fontSize: 32,
    fontWeight: '900',
    color: '#29272E',
  },

  list: {
    padding: 18,
    paddingBottom: 40,
    gap: 10,
  },

  card: {
    minHeight: 82,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ECE8EF',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEE8F8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    color: '#5427A5',
    fontSize: 18,
    fontWeight: '900',
  },

  cardBody: {
    flex: 1,
    marginLeft: 13,
  },

  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  name: {
    flex: 1,
    color: '#29272E',
    fontSize: 16,
    fontWeight: '800',
  },

  preview: {
    marginTop: 5,
    color: '#918C96',
    fontSize: 13,
  },

  previewUnread: {
    color: '#4C4750',
    fontWeight: '700',
  },

  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 6,
    backgroundColor: '#5427A5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  unreadBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },

  arrow: {
    marginLeft: 10,
    color: '#AAA5AE',
    fontSize: 26,
  },

  empty: {
    paddingTop: 100,
    alignItems: 'center',
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#29272E',
  },

  emptyCopy: {
    marginTop: 8,
    fontSize: 14,
    color: '#918C96',
    textAlign: 'center',
  },
});