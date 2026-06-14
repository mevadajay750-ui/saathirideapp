import React, { forwardRef } from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius, IconSize } from '@/theme';
import { AppIcon } from '@/components/common/AppIcon';

interface PhoneInputProps extends Omit<TextInputProps, 'keyboardType'> {
  error?: string;
  containerStyle?: ViewStyle;
}

export const PhoneInput = forwardRef<TextInput, PhoneInputProps>(
  ({ error, containerStyle, ...props }, ref) => {
    return (
      <View style={containerStyle}>
        <View style={[styles.wrapper, !!error && styles.errored]}>
          <View style={styles.prefix}>
            <AppIcon name="call-outline" size={IconSize.sm} color={Colors.textSecondary} />
            <Text style={styles.prefixText}>+91</Text>
            <View style={styles.prefixDivider} />
          </View>

          <TextInput
            ref={ref}
            style={styles.input}
            keyboardType="phone-pad"
            maxLength={10}
            placeholder="98765 43210"
            placeholderTextColor={Colors.textDisabled}
            returnKeyType="done"
            textContentType="telephoneNumber"
            autoComplete="tel"
            {...props}
          />
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
    );
  },
);

PhoneInput.displayName = 'PhoneInput';

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface,
    minHeight: 56,
    overflow: 'hidden',
  },
  errored: {
    borderColor: Colors.error,
  },
  prefix: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.gray50,
    alignSelf: 'stretch',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  prefixText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  prefixDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.border,
    marginLeft: Spacing.xs,
  },
  input: {
    flex: 1,
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    letterSpacing: 2,
  },
  errorText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xs,
    color: Colors.error,
    marginTop: Spacing.xs,
    marginLeft: Spacing.xs,
  },
});
