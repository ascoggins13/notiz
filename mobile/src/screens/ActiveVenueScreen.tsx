import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, {
  useCallback,
  useRef,
  useState,
} from 'react';import { useFocusEffect } from '@react-navigation/native';
import { api } from '../services/api';
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
  'ActiveVenue'
>;


const dotPositions = [
  { top: '17%', left: '20%' },
  { top: '27%', left: '67%' },
  { top: '41%', left: '36%' },
  { top: '51%', left: '73%' },
  { top: '68%', left: '18%' },
  { top: '73%', left: '56%' },
  { top: '36%', left: '83%' },
  { top: '22%', left: '45%' },
  { top: '61%', left: '82%' },
  { top: '78%', left: '33%' },
  { top: '33%', left: '12%' },
  { top: '58%', left: '48%' },
];
export function ActiveVenueScreen({
  route,
  navigation,
}: Props) {

const {
  checkinId,
  venueId,
  venueName,
  venueType,
} = route.params;

const [venueCount, setVenueCount] = useState(1);
const otherPeopleCount = Math.max(venueCount - 1, 0);

const visibleDots = dotPositions.slice(
  0,
  Math.min(otherPeopleCount, dotPositions.length)
);
const [hasIncoming, setHasIncoming] = useState(false);
const [unreadCount, setUnreadCount] = useState(0);
const openedMatchId = useRef<string | null>(null);

useFocusEffect(
  useCallback(() => {
    let active = true;

    const refresh = async () => {
      try {
        const incoming = await api<{ hasIncoming: boolean }>(
          `/api/notices/incoming?checkinId=${encodeURIComponent(checkinId)}`
        );

        if (active) {
          setHasIncoming(incoming.hasIncoming);
        }

        const sentStatus = await api<{
          status: string;
          matchId: string | null;
        }>(
          `/api/notices/status?checkinId=${encodeURIComponent(checkinId)}`
        );

        if (
          active &&
          sentStatus.status === 'mutual' &&
          sentStatus.matchId &&
          openedMatchId.current !== sentStatus.matchId
        ) {
          openedMatchId.current = sentStatus.matchId;
        
          navigation.navigate('MatchDetail', {
            matchId: sentStatus.matchId,
          });
        }
        const unread = await api<{
          unreadCount: number;
        }>('/api/matches/unread-total');
        
        if (active) {
          setUnreadCount(unread.unreadCount);
        }
const venueState = await api<{
  count: number;
}>(
  `/api/checkins/venue-count?venueId=${encodeURIComponent(
    venueId
  )}`
);

if (active) {
  setVenueCount(venueState.count);
}


      } catch (e) {
        console.warn(
          'ActiveVenue refresh failed:',
          e instanceof Error ? e.message : e
        );
      }
    };

    refresh();
  

    const interval = setInterval(refresh, 30000);

    return () => {
      active = false;
      clearInterval(interval);
    };
}, [checkinId, venueId, navigation])
);
const endCheckin = async () => {
  try {
    await api(`/api/checkins/${checkinId}`, {
      method: 'DELETE',
    });

    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  } catch (e) {
    console.warn(
      'Could not end check-in:',
      e instanceof Error ? e.message : e
    );
  }
};


  return (
    <SafeAreaView style={styles.page}>
 <View style={styles.header}>
    <View style={styles.headerText}>
    <Text style={styles.checkedIn}>
      ✓ CHECKED IN
    </Text>

    <Text
  style={styles.venueName}
  numberOfLines={2}
  adjustsFontSizeToFit
  minimumFontScale={0.8}
>
  {venueName}
</Text>
  </View>

  <View style={styles.headerActions}>
    <Pressable
      style={styles.notizInbox}
      onPress={() => navigation.navigate('Matches')}
    >
      <Text style={styles.notizInboxIcon}>
        ♡
      </Text>

      {unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadBadgeText}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </Text>
        </View>
      )}
    </Pressable>

    <View style={styles.countBadge}>
  <Text style={styles.countNumber}>
    {venueCount}
  </Text>

  <Text style={styles.countLabel}>
    here
  </Text>
</View>
  </View>
</View>

      <Text style={styles.copy}>
        People currently using Notiz at this location.
      </Text>

      <View style={styles.venueMap}>
        <View style={styles.mapSectionTop}>
          <Text style={styles.areaLabel}>
            {venueType === 'gym'
              ? 'CARDIO / MACHINES'
              : 'BAR / TABLES'}
          </Text>
        </View>

        <View style={styles.mapDivider} />

        <View style={styles.mapSectionBottom}>
          <Text style={styles.areaLabel}>
            {venueType === 'gym'
              ? 'FREE WEIGHTS / CABLES'
              : 'PATIO / SOCIAL'}
          </Text>
        </View>

        {visibleDots.map((dot, index) => (
  <View
    key={index}
    style={[
      styles.personDot,
      {
        top: dot.top as any,
        left: dot.left as any,
      },
    ]}
  />
))}
      
        <View style={styles.youDot}>
          <View style={styles.youInner} />
        </View>
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={styles.smallPurpleDot} />
          <Text style={styles.legendText}>
          People here
          </Text>
        </View>

        <View style={styles.legendItem}>
          <View style={styles.smallYouDot} />
          <Text style={styles.legendText}>
            You
          </Text>
        </View>
      </View>

      <View style={styles.bottom}>
        <Pressable
          style={styles.noticeButton}
          onPress={() =>
            navigation.navigate('Notice', {
              checkinId,
              venueId,
              venueName,
              venueType,
            })
          }
        >
          <Text style={styles.noticeSmall}>
            SOMEONE CAUGHT YOUR ATTENTION?
          </Text>

	{hasIncoming && (
  <Pressable
    style={styles.incomingCard}
    onPress={() =>
      navigation.navigate('Notice', {
        checkinId,
        venueId,
        venueName,
        venueType,
      })
    }
  >
    <View style={styles.incomingNote}>
      <Text style={styles.incomingNoteText}>N</Text>
    </View>

    <View style={styles.incomingCopy}>
      <Text style={styles.incomingEyebrow}>
        SOMEONE NOTICED YOU
      </Text>

      <Text style={styles.incomingTitle}>
        Did someone catch your attention too?
      </Text>
    </View>

    <Text style={styles.incomingArrow}>›</Text>
  </Pressable>
)}

          <Text style={styles.noticeMain}>
            I NOTICED SOMEONE
          </Text>
        </Pressable>

        <Pressable
  style={styles.endCheckinButton}
  onPress={endCheckin}
