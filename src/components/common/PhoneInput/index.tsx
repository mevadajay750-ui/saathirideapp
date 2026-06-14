import React, { forwardRef } from 'react';
import { View, Text, TextInput, TextInputProps, ViewStyle } from 'react-native';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius, IconSize } from '@/theme';
import { AppIcon } from '@/components/common/AppIcon';
import { styles } from './styles';

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
