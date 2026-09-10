import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { api } from '../services/api';
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { RootStackParamList } from '../types';
import {
  isNotificationNavigationPending,
} from '../services/notificationNavigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;


export function HomeScreen({ navigation }: Props) {
  const [checkingActive, setCheckingActive] = useState(false);
  const [places, setPlaces] = useState<
  {
    id: string;
    venueId: string;
    venueName: string;
    venueType: 'gym' | 'bar';
  }[]
>([]);

useFocusEffect(
  useCallback(() => {
    let active = true;

    const restoreActiveCheckin = async () => {
      if (isNotificationNavigationPending()) {
        console.log(
          'Skipping ActiveVenue restore because notification navigation is pending'
        );
        return;
      }
      try {

        setCheckingActive(true);

        const result = await api<{
          active: boolean;
          checkin: {
            id: string;
            venueId: string;
            venueName: string;
            venueType: 'gym' | 'bar';
          } | null;
        }>('/api/checkins/active');

      

        if (
          active &&
          result.active &&
          result.checkin
        ) {
          navigation.replace('ActiveVenue', {
            checkinId: result.checkin.id,
            venueId: result.checkin.venueId,
            venueName: result.checkin.venueName,
            venueType: result.checkin.venueType,
          });
        }
      } catch (e) {
        console.warn(
          'Could not restore active check-in',
          e
        );
      } finally {
        if (active) {
          setCheckingActive(false);
        }
      }
    };

    restoreActiveCheckin();

    return () => {
      active = false;
    };
  }, [navigation])
);
useFocusEffect(
  useCallback(() => {
    let active = true;

    const loadRecentPlaces = async () => {
      try {
        const result = await api<
          {
            id: string;
            venueId: string;
            venueName: string;
            venueType: 'gym' | 'bar';
          }[]
        >('/api/checkins/recent');

console.log('RECENT PLACES:', result);

        if (active) {
          setPlaces(result);
        }
      } catch (e) {
        console.warn(
          'Could not load recent places',
          e
        );
      }
    };

    loadRecentPlaces();

    return () => {
      active = false;
    };
  }, [])
);

  const [unreadCount, setUnreadCount] = useState(0);

useFocusEffect(
  useCallback(() => {
    let active = true;

    const loadUnread = async () => {
      try {
        const matches = await api<
          { myUnreadCount?: number }[]
        >('/api/matches');

        const total = matches.reduce(
          (sum, match) =>
            sum + (match.myUnreadCount ?? 0),
          0
        );

        if (active) {
          setUnreadCount(total);
        }
      } catch (e) {
        console.warn(
          'Could not load unread count',
          e
        );
      }
    };

    loadUnread();

    return () => {
      active = false;
    };
  }, [])
);
  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.header}>
  <View>
    <Text style={styles.logo}>Notiz</Text>
    <Text style={styles.subtitle}>
      Ready when you notice someone.
    </Text>
  </View>
</View>

      <View style={styles.center}>
        <Pressable
          style={({ pressed }) => [
            styles.checkInButton,
            pressed && styles.checkInPressed,
          ]}
            // Dedicated location screen comes next.
onPress={() => navigation.navigate('LocationSelect')}
        >
          <View style={styles.checkInInner}>
            <Text style={styles.checkInLabel}>CHECK IN</Text>
            <Text style={styles.checkInSubtext}>Find where you are</Text>
          </View>
        </Pressable>
      </View>

      <View style={styles.placesSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Places</Text>

          <Pressable>
            <Text style={styles.addPlace}>+ Add</Text>
          </Pressable>
        </View>

        <View style={styles.placeList}>
        {places.map((place, index) => (
  <Pressable
    key={place.venueId}
    style={styles.placeCard}
    onPress={() =>
      navigation.navigate('SelfDescription', {
        venueId: place.venueId,
        venueName: place.venueName,
        venueType: place.venueType,
      })
    }
  >
    <View>
      <Text style={styles.placeName}>
        {place.venueName}
      </Text>

      <Text style={styles.placeSubtitle}>
        {index === 0
          ? 'Most recent'
          : 'Previously visited'}
      </Text>
    </View>

    <Text style={styles.arrow}>›</Text>
  </Pressable>
))}
        </View>
      </View>

      <View style={styles.bottomNav}>
        <Pressable style={styles.navItem}>
          <Text style={styles.navIcon}>⌂</Text>
          <Text style={styles.navActive}>Home</Text>
        </Pressable>

        <Pressable
  style={styles.navItem}
  onPress={() => navigation.navigate('Matches')}
>
  <View style={styles.navIconWrap}>
    <Text style={styles.navIcon}>♡</Text>

    {unreadCount > 0 && (
      <View style={styles.unreadBadge}>
        <Text style={styles.unreadBadgeText}>
          {unreadCount > 9 ? '9+' : unreadCount}
        </Text>
      </View>
    )}
  </View>

  <Text style={styles.navText}>Notiz</Text>
</Pressable>

<Pressable
  style={styles.navItem}
  onPress={() => navigation.navigate('Profile')}
>
  <Text style={styles.navIcon}>○</Text>
  <Text style={styles.navText}>Profile</Text>
</Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#FAFAFC',
    paddingHorizontal: 24,
  },

  header: {
    paddingTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  logo: {
    fontSize: 30,
    fontWeight: '800',
    color: '#5427A5',
  },

  subtitle: {
    marginTop: 3,
    fontSize: 14,
    color: '#89858E',
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkInButton: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#5427A5',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#5427A5',
    shadowOpacity: 0.22,
    shadowRadius: 28,
    shadowOffset: {
      width: 0,
      height: 14,
    },
  },

  checkInPressed: {
    transform: [{ scale: 0.97 }],
  },

  checkInInner: {
    width: 184,
    height: 184,
    borderRadius: 92,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkInLabel: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: '#FFFFFF',
  },

  checkInSubtext: {
    marginTop: 6,
    color: 'rgba(255,255,255,0.72)',
    fontSize: 13,
  },

  placesSection: {
    paddingBottom: 22,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#29272E',
  },

  addPlace: {
    fontSize: 14,
    color: '#5427A5',
    fontWeight: '700',
  },

  placeList: {
    gap: 10,
  },

  placeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ECEAF0',
  },

  placeName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#29272E',
  },

  placeSubtitle: {
    marginTop: 3,
    fontSize: 12,
    color: '#99959F',
  },

  arrow: {
    fontSize: 28,
    color: '#A9A5AE',
  },

  bottomNav: {
    height: 72,
    borderTopWidth: 1,
    borderTopColor: '#EAE7ED',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  navItem: {
    minWidth: 70,
    alignItems: 'center',
  },

  navIcon: {
    fontSize: 21,
    marginBottom: 2,
    color: '#6F6B74',
  },

  navActive: {
    fontSize: 11,
    fontWeight: '700',
    color: '#5427A5',
  },

  navText: {
    fontSize: 11,
    color: '#8E8993',
  },
  navIconWrap: {
    position: 'relative',
  },
  
  unreadBadge: {
    position: 'absolute',
    top: -7,
    right: -12,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 5,
    borderRadius: 9,
    backgroundColor: '#5427A5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  unreadBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },
});
