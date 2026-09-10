import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
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

type Props = NativeStackScreenProps<
  RootStackParamList,
  'SelfDescription'
>;

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

const gymTopTypes = [
  'T-shirt',
  'Tank',
  'Long sleeve',
  'Hoodie',
  'Sports bra',
  'Jacket',
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
const gymBottomTypes = [
  'Shorts',
  'Leggings',
  'Joggers',
  'Sweatpants',
  'Track pants',
];
const barBottomTypes = [
  'Jeans',
  'Pants',
  'Shorts',
  'Skirt',
  'Dress',
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

const barAreas = [
  'Main Bar',
  'Patio',
  'Dance Floor',
  'Booth',
  'Upstairs',
  'Outside',
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

const gymIdentifiers = [
  { value: 'headphones', icon: '🎧', label: 'Headphones' },
  { value: 'hat', icon: '🧢', label: 'Hat' },
  { value: 'glasses', icon: '👓', label: 'Glasses' },
  { value: 'water bottle', icon: '🥤', label: 'Bottle' },
  { value: 'watch', icon: '⌚', label: 'Watch' },
  { value: 'tattoo', icon: '✦', label: 'Tattoo' },
];

const barIdentifiers = [
  { value: 'hairstyle', icon: '💇', label: 'Hairstyle' },
  { value: 'facial hair', icon: '🧔', label: 'Facial hair' },
  { value: 'hat', icon: '🧢', label: 'Hat' },
  { value: 'glasses', icon: '👓', label: 'Glasses' },
  { value: 'watch', icon: '⌚', label: 'Watch' },
  { value: 'tattoo', icon: '✦', label: 'Tattoo' },
];

export function SelfDescriptionScreen({
  route,
  navigation,
}: Props) {
  const {
    venueId,
    venueName,
    venueType,
  } = route.params;

  const [shirtColor, setShirtColor] = useState('');
  const [pantsColor, setPantsColor] = useState('');
  const [shoeColor, setShoeColor] = useState('');
  const [shoeType, setShoeType] = useState('');
  const [activity, setActivity] = useState('');
  const [venueArea, setVenueArea] = useState('');
  const [selectedIdentifiers, setSelectedIdentifiers] = useState<string[]>([]);
  const [otherIdentifier, setOtherIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [topType, setTopType] = useState('');
  const [bottomType, setBottomType] = useState('');
  const [selectedJewelry, setSelectedJewelry] = useState<string[]>([]);	

  const areas = venueType === 'gym' ? gymAreas : barAreas;
  const identifiers =
  venueType === 'gym'
    ? gymIdentifiers
    : barIdentifiers;

 const toggleJewelry = (value: string) => {
  setSelectedJewelry((current) =>
    current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value]
  );
};

  const toggleIdentifier = (value: string) => {
    setSelectedIdentifiers((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    );
  };

  const submit = async () => {
if (
  !topType ||
  !shirtColor ||
  !bottomType ||
  !pantsColor ||
  !shoeColor ||
  !venueArea
) {      Alert.alert(
  'Almost there',
  'Choose your top type, top color, bottom type, bottom color, shoes, and current area.'
);
      return;
    }

    if (venueType === 'bar' && !shoeType) {
      Alert.alert(
        'Almost there',
        'Choose your shoe type.'
      );
      return;
    }

    if (venueType === 'gym' && !activity) {
      Alert.alert(
        'What are you working on?',
        'Choose today’s workout.'
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
      ];
      const result = await api<{ id: string }>('/api/checkins', {
        method: 'POST',
        body: JSON.stringify({
          venueId,
          venueName,
          venueType,
        }),
      });
      
      const checkinId = result.id;

      await api(`/api/checkins/${checkinId}/self-description`, {
        method: 'PUT',
        body: JSON.stringify({
          shirtColor,
          pantsColor,
          shoeType:
  venueType === 'bar'
    ? shoeType
    : undefined,
shoeColor,
topType,
bottomType,
          jewelry: selectedJewelry,	
          identifiers: finalIdentifiers,
          venueArea,
          activity:
            venueType === 'gym'
              ? activity
              : undefined,
        }),
      });

      navigation.replace('ActiveVenue', {
  checkinId,
  venueId,
  venueName,
  venueType,
});
    } catch (e) {
      Alert.alert(
        'Could not check in',
        e instanceof Error ? e.message : 'Unknown error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.page}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
        <Text style={styles.eyebrow}>
          {venueName.toUpperCase()}
        </Text>

        <Text style={styles.title}>What do you look like today?</Text>

        <Text style={styles.copy}>
          This helps someone who noticed you find the right person.
        </Text>
	
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
    Optional — select anything you’re wearing today.
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
            title="What are you working on?"
            options={gymActivities}
            selected={activity}
            onSelect={setActivity}
          />
        )}

        <OptionSection
          title="Where are you?"
          options={areas}
          selected={venueArea}
          onSelect={setVenueArea}
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Anything noticeable?
          </Text>

          <Text style={styles.helper}>
            Optional — choose anything that makes you easier to identify.
          </Text>

          <View style={styles.identifierGrid}>
            {identifiers.map((item) => {
              const selected =
                selectedIdentifiers.includes(item.value);

              return (
                <Pressable
                  key={item.value}
                  style={[
                    styles.identifierCard,
                    selected && styles.identifierSelected,
                  ]}
                  onPress={() =>
                    toggleIdentifier(item.value)
                  }
                >
                  <Text style={styles.identifierIcon}>
                    {item.icon}
                  </Text>

                  <Text
                    style={[
                      styles.identifierLabel,
                      selected &&
                        styles.identifierLabelSelected,
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
            placeholder="Something else? Purple bottle, Tigers hat..."
            placeholderTextColor="#AAA6AF"
            style={styles.otherInput}
          />
        </View>

        <Pressable
          style={[
            styles.submitButton,
            loading && styles.disabled,
          ]}
          disabled={loading}
          onPress={submit}
        >
          <Text style={styles.submitText}>
            {loading ? 'CHECKING IN...' : 'CHECK IN'}
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
                    borderWidth:
                      color.name === 'white' ? 1 : 0,
                    borderColor: '#DDD9E1',
                  },
                ]}
              />
            </Pressable>
          );
        })}
      </View>

      {selected ? (
        <Text style={styles.selectionText}>
          {selected.charAt(0).toUpperCase() +
            selected.slice(1)}
        </Text>
      ) : null}
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
    lineHeight: 39,
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

  selectionText: {
    marginTop: 8,
    color: '#5427A5',
    fontSize: 12,
    fontWeight: '700',
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

  submitButton: {
    height: 60,
    backgroundColor: '#5427A5',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 38,
  },

  disabled: {
    opacity: 0.5,
  },

  submitText: {
    color: '#FFFFFF',
    fontSize: 16,
    letterSpacing: 1,
    fontWeight: '800',
  },
});
