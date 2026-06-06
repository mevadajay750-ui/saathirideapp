import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  Pressable,
  Platform,
} from 'react-native';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius } from '@/theme';

const OTP_LENGTH = 6;

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  disabled?: boolean;
}

export function OTPInput({ value, onChange, error, disabled }: OTPInputProps) {
  const inputs = useRef<(TextInput | null)[]>([]);
  const [focused, setFocused] = useState<number>(-1);

  const digits = value.split('').concat(Array(OTP_LENGTH).fill('')).slice(0, OTP_LENGTH);

  const focusNext = useCallback((index: number) => {
    const next = index + 1;
    if (next < OTP_LENGTH) {
      inputs.current[next]?.focus();
    }
  }, []);

  const focusPrev = useCallback((index: number) => {
    const prev = index - 1;
    if (prev >= 0) {
      inputs.current[prev]?.focus();
    }
  }, []);

  const handleChange = useCallback(
    (text: string, index: number) => {
      if (text.length > 1) {
        const cleaned = text.replace(/\D/g, '').slice(0, OTP_LENGTH);
        onChange(cleaned);
        const lastIndex = Math.min(cleaned.length, OTP_LENGTH - 1);
        inputs.current[lastIndex]?.focus();
        return;
      }

      const digit = text.replace(/\D/g, '');
      const newDigits = [...digits];
      newDigits[index] = digit;
      const newValue = newDigits.join('').slice(0, OTP_LENGTH);
      onChange(newValue);

      if (digit) {
        focusNext(index);
      }
    },
    [digits, onChange, focusNext],
  );

  const handleKeyPress = useCallback(
    (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
      if (e.nativeEvent.key === 'Backspace' && !digits[index]) {
        focusPrev(index);
        const newDigits = [...digits];
        newDigits[index - 1] = '';
        onChange(newDigits.join(''));
      }
    },
    [digits, onChange, focusPrev],
  );

  return (
    <View style={styles.container}>
      {Array.from({ length: OTP_LENGTH }).map((_, index) => (
        <Pressable
          key={index}
          onPress={() => inputs.current[index]?.focus()}
          style={[
            styles.box,
            focused === index && styles.boxFocused,
            !!digits[index] && styles.boxFilled,
            error && styles.boxError,
            disabled && styles.boxDisabled,
          ]}
        >
          <TextInput
            ref={(ref) => {
              inputs.current[index] = ref;
            }}
            style={styles.digit}
            value={digits[index]}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            onFocus={() => setFocused(index)}
            onBlur={() => setFocused(-1)}
            keyboardType="number-pad"
            maxLength={Platform.OS === 'android' ? 1 : 6}
            textContentType="oneTimeCode"
            autoComplete={Platform.OS === 'android' ? 'sms-otp' : 'one-time-code'}
            selectTextOnFocus
            editable={!disabled}
            caretHidden
          />
        </Pressable>
      ))}
    </View>
  );
}

const BOX_SIZE = 52;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: Spacing.sm,
    justifyContent: 'center',
  },
  box: {
    width: BOX_SIZE,
    height: BOX_SIZE + 4,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxFocused: {
    borderColor: Colors.primary,
    borderWidth: 2,
    backgroundColor: Colors.primaryLight,
  },
  boxFilled: {
    borderColor: Colors.primary200,
    backgroundColor: Colors.primaryLight,
  },
  boxError: {
    borderColor: Colors.error,
    backgroundColor: Colors.errorLight,
  },
  boxDisabled: {
    opacity: 0.5,
    backgroundColor: Colors.gray100,
  },
  digit: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.xl,
    color: Colors.primaryDeep,
    textAlign: 'center',
    width: '100%',
    height: '100%',
    padding: 0,
  },
});
