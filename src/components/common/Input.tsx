import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ViewStyle,
  TextInputProps,
} from 'react-native';
import {
  Colors,
  FontFamily,
  FontSize,
  Spacing,
  BorderRadius,
  LineHeight,
} from '@/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  containerStyle?: ViewStyle;
}

export function Input({
  label,
  error,
  hint,
  prefix,
  suffix,
  containerStyle,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.focused,
          !!error && styles.errored,
          props.editable === false && styles.readOnly,
        ]}
      >
        {prefix && <View style={styles.prefix}>{prefix}</View>}

        <TextInput
          style={styles.input}
          placeholderTextColor={Colors.textDisabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {suffix && <View style={styles.suffix}>{suffix}</View>}
      </View>

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : hint ? (
        <Text style={styles.hintText}>{hint}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.base,
  },
  label: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    lineHeight: FontSize.sm * LineHeight.normal,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.base,
    minHeight: 52,
  },
  focused: {
    borderColor: Colors.borderFocus,
  },
  errored: {
    borderColor: Colors.error,
    backgroundColor: Colors.errorLight,
  },
  readOnly: {
    backgroundColor: Colors.gray100,
    borderColor: Colors.gray200,
  },
  prefix: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    paddingVertical: Spacing.md,
  },
  suffix: {
    marginLeft: Spacing.sm,
  },
  errorText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xs,
    color: Colors.error,
    marginTop: Spacing.xs,
    lineHeight: FontSize.xs * LineHeight.relaxed,
  },
  hintText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
    lineHeight: FontSize.xs * LineHeight.relaxed,
  },
});
