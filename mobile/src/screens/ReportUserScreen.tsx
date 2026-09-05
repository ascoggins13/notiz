import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { api } from '../services/api';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'ReportUser'
>;

const reasons = [
  {
    value: 'harassment',
    label: 'Harassment',
  },
  {
    value: 'inappropriate_behavior',
    label: 'Inappropriate behavior',
  },
  {
    value: 'fake_or_spam',
    label: 'Fake or spam account',
  },
  {
    value: 'safety_concern',
    label: 'Safety concern',
  },
  {
    value: 'other',
    label: 'Other',
  },
];

export function ReportUserScreen({
  route,
  navigation,
}: Props) {
  const {
    userId,
    displayName,
    matchId,
  } = route.params;

  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submitReport = async (
    shouldBlock: boolean
  ) => {
    if (!reason || submitting) return;

    try {
      setSubmitting(true);

      await api('/api/users/report', {
        method: 'POST',
        body: JSON.stringify({
          userId,
          matchId,
          reason,
          details,
        }),
      });

      if (shouldBlock) {
        await api('/api/users/block', {
          method: 'POST',
          body: JSON.stringify({
            userId,
          }),
        });
      }

      Alert.alert(
        'Report received',
        shouldBlock
          ? `${displayName} has been reported and blocked.`
          : 'Thank you. Your report has been submitted.',
        [
          {
            text: 'OK',
            onPress: () => {
              if (shouldBlock) {
                navigation.popToTop();
              } else {
                navigation.goBack();
              }
            },
          },
        ]
      );
    } catch (e) {
      Alert.alert(
        'Could not submit report',
        e instanceof Error
          ? e.message
          : 'Unknown error'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.page}>
      <Text style={styles.eyebrow}>
        PRIVACY & SAFETY
      </Text>

      <Text style={styles.title}>
        Report {displayName}
      </Text>

      <Text style={styles.copy}>
        Tell us what happened. Reports help us keep
        Notiz comfortable and safe.
      </Text>

      <View style={styles.reasons}>
        {reasons.map((item) => {
          const selected =
            reason === item.value;

          return (
            <Pressable
              key={item.value}
              style={[
                styles.reason,
                selected &&
                  styles.reasonSelected,
              ]}
              onPress={() =>
                setReason(item.value)
              }
            >
              <View
                style={[
                  styles.radio,
                  selected &&
                    styles.radioSelected,
                ]}
              >
                {selected && (
                  <View
                    style={styles.radioInner}
                  />
                )}
              </View>

              <Text style={styles.reasonText}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.detailsLabel}>
        ADD DETAILS (OPTIONAL)
      </Text>

      <TextInput
        style={styles.details}
        value={details}
        onChangeText={setDetails}
        placeholder="Anything else we should know?"
        placeholderTextColor="#AAA4AE"
        multiline
        maxLength={1000}
        textAlignVertical="top"
      />

      <View style={styles.actions}>
        <Pressable
          style={[
            styles.primaryButton,
            (!reason || submitting) &&
              styles.disabled,
          ]}
          disabled={!reason || submitting}
          onPress={() => submitReport(true)}
        >
          <Text style={styles.primaryText}>
            REPORT & BLOCK
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.reportButton,
            (!reason || submitting) &&
              styles.disabled,
          ]}
          disabled={!reason || submitting}
          onPress={() => submitReport(false)}
        >
          <Text style={styles.reportText}>
            REPORT ONLY
          </Text>
        </Pressable>

        <Pressable
          style={styles.cancelButton}
          disabled={submitting}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelText}>
            CANCEL
          </Text>
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

  eyebrow: {
    marginTop: 20,
    color: '#5427A5',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.3,
  },

  title: {
    marginTop: 8,
    fontSize: 30,
    fontWeight: '900',
    color: '#29272E',
  },

  copy: {
    marginTop: 8,
    color: '#89848E',
    fontSize: 14,
    lineHeight: 21,
  },

  reasons: {
    marginTop: 24,
    gap: 10,
  },

  reason: {
    minHeight: 58,
    borderWidth: 1,
    borderColor: '#E8E4EB',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },

  reasonSelected: {
    borderColor: '#5427A5',
  },

  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#C5C0C9',
    alignItems: 'center',
    justifyContent: 'center',
  },

  radioSelected: {
    borderColor: '#5427A5',
  },

  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#5427A5',
  },

  reasonText: {
    marginLeft: 12,
    color: '#29272E',
    fontSize: 15,
    fontWeight: '700',
  },

  detailsLabel: {
    marginTop: 24,
    marginBottom: 8,
    color: '#918C96',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },

  details: {
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#E8E4EB',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    padding: 14,
    fontSize: 14,
    color: '#29272E',
  },

  actions: {
    marginTop: 'auto',
    paddingBottom: 24,
    gap: 8,
  },

  primaryButton: {
    minHeight: 56,
    borderRadius: 18,
    backgroundColor: '#5427A5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  primaryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  reportButton: {
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },

  reportText: {
    color: '#5427A5',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.7,
  },

  cancelButton: {
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelText: {
    color: '#99939D',
    fontSize: 11,
    fontWeight: '800',
  },

  disabled: {
    opacity: 0.4,
  },
});
