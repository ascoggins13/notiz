import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useRef, useState } from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { api } from '../services/api';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Notice'>;

const colors = [
  { name: 'black', value: '#222222' },
  { name: 'white', value: '#FFFFFF' },
  { name: 'gray', value: '#9A9A9A' },
  { name: 'blue', value: '#3E6DB5' },
  { name: 'red', value: '#C84C4C' },
  { name: 'green', value: '#4D8A64' },
  { name: 'purple', value: '#704BB5' },
  { name: 'yellow', value: '#D6B94C' },
  { name: 'orange', value: '#D98543' },
  { name: 'brown', value: '#795548' },
];

const genderOptions = ['Man', 'Woman', 'Nonbinary'];

const gymTopTypes = [
  'T-shirt',
  'Tank',
  'Long sleeve',
  'Hoodie',
  'Sports bra',
  'Jacket',
];

const gymBottomTypes = [
  'Shorts',
  'Leggings',
  'Joggers',
  'Sweatpants',
  'Track pants',
];

const barTopTypes = [
  'T-shirt',
  'Polo',
  'Button-up',
  'Blouse',
  'Tank top',
  'Sweater',
  'Hoodie',
  'Jacket',
  'Dress',
  'Other',
];

const barBottomTypes = [
  'Jeans',
  'Pants',
  'Shorts',
  'Skirt',
  'Dress',
  'Other',
];

const barShoeTypes = [
  'Sneakers',
  'Heels',
  'Boots',
  'Loafers',
  'Flats',
  'Sandals',
  'Dress shoes',
  'Other',
];

const jewelryOptions = [
  'Watch',
  'Smartwatch',
  'Necklace',
  'Chain',
  'Bracelet',
  'Earrings',
  'Ring',
];
const gymActivities = [
  'Chest',
  'Back',
  'Legs',
  'Arms',
  'Shoulders',
  'Cardio',
  'Full Body',
];

const gymAreas = [
  'Free Weights',
  'Machines',
  'Cables',
  'Cardio',
  'Stretching',
  'Studio',
];

const barAreas = [
  'Main Bar',
  'Patio',
  'Dance Floor',
  'Booth',
  'Upstairs',
  'Outside',
];

const gymIdentifiers = [
  { value: 'headphones', icon: '🎧', label: 'Headphones' },
  { value: 'hat', icon: '🧢', label: 'Hat' },
  { value: 'glasses', icon: '👓', label: 'Glasses' },
  { value: 'water bottle', icon: '🥤', label: 'Bottle' },
  { value: 'tattoo', icon: '✦', label: 'Tattoo' },
];

const barIdentifiers = [
  { value: 'hairstyle', icon: '💇', label: 'Hairstyle' },
  { value: 'facial hair', icon: '🧔', label: 'Facial hair' },
  { value: 'hat', icon: '🧢', label: 'Hat' },
  { value: 'glasses', icon: '👓', label: 'Glasses' },
  { value: 'tattoo', icon: '✦', label: 'Tattoo' },
];

