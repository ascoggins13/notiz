import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { RootStackParamList } from '../types';
type Props = NativeStackScreenProps<RootStackParamList, 'Waiting'>;
export function WaitingScreen({ navigation }: Props) { return <View style={styles.page}><Text style={styles.title}>Notice sent.</Text><Text style={styles.copy}>Nothing is revealed unless you independently notice each other.</Text><PrimaryButton title="Check matches" onPress={() => navigation.navigate('Matches')} /><PrimaryButton title="Back home" onPress={() => navigation.navigate('Home')} /></View>; }
const styles = StyleSheet.create({ page: { flex: 1, justifyContent: 'center', padding: 24, gap: 20 }, title: { fontSize: 36, fontWeight: '800' }, copy: { fontSize: 18, lineHeight: 26 } });