>
  <Text style={styles.endCheckinText}>
    END CHECK-IN
  </Text>
</Pressable>

        <Text style={styles.footer}>
          Your check-in expires automatically.
        </Text>
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
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  checkedIn: {
    color: '#5427A5',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.1,
  },
  headerText: {
    flex: 1,
    paddingRight: 14,
  },
  venueName: {
    marginTop: 5,
    color: '#29272E',
    fontSize: 27,
    fontWeight: '800',
  },

  countBadge: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#EEE8F8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  countNumber: {
    color: '#5427A5',
    fontWeight: '900',
    fontSize: 20,
  },

  countLabel: {
    color: '#756D80',
    fontSize: 9,
    fontWeight: '700',
  },

  copy: {
    marginTop: 8,
    color: '#918C96',
    fontSize: 14,
  },

  venueMap: {
    flex: 1,
    maxHeight: 430,
    minHeight: 330,
    marginTop: 26,
    borderRadius: 34,
    backgroundColor: '#F0EDF3',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E3DFE6',
  },

  mapSectionTop: {
    flex: 1,
    padding: 20,
  },

  mapSectionBottom: {
    flex: 1,
    padding: 20,
  },

  mapDivider: {
    height: 1,
    backgroundColor: '#DCD7E0',
  },

  areaLabel: {
    color: '#AAA5AE',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },

  personDot: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#7B5AC1',
    borderWidth: 3,
    borderColor: '#E9E2F6',
  },

  youDot: {
    position: 'absolute',
    top: '58%',
    left: '43%',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#5427A5',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#5427A5',
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },

  youInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },

  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginTop: 16,
  },

  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  smallPurpleDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#7B5AC1',
    marginRight: 7,
  },

  smallYouDot: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: '#5427A5',
    marginRight: 7,
  },

  legendText: {
    color: '#85808A',
    fontSize: 11,
  },

  bottom: {
    paddingBottom: 24,
  },

  noticeButton: {
    marginTop: 22,
    minHeight: 82,
    borderRadius: 24,
    backgroundColor: '#5427A5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  noticeSmall: {
    color: 'rgba(255,255,255,.65)',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },

  noticeMain: {
    marginTop: 5,
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0.7,
  },

  footer: {
    marginTop: 12,
    color: '#AAA5AE',
    textAlign: 'center',
    fontSize: 11,
  },
incomingCard: {
  marginTop: 22,
  padding: 16,
  borderRadius: 22,
  backgroundColor: '#EEE8F8',
  borderWidth: 1,
  borderColor: '#D9CDEE',
  flexDirection: 'row',
  alignItems: 'center',
},

incomingNote: {
  width: 44,
  height: 44,
  backgroundColor: '#FFFFFF',
  borderRadius: 7,
  alignItems: 'center',
  justifyContent: 'center',
  transform: [{ rotate: '-5deg' }],
},

incomingNoteText: {
  color: '#5427A5',
  fontSize: 20,
  fontStyle: 'italic',
  fontWeight: '800',
},

incomingCopy: {
  flex: 1,
  marginLeft: 13,
},

incomingEyebrow: {
  color: '#5427A5',
  fontSize: 9,
  fontWeight: '900',
  letterSpacing: 1,
},

incomingTitle: {
  color: '#302D34',
  fontSize: 14,
  fontWeight: '700',
  marginTop: 4,
},

incomingArrow: {
  color: '#5427A5',
  fontSize: 28,
},
headerActions: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 12,
},

notizInbox: {
  width: 46,
  height: 46,
  borderRadius: 23,
  backgroundColor: '#FFFFFF',
  borderWidth: 1,
  borderColor: '#E7E2EA',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
},

notizInboxIcon: {
  color: '#5427A5',
  fontSize: 23,
},

unreadBadge: {
  position: 'absolute',
  top: -5,
  right: -7,
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
endCheckinButton: {
  marginTop: 14,
  alignSelf: 'center',
  paddingHorizontal: 18,
  paddingVertical: 10,
  borderRadius: 16,
  borderWidth: 1,
  borderColor: '#D9D4DE',
  backgroundColor: '#FFFFFF',
},

endCheckinText: {
  color: '#716C76',
  fontSize: 11,
  fontWeight: '900',
  letterSpacing: 0.8,
},
});
