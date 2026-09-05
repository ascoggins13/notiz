import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
export function Field({ label, ...props }: TextInputProps & { label: string }) {
  return <View style={styles.wrap}><Text style={styles.label}>{label}</Text><TextInput {...props} style={styles.input} placeholderTextColor="#777" /></View>;
}
const styles = StyleSheet.create({ wrap: { gap: 6 }, label: { fontWeight: '600', fontSize: 14 }, input: { borderWidth: 1, borderColor: '#bbb', borderRadius: 12, padding: 14, fontSize: 16 } });