export function NoticeScreen({ route, navigation }: Props) {
  const {
    checkinId,
    venueId,
    venueName,
    venueType,
  } = route.params;

  const scrollRef = useRef<ScrollView>(null);


const [gender, setGender] = useState('');

const [topType, setTopType] = useState('');
const [shirtColor, setShirtColor] = useState('');

const [bottomType, setBottomType] = useState('');
const [pantsColor, setPantsColor] = useState('');

const [shoeType, setShoeType] = useState('');
const [shoeColor, setShoeColor] = useState('');

const [selectedJewelry, setSelectedJewelry] = useState<string[]>([]);

const [activity, setActivity] = useState('');
const [venueArea, setVenueArea] = useState('');

const [selectedIdentifiers, setSelectedIdentifiers] =
  useState<string[]>([]);

const [otherIdentifier, setOtherIdentifier] = useState('');

const [loading, setLoading] = useState(false);
const [needsClarification, setNeedsClarification] = useState(false);

const [clarificationNoticeId, setClarificationNoticeId] =
  useState<string | null>(null);

const [clarificationText, setClarificationText] =
  useState('');
  const areas = venueType === 'gym' ? gymAreas : barAreas;
  const identifiers =
  venueType === 'gym'
    ? gymIdentifiers
    : barIdentifiers;

  const toggleIdentifier = (value: string) => {
    setSelectedIdentifiers((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    );
  };
const toggleJewelry = (value: string) => {
  setSelectedJewelry((current) =>
    current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value]
  );
};

  const submit = async () => {
if (
  !gender ||
  !topType ||
  !shirtColor ||
  !bottomType ||
  !pantsColor ||
  !shoeColor ||
  !venueArea
) {      Alert.alert(
  'Almost there',
  'Choose their gender, top type, top color, bottom type, bottom color, shoes, and where you noticed them.'
);
      return;
    }

    if (venueType === 'bar' && !shoeType) {
      Alert.alert(
        'Almost there',
        'Choose their shoe type.'
      );
      return;
    }

    try {
      setLoading(true);

      const finalIdentifiers = [
        ...selectedIdentifiers,
        ...(otherIdentifier.trim() ? [otherIdentifier.trim()] : []),
      ];

      const result = await api<{
        id: string;
        status: string;
        matchId?: string;
        candidateCount?: number;
      }>('/api/notices', {
        method: 'POST',
        body: JSON.stringify({
          checkinId,
targetDescription: {
  gender: gender.toLowerCase(),

  topType,
  shirtColor,

  bottomType,
  pantsColor,

  shoeType:
  venueType === 'bar'
    ? shoeType
    : undefined,

shoeColor,

  jewelry: selectedJewelry,

  identifiers: finalIdentifiers,

  venueArea,

  activity:
    venueType === 'gym'
      ? activity
      : undefined,
},        }),
      });

      if (result.status === 'needs_clarification') {
        setClarificationNoticeId(result.id);
        setNeedsClarification(true);
        return;
      }

      if (result.status === 'mutual' && result.matchId) {
        navigation.replace('MatchDetail', {
          matchId: result.matchId,
        });
        return;
      }

      navigation.replace('NotizSent', {
        checkinId,
        venueId,
        venueName,
        venueType,
      });
    } catch (e) {
      Alert.alert(
        'Could not send Notiz',
        e instanceof Error ? e.message : 'Unknown error'
      );
    } finally {
      setLoading(false);
    }
  };

  const submitClarification = async () => {
    if (!clarificationNoticeId) return;
  
    const clue = clarificationText.trim();
  
    if (!clue) {
      Alert.alert(
        'One more clue',
        'Add one detail you remember about them.'
      );
      return;
    }
  
    try {
      setLoading(true);
  
      const finalIdentifiers = [
        ...selectedIdentifiers,
        ...(otherIdentifier.trim()
          ? [otherIdentifier.trim()]
          : []),
        clue,
      ];
  
      const result = await api<{
        id: string;
        status: string;
        matchId?: string;
        candidateCount?: number;
      }>(
        `/api/notices/${clarificationNoticeId}/refine`,
        {
          method: 'POST',
          body: JSON.stringify({
            targetDescription: {
              gender: gender.toLowerCase(),
  
              topType,
              shirtColor,
  
              bottomType,
              pantsColor,
  
              shoeColor,
  
              jewelry: selectedJewelry,
  
              identifiers: finalIdentifiers,
  
              venueArea,
  
              activity:
                venueType === 'gym'
                  ? activity
                  : undefined,
            },
          }),
        }
      );
  
      if (result.status === 'needs_clarification') {
        setClarificationText('');
  
        Alert.alert(
          'Still a little close',
          'Add one more detail so we send your Notiz to the right person.'
        );
  
        return;
      }
  
      if (result.status === 'mutual' && result.matchId) {
        navigation.replace('MatchDetail', {
          matchId: result.matchId,
        });
  
        return;
      }
  
      if (result.status === 'candidate_found') {
        navigation.replace('NotizSent', {
          checkinId,
          venueId,
          venueName,
          venueType,
        });
  
        return;
      }
  
      Alert.alert(
        'Still looking',
        'We could not confidently identify them yet.'
      );
    } catch (e) {
      Alert.alert(
        'Could not update Notiz',
        e instanceof Error ? e.message : 'Unknown error'
      );
    } finally {
      setLoading(false);
    }
  };

  if (needsClarification) {
    return (
      <SafeAreaView style={styles.page}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.clarificationPage}>
          <View style={styles.clueIcon}>
            <Text style={styles.clueIconText}>?</Text>
          </View>
  
          <Text style={styles.clarificationEyebrow}>
            ONE MORE CLUE
          </Text>
  
          <Text style={styles.clarificationTitle}>
            We found more than one possible match.
          </Text>
  
          <Text style={styles.clarificationCopy}>
            What else do you remember about them?
          </Text>
  
          <TextInput
            value={clarificationText}
            onChangeText={setClarificationText}
            placeholder="Tigers hat, sleeve tattoo, red gym bag..."
            placeholderTextColor="#AAA6AF"
            style={styles.clarificationInput}
            autoFocus
          />
  
          <Pressable
            style={[
              styles.sendButton,
              loading && styles.disabled,
            ]}
            disabled={loading}
            onPress={submitClarification}
          >
            <Text style={styles.sendSmall}>
              HELP US NARROW IT DOWN
            </Text>
  
            <Text style={styles.sendText}>
              {loading ? 'CHECKING...' : 'ADD CLUE'}
            </Text>
          </Pressable>
          </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
  return (
    <SafeAreaView style={styles.page}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
        <Text style={styles.eyebrow}>{venueName.toUpperCase()}</Text>

        <Text style={styles.title}>Who did you notice?</Text>

        <Text style={styles.copy}>
          Describe the person who caught your attention.
        </Text>

        <OptionSection
          title="Gender"
          options={genderOptions}
          selected={gender}
          onSelect={setGender}
        />
       
       <OptionSection
  title="Top type"
  options={
    venueType === 'gym'
      ? gymTopTypes
      : barTopTypes
  }
  selected={topType}
  onSelect={setTopType}
/>

        <ColorSection
          title="Top"
          selected={shirtColor}
          onSelect={setShirtColor}
        />
<OptionSection
  title="Bottom type"
  options={
    venueType === 'gym'
      ? gymBottomTypes
      : barBottomTypes
  }
  selected={bottomType}
  onSelect={setBottomType}
/>


        <ColorSection
          title="Bottom"
          selected={pantsColor}
          onSelect={setPantsColor}
        />
        {venueType === 'bar' && (
  <OptionSection
    title="Shoe type"
    options={barShoeTypes}
    selected={shoeType}
    onSelect={setShoeType}
  />
)}

        <ColorSection
          title="Shoes"
          selected={shoeColor}
          onSelect={setShoeColor}
        />

	<View style={styles.section}>
  <Text style={styles.sectionTitle}>Jewelry</Text>

  <Text style={styles.helper}>
    Optional — select anything you noticed them wearing.
  </Text>

  <View style={styles.optionWrap}>
    {jewelryOptions.map((item) => {
      const active = selectedJewelry.includes(item);

      return (
        <Pressable
          key={item}
          style={[
            styles.option,
            active && styles.optionSelected,
          ]}
          onPress={() => toggleJewelry(item)}
        >
          <Text
            style={[
              styles.optionText,
              active && styles.optionTextSelected,
            ]}
          >
            {item}
          </Text>
        </Pressable>
      );
    })}
  </View>
</View>

        {venueType === 'gym' && (
          <OptionSection
            title="What were they working on?"
            options={gymActivities}
            selected={activity}
            onSelect={setActivity}
          />
        )}

        <OptionSection
          title="Where did you notice them?"
          options={areas}
          selected={venueArea}
          onSelect={setVenueArea}
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Anything stand out?</Text>

          <Text style={styles.helper}>
            Optional — add something unique that you remember.
          </Text>

          <View style={styles.identifierGrid}>
            {identifiers.map((item) => {
              const selected = selectedIdentifiers.includes(item.value);

              return (
                <Pressable
                  key={item.value}
                  style={[
                    styles.identifierCard,
                    selected && styles.identifierSelected,
                  ]}
                  onPress={() => toggleIdentifier(item.value)}
                >
                  <Text style={styles.identifierIcon}>{item.icon}</Text>
                  <Text
                    style={[
                      styles.identifierLabel,
                      selected && styles.identifierLabelSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <TextInput
  value={otherIdentifier}
  onChangeText={setOtherIdentifier}
  placeholder="Purple bottle, Tigers hat..."
  placeholderTextColor="#AAA6AF"
  style={styles.otherInput}
  onFocus={() => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({
        animated: true,
      });
    }, 250);
  }}
/>
        </View>

        <Pressable
          style={[styles.sendButton, loading && styles.disabled]}
          disabled={loading}
          onPress={submit}
        >
          <Text style={styles.sendSmall}>READY?</Text>
          <Text style={styles.sendText}>
            {loading ? 'SENDING...' : 'SEND NOTIZ'}
          </Text>
        </Pressable>
        </ScrollView>
    </KeyboardAvoidingView>
  </SafeAreaView>
);
}

function ColorSection({
  title,
  selected,
  onSelect,
}: {
  title: string;
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>

      <View style={styles.colorRow}>
        {colors.map((color) => {
          const active = selected === color.name;

          return (
            <Pressable
              key={color.name}
              onPress={() => onSelect(color.name)}
              style={[
                styles.colorOuter,
                active && styles.colorOuterActive,
              ]}
            >
              <View
                style={[
                  styles.colorCircle,
                  {
                    backgroundColor: color.value,
                    borderWidth: color.name === 'white' ? 1 : 0,
                    borderColor: '#DDD9E1',
                  },
                ]}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function OptionSection({
  title,
  options,
  selected,
  onSelect,
}: {
  title: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>

      <View style={styles.optionWrap}>
        {options.map((option) => {
          const active = selected === option;

          return (
            <Pressable
              key={option}
              style={[
                styles.option,
                active && styles.optionSelected,
              ]}
              onPress={() => onSelect(option)}
            >
              <Text
                style={[
                  styles.optionText,
                  active && styles.optionTextSelected,
                ]}
              >
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#FAFAFC',
  },
  keyboardView: {
    flex: 1,
  },

  content: {
    padding: 24,
    paddingBottom: 50,
  },

  eyebrow: {
    color: '#5427A5',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.3,
  },

  title: {
    marginTop: 8,
    fontSize: 32,
    fontWeight: '800',
    color: '#29272E',
  },

  copy: {
    marginTop: 8,
    color: '#85808A',
    fontSize: 15,
    lineHeight: 22,
  },

  section: {
    marginTop: 30,
  },

  sectionTitle: {
    color: '#302D34',
    fontSize: 18,
    fontWeight: '800',
  },

  helper: {
    color: '#918C96',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 5,
  },

  colorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 14,
  },

  colorOuter: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },

  colorOuterActive: {
    borderWidth: 2,
    borderColor: '#5427A5',
  },

  colorCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },

  optionWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
    marginTop: 14,
  },

  option: {
    paddingHorizontal: 15,
    paddingVertical: 11,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E4EA',
  },

  optionSelected: {
    backgroundColor: '#EEE8F8',
    borderColor: '#5427A5',
  },

  optionText: {
    color: '#65616A',
    fontSize: 14,
    fontWeight: '600',
  },

  optionTextSelected: {
    color: '#5427A5',
  },

  identifierGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 14,
  },

  identifierCard: {
    width: '30%',
    minHeight: 80,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E9E6EC',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },

  identifierSelected: {
    borderColor: '#5427A5',
    backgroundColor: '#EEE8F8',
  },

  identifierIcon: {
    fontSize: 24,
  },

  identifierLabel: {
    marginTop: 6,
    fontSize: 11,
    color: '#716C76',
    fontWeight: '600',
  },

  identifierLabelSelected: {
    color: '#5427A5',
  },

  otherInput: {
    marginTop: 14,
    height: 54,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E4EA',
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#29272E',
  },

  sendButton: {
    minHeight: 72,
    backgroundColor: '#5427A5',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 38,
  },

  sendSmall: {
    color: 'rgba(255,255,255,.6)',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },

  sendText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0.7,
    marginTop: 4,
  },

  disabled: {
    opacity: 0.5,
  },
  clarificationPage: {
    flex: 1,
    padding: 28,
    justifyContent: 'center',
  },
  
  clueIcon: {
    alignSelf: 'center',
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: '#EEE8F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  clueIconText: {
    color: '#5427A5',
    fontSize: 34,
    fontWeight: '900',
  },
  
  clarificationEyebrow: {
    marginTop: 28,
    color: '#5427A5',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.4,
    textAlign: 'center',
  },
  
  clarificationTitle: {
    marginTop: 10,
    color: '#29272E',
    fontSize: 29,
    lineHeight: 36,
    fontWeight: '800',
    textAlign: 'center',
  },
  
  clarificationCopy: {
    marginTop: 10,
    color: '#85808A',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  
  clarificationInput: {
    marginTop: 30,
    height: 58,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DED8E4',
    paddingHorizontal: 17,
    fontSize: 15,
    color: '#29272E',
  },
});
