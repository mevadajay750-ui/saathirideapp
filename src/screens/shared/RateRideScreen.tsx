import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius } from '@/theme';
import { Button } from '@/components/common';
import { StarRating } from '@/components/profile/StarRating';
import { useSubmitRating } from '@/hooks/useRatings';
import type { RootScreenProps } from '@/navigation/types';

type Props = RootScreenProps<'RateRide'>;

const QUICK_COMMENTS = [
  'Great driver, very punctual',
  'Comfortable ride',
  'Very friendly and helpful',
  'Clean and well-maintained car',
  'Would ride with again!',
];

export default function RateRideScreen({ route, navigation }: Props) {
  const { rideId, rateeId, rateeName } = route.params;

  const [score, setScore] = useState(0);
  const [comment, setComment] = useState('');

  const { mutateAsync: submitRating, isPending } = useSubmitRating();

  const handleQuickComment = useCallback((text: string) => {
    setComment((prev) =>
      prev.includes(text) ? prev.replace(text, '').trim() : `${prev} ${text}`.trim(),
    );
  }, []);

  const handleSubmit = useCallback(async () => {
    if (score === 0) {
      Alert.alert('Select a rating', 'Please tap the stars to rate your ride.');
      return;
    }
    try {
      await submitRating({
        rideId,
        rateeId,
        score,
        comment: comment.trim() || undefined,
      });
      navigation.goBack();
    } catch {
      Alert.alert('Error', 'Could not submit rating. Please try again.');
    }
  }, [score, comment, rideId, rateeId, submitRating, navigation]);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rate your ride</Text>
        <View style={{ width: 48 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.rateWho}>
            <Text style={styles.rateWhoEmoji}>⭐</Text>
            <Text style={styles.rateWhoTitle}>How was your ride with</Text>
            <Text style={styles.rateWhoName}>{rateeName}?</Text>
          </View>

          <View style={styles.starsCard}>
            <StarRating value={score} onChange={setScore} size="lg" showLabel />
            <Text style={styles.starsHint}>Tap a star to rate</Text>
          </View>

          <View style={styles.quickSection}>
            <Text style={styles.quickTitle}>Quick comments</Text>
            <View style={styles.quickChips}>
              {QUICK_COMMENTS.map((text) => {
                const active = comment.includes(text);
                return (
                  <TouchableOpacity
                    key={text}
                    style={[styles.quickChip, active && styles.quickChipActive]}
                    onPress={() => handleQuickComment(text)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.quickChipText, active && styles.quickChipTextActive]}>
                      {active ? '✓ ' : ''}
                      {text}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.commentSection}>
            <Text style={styles.commentLabel}>Add a comment (optional)</Text>
            <TextInput
              style={styles.commentInput}
              value={comment}
              onChangeText={setComment}
              placeholder="Tell others about your experience…"
              placeholderTextColor={Colors.textDisabled}
              multiline
              numberOfLines={3}
              maxLength={200}
              textAlignVertical="top"
            />
            <Text style={styles.commentCount}>{comment.length}/200</Text>
          </View>

          <Button
            label={isPending ? 'Submitting…' : 'Submit rating'}
            onPress={handleSubmit}
            isLoading={isPending}
            disabled={score === 0}
            variant="primary"
            size="lg"
            style={styles.submitBtn}
          />

          <TouchableOpacity style={styles.skipBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.skipText}>Skip for now</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    paddingBottom: Spacing.xl,
  },
  backText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.base,
    color: Colors.white,
    width: 48,
  },
  headerTitle: {
    fontFamily: FontFamily.headingSemiBold,
    fontSize: FontSize.lg,
    color: Colors.white,
  },
  scroll: {
    padding: Spacing.base,
    paddingBottom: Spacing['5xl'],
    gap: Spacing.base,
  },
  rateWho: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    gap: Spacing.xs,
  },
  rateWhoEmoji: { fontSize: 48 },
  rateWhoTitle: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.base,
    color: Colors.textMuted,
  },
  rateWhoName: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.xl,
    color: Colors.textBrand,
  },
  starsCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    borderWidth: 0.5,
    borderColor: Colors.border,
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.md,
  },
  starsHint: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.textDisabled,
  },
  quickSection: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 0.5,
    borderColor: Colors.border,
    padding: Spacing.base,
    gap: Spacing.md,
  },
  quickTitle: {
    fontFamily: FontFamily.headingSemiBold,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  quickChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  quickChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    borderColor: Colors.gray200,
    backgroundColor: Colors.surface,
  },
  quickChipActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  quickChipText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  quickChipTextActive: {
    color: Colors.primaryDeep,
    fontFamily: FontFamily.bodySemiBold,
  },
  commentSection: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 0.5,
    borderColor: Colors.border,
    padding: Spacing.base,
    gap: Spacing.sm,
  },
  commentLabel: {
    fontFamily: FontFamily.headingSemiBold,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  commentInput: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    minHeight: 80,
    textAlignVertical: 'top',
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
  commentCount: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xs,
    color: Colors.textDisabled,
    textAlign: 'right',
  },
  submitBtn: { marginTop: Spacing.sm },
  skipBtn: { alignItems: 'center', paddingVertical: Spacing.md },
  skipText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.base,
    color: Colors.textMuted,
  },
});
