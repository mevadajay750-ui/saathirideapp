import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius, IconSize, Icons } from '@/theme';
import { AppIcon } from '@/components/common/AppIcon';
import { MIN_PRICE_INR, MAX_PRICE_INR } from '@/config/constants';
import { styles } from './styles';

const PRICE_SUGGESTIONS = [100, 150, 200, 250, 300, 400, 500];

interface PriceInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  originCity?: string;
  destinationCity?: string;
}

export function PriceInput({ value, onChange, error }: PriceInputProps) {
  return (
    <View>
      <Text style={styles.label}>Price per seat</Text>

      <View style={[styles.inputWrap, !!error && styles.inputWrapError]}>
        <View style={styles.prefix}>
          <Text style={styles.prefixSymbol}>₹</Text>
        </View>
        <View style={styles.divider} />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={(text) => {
            const digits = text.replace(/\D/g, '');
            onChange(digits);
          }}
          keyboardType="number-pad"
          placeholder="250"
          placeholderTextColor={Colors.textDisabled}
          maxLength={4}
          returnKeyType="done"
        />
        <Text style={styles.perSeat}>per seat</Text>
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Text style={styles.suggestLabel}>Quick select</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
      >
        {PRICE_SUGGESTIONS.map((price) => {
          const isSelected = value === String(price);
          return (
            <TouchableOpacity
              key={price}
              style={[styles.chip, isSelected && styles.chipSelected]}
              onPress={() => onChange(String(price))}
              activeOpacity={0.7}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>₹{price}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.guideline}>
        <AppIcon name={Icons.bulb} size={IconSize.md} color={Colors.accentDark} />
        <Text style={styles.guidelineText}>
          Suggested range: ₹{MIN_PRICE_INR}–₹{MAX_PRICE_INR} per seat. Price is shown to passengers
          upfront — they pay cash directly to you.
        </Text>
      </View>
    </View>
  );
}
