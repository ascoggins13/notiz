import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
export function PrimaryButton({ title, onPress, loading = false, disabled = false }: { title: string; onPress: () => void; loading?: boolean; disabled?: boolean }) {
  return <Pressable disabled={disabled || loading} onPress={onPress} style={({ pressed }) => [styles.button, pressed && styles.pressed, (disabled || loading) && styles.disabled]}>{loading ? <ActivityIndicator color="white" /> : <Text style={styles.text}>{title}</Text>}</Pressable>;
}
const styles = StyleSheet.create({ button: { backgroundColor: '#111', borderRadius: 14, padding: 16, alignItems: 'center' }, pressed: { opacity: .8 }, disabled: { opacity: .45 }, text: { color: 'white', fontSize: 16, fontWeight: '700' } });
