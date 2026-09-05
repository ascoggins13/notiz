import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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
  'BlockedUsers'
>;

type BlockedUser = {
  id: string;
  displayName: string;
};

export function BlockedUsersScreen({
  navigation,
}: Props) {
  const [users, setUsers] = useState<BlockedUser[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const result = await api<BlockedUser[]>(
        '/api/users/blocked'
      );

      setUsers(result);
    } catch (e) {
      Alert.alert(
        'Could not load blocked users',
        e instanceof Error ? e.message : 'Unknown error'
      );
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  const unblock = (user: BlockedUser) => {
    Alert.alert(
      `Unblock ${user.displayName}?`,
      'They may be eligible to interact with you on Notiz again.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Unblock',
          onPress: async () => {
            try {
              await api('/api/users/block', {
                method: 'DELETE',
                body: JSON.stringify({
                  userId: user.id,
                }),
              });

              setUsers((current) =>
                current.filter(
                  (item) => item.id !== user.id
                )
              );
            } catch (e) {
              Alert.alert(
                'Could not unblock user',
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

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color="#5427A5" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.page}>
      <Text style={styles.eyebrow}>
        PRIVACY & SAFETY
      </Text>

      <Text style={styles.title}>
        Blocked users
      </Text>

      <Text style={styles.copy}>
        People you block cannot connect with you through Notiz.
      </Text>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>
              No blocked users.
            </Text>

            <Text style={styles.emptyCopy}>
              People you block will appear here.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {item.displayName
                  .charAt(0)
                  .toUpperCase()}
              </Text>
            </View>

            <Text style={styles.name}>
              {item.displayName}
            </Text>

            <Pressable
              style={styles.unblockButton}
              onPress={() => unblock(item)}
            >
              <Text style={styles.unblockText}>
                UNBLOCK
              </Text>
            </Pressable>
          </View>
        )}
      />

      <Pressable
        style={styles.doneButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.doneText}>
          DONE
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#FAFAFC',
    paddingHorizontal: 24,
  },

  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFAFC',
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
    fontSize: 14,
    lineHeight: 21,
    color: '#89848E',
  },

  list: {
    paddingTop: 24,
    gap: 10,
  },

  card: {
    minHeight: 72,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E8E4EB',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#EEE8F8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    color: '#5427A5',
    fontWeight: '900',
  },

  name: {
    flex: 1,
    marginLeft: 12,
    color: '#29272E',
    fontSize: 15,
    fontWeight: '800',
  },

  unblockButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  unblockText: {
    color: '#5427A5',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.7,
  },

  empty: {
    paddingTop: 80,
    alignItems: 'center',
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#29272E',
  },

  emptyCopy: {
    marginTop: 6,
    color: '#918C96',
    fontSize: 13,
  },

  doneButton: {
    marginTop: 'auto',
    marginBottom: 24,
    minHeight: 56,
    borderRadius: 18,
    backgroundColor: '#5427A5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  doneText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
});
