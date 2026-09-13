import * as Location from 'expo-location';
import { Alert } from 'react-native';
import { api } from '../services/api';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  AppState,
  RefreshControl,
  ScrollView,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'LocationSelect'>;

type VenueType = 'gym' | 'bar';

type Venue = {
  id: string;
  name: string;
  type: VenueType;
  distance: string;
};

const nearbyPlaces: Venue[] = [
  {
    id: 'planet-fitness-001',
    name: 'Planet Fitness',
    type: 'gym',
    distance: '0.1 mi',
  },
  {
    id: 'the-address-001',
    name: 'The Address',
    type: 'bar',
    distance: '0.3 mi',
  },
  {
    id: 'la-fitness-001',
    name: 'LA Fitness',
    type: 'gym',
    distance: '0.5 mi',
  },
  {
    id: 'social-beer-garden-001',
    name: 'Social Beer Garden',
    type: 'bar',
    distance: '0.7 mi',
  },
];

export function LocationSelectScreen({ navigation }: Props) {
  const [query, setQuery] = useState('');
  const [coordinates, setCoordinates] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [refreshing, setRefreshing] = useState(false);

const loadLocation = useCallback(async () => {
  try {
    const permission =
      await Location.requestForegroundPermissionsAsync();

    if (permission.status !== 'granted') {
      Alert.alert(
        'Location needed',
        'Notiz uses your location to show places near you.'
      );
      return;
    }

    const position =
      await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

    const nextCoordinates = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };

    setCoordinates(nextCoordinates);

    const nearbyResult = await api<{
      venues: Venue[];
    }>(
      `/api/venues/nearby?lat=${nextCoordinates.latitude}&lng=${nextCoordinates.longitude}`
    );

    console.log(
      'NEARBY VENUES FROM SERVER:',
      nearbyResult.venues
    );

    setVenues(nearbyResult.venues);

    console.log(
      'NOTIZ LOCATION:',
      nextCoordinates
    );
  } catch (error) {
    console.warn(
      'Could not get current location:',
      error
    );
  }
}, []);

useEffect(() => {
  loadLocation();
}, [loadLocation]);

useEffect(() => {
  const subscription = AppState.addEventListener(
    'change',
    (nextState) => {
      if (nextState === 'active') {
        loadLocation();
      }
    }
  );

  return () => {
    subscription.remove();
  };
}, [loadLocation]);

const refreshNearbyPlaces = useCallback(async () => {
  setRefreshing(true);

  try {
    await loadLocation();
  } finally {
    setRefreshing(false);
  }
}, [loadLocation]);
  const [venues, setVenues] = useState<Venue[]>([]);

  const filteredPlaces = useMemo(() => {
    const value = query.trim().toLowerCase();

    if (!value) return venues;

    return venues.filter((place) =>
      place.name.toLowerCase().includes(value)
    );
  }, [query, venues]);

  const selectVenue = (venue: Venue) => {
    navigation.navigate('SelfDescription', {
      venueId: venue.id,
      venueName: venue.name,
      venueType: venue.type,
    });
  };
