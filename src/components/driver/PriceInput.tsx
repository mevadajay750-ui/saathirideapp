import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius, IconSize, Icons } from '@/theme';
import { AppIcon } from '@/components/common/AppIcon';
import { MIN_PRICE_INR, MAX_PRICE_INR } from '@/config/constants';

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
          Suggested range: ₹{MIN_PRICE_INR}–₹{MAX_PRICE_INR} per seat. Price is shown to
          passengers upfront — they pay cash directly to you.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface,
    minHeight: 56,
    overflow: 'hidden',
  },
  inputWrapError: {
    borderColor: Colors.error,
  },
  prefix: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.gray50,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
  prefixSymbol: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.xl,
    color: Colors.primaryDeep,
  },
  divider: {
    width: 1,
    height: 28,
    backgroundColor: Colors.border,
  },
  input: {
    flex: 1,
    fontFamily: FontFamily.heading,
    fontSize: FontSize.xl,
    color: Colors.primaryDeep,
    paddingHorizontal: Spacing.base,
    letterSpacing: 1,
  },
  perSeat: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    paddingRight: Spacing.base,
  },
  errorText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xs,
    color: Colors.error,
    marginTop: Spacing.xs,
  },
  suggestLabel: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  chips: {
    gap: Spacing.sm,
    paddingRight: Spacing.base,
  },
  chip: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.gray100,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  chipSelected: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  chipText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  chipTextSelected: {
    color: Colors.primaryDeep,
    fontFamily: FontFamily.bodySemiBold,
  },
  guideline: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    marginTop: Spacing.md,
    padding: Spacing.base,
    backgroundColor: Colors.accentLight,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#FDCFA4',
  },
  guidelineText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xs,
    color: Colors.accentDark,
    lineHeight: FontSize.xs * 1.7,
  },
});
