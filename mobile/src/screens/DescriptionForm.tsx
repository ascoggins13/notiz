import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { Field } from '../components/Field';
import { PrimaryButton } from '../components/PrimaryButton';
import { AppearanceDescription } from '../types';

export function DescriptionForm({ title, description, setDescription, buttonTitle, onSubmit, loading }: { title: string; description: AppearanceDescription; setDescription: (v: AppearanceDescription) => void; buttonTitle: string; onSubmit: () => void; loading: boolean }) {
  const set = (key: keyof AppearanceDescription, value: string) => setDescription({ ...description, [key]: value });
  return <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled"><Text style={styles.title}>{title}</Text><Text style={styles.copy}>Use simple lowercase descriptions during testing.</Text><Field label="Gender" value={description.gender} onChangeText={(v) => set('gender', v)} placeholder="woman, man, nonbinary" /><Field label="Shirt color" value={description.shirtColor} onChangeText={(v) => set('shirtColor', v)} /><Field label="Pants color" value={description.pantsColor} onChangeText={(v) => set('pantsColor', v)} /><Field label="Shoe color" value={description.shoeColor} onChangeText={(v) => set('shoeColor', v)} /><Field label="Venue area" value={description.venueArea} onChangeText={(v) => set('venueArea', v)} placeholder="treadmills" /><Field label="Activity" value={description.activity} onChangeText={(v) => set('activity', v)} placeholder="walking, bench press" /><Field label="Unique identifiers (comma separated)" value={description.identifiers.join(', ')} onChangeText={(v) => setDescription({ ...description, identifiers: v.split(',').map(x => x.trim()).filter(Boolean) })} placeholder="glasses, red hat" /><PrimaryButton title={buttonTitle} onPress={onSubmit} loading={loading} /></ScrollView>;
}
const styles = StyleSheet.create({ page: { padding: 24, gap: 16 }, title: { fontSize: 30, fontWeight: '800' }, copy: { fontSize: 15 } });