return (
  <SafeAreaView style={styles.page}>
   <ScrollView
  showsVerticalScrollIndicator={false}
  contentContainerStyle={styles.scrollContent}
  refreshControl={
    <RefreshControl
      refreshing={refreshing}
      onRefresh={refreshNearbyPlaces}
    />
  }
>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>CHECK IN</Text>
        <Text style={styles.title}>Where are you?</Text>
        <Text style={styles.copy}>
          Choose the place you’re currently visiting.
        </Text>
      </View>

      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>⌕</Text>

        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search nearby places"
          placeholderTextColor="#AAA6AF"
          style={styles.searchInput}
          autoCapitalize="words"
          returnKeyType="search"
        />
      </View>

      <View style={styles.locationRow}>
        <View style={styles.locationDot} />

        <View style={styles.locationText}>
          <Text style={styles.locationTitle}>Using your location</Text>
          <Text style={styles.locationSubtitle}>
            Nearby supported places
          </Text>
        </View>

        <Text style={styles.live}>LIVE</Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Places near you</Text>
        <Text style={styles.count}>{filteredPlaces.length}</Text>
      </View>

      <View style={styles.list}>
        {filteredPlaces.map((venue) => {
          const isGym = venue.type === 'gym';

          return (
            <Pressable
              key={venue.id}
              style={({ pressed }) => [
                styles.placeCard,
                pressed && styles.placePressed,
              ]}
              onPress={() => selectVenue(venue)}
            >
              <View
                style={[
                  styles.venueIcon,
                  isGym ? styles.gymIcon : styles.barIcon,
                ]}
              >
                <Text style={styles.venueEmoji}>
                  {isGym ? '🏋️' : '🍸'}
                </Text>
              </View>

              <View style={styles.placeInfo}>
                <Text style={styles.placeName}>{venue.name}</Text>

                <View style={styles.metaRow}>
                  <Text style={styles.placeType}>
                    {isGym ? 'Gym' : 'Bar'}
                  </Text>

                  <Text style={styles.metaDot}>•</Text>

                  <Text style={styles.distance}>{venue.distance}</Text>
                </View>
              </View>

              <Text style={styles.arrow}>›</Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable style={styles.missingPlace}>
        <Text style={styles.missingText}>
          Don’t see your location?
        </Text>
        <Text style={styles.addText}>Add a place</Text>
      </Pressable>
    </ScrollView>
  </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#FAFAFC',
    paddingHorizontal: 24,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    paddingTop: 18,
  },

  eyebrow: {
    color: '#5427A5',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.4,
  },

  title: {
    marginTop: 8,
    fontSize: 34,
    fontWeight: '800',
    color: '#29272E',
  },

  copy: {
    marginTop: 7,
    fontSize: 15,
    lineHeight: 22,
    color: '#817D86',
  },

  searchBox: {
    marginTop: 26,
    height: 56,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECEAF0',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },

  searchIcon: {
    fontSize: 24,
    color: '#827D88',
    marginRight: 10,
  },

  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#29272E',
  },

  locationRow: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1EDF8',
    borderRadius: 16,
    padding: 14,
  },

  locationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#5427A5',
    marginRight: 12,
  },

  locationText: {
    flex: 1,
  },

  locationTitle: {
    color: '#403C46',
    fontWeight: '700',
    fontSize: 14,
  },

  locationSubtitle: {
    marginTop: 2,
    color: '#8A8590',
    fontSize: 12,
  },

  live: {
    color: '#5427A5',
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 1,
  },

  sectionHeader: {
    marginTop: 28,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#29272E',
  },

  count: {
    marginLeft: 8,
    color: '#A19CA6',
    fontSize: 14,
    fontWeight: '700',
  },

  list: {
    gap: 11,
  },

  placeCard: {
    minHeight: 78,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ECEAF0',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },

  placePressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.86,
  },

  venueIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  gymIcon: {
    backgroundColor: '#EEE9F8',
  },

  barIcon: {
    backgroundColor: '#F2EFF5',
  },

  venueEmoji: {
    fontSize: 22,
  },

  placeInfo: {
    flex: 1,
    marginLeft: 14,
  },

  placeName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#29272E',
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },

  placeType: {
    fontSize: 13,
    color: '#67626C',
  },

  metaDot: {
    marginHorizontal: 7,
    color: '#B3AFB6',
  },

  distance: {
    fontSize: 13,
    color: '#96919A',
  },

  arrow: {
    fontSize: 28,
    color: '#A6A1AA',
  },

  missingPlace: {
    marginTop: 22,
    alignItems: 'center',
    paddingVertical: 14,
  },

  missingText: {
    color: '#8C8791',
    fontSize: 13,
  },

  addText: {
    marginTop: 4,
    color: '#5427A5',
    fontSize: 14,
    fontWeight: '800',
  },
});
