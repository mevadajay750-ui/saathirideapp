import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius, IconSize, Icons } from '@/theme';
import { AppIcon, Button, ScreenWrapper } from '@/components/common';
import { StarRating } from '@/components/profile/StarRating';
import { useSubmitRating } from '@/hooks/useRatings';
import type { RootScreenProps } from '@/navigation/types';
import { styles } from './styles';

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
    <ScreenWrapper statusBar="brand" contentStyle={styles.safe}>
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
            <AppIcon name={Icons.star} size={IconSize['2xl']} color={Colors.accent} />
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
                    <View style={styles.quickChipContent}>
                      {active && (
                        <AppIcon name={Icons.check} size={IconSize.sm} color={Colors.primaryDeep} />
                      )}
                      <Text style={[styles.quickChipText, active && styles.quickChipTextActive]}>
                        {text}
                      </Text>
                    </View>
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
    </ScreenWrapper>
  );
}
