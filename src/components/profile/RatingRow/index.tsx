import React from 'react';
import { View, Text } from 'react-native';
import { format, parseISO } from 'date-fns';
import { Colors, FontFamily, FontSize, Spacing } from '@/theme';
import { Rating } from '@/types';
import { StarRating } from '../StarRating';
import { styles } from './styles';

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
