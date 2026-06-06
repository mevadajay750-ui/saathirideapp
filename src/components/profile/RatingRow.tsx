import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { format, parseISO } from 'date-fns';
import { Colors, FontFamily, FontSize, Spacing } from '@/theme';
import { Rating } from '@/types';
import { StarRating } from './StarRating';

interface Props {
  rating: Rating;
}

export function RatingRow({ rating }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.top}>
        <StarRating value={rating.score} size="sm" readonly />
        <Text style={styles.date}>{format(parseISO(rating.createdAt), 'dd MMM yyyy')}</Text>
      </View>
      {rating.comment ? (
        <Text style={styles.comment}>{`\u201C${rating.comment}\u201D`}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingVertical: Spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.divider,
    gap: Spacing.xs,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  date: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xs,
    color: Colors.textDisabled,
  },
  comment: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: FontSize.sm * 1.6,
  },
});
