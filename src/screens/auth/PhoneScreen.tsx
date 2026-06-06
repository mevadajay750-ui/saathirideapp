import React, { useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius, TextStyles } from '@/theme';
import { Button } from '@/components/common';
import { PhoneInput } from '@/components/common/PhoneInput';
import { phoneSchema } from '@/utils/validators';
import { useAuth } from '@/hooks/useAuth';
import type { AuthScreenProps } from '@/navigation/types';

type Props = AuthScreenProps<'Phone'>;

type FormData = { phone: string };
const schema = z.object({ phone: phoneSchema });

export default function PhoneScreen({ navigation }: Props) {
  const { isLoading, error, clearError, handleSendOTP } = useAuth();
  const phoneInputRef = useRef<TextInput>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { phone: '' },
  });

  const onSubmit = useCallback(
    async ({ phone }: FormData) => {
      clearError();
      const success = await handleSendOTP(phone);
      if (success) {
        navigation.navigate('OTP', { phone });
      }
    },
    [handleSendOTP, clearError, navigation],
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <View style={styles.iconWrap}>
              <Text style={styles.iconEmoji}>📱</Text>
            </View>
            <Text style={[TextStyles.h1, styles.title]}>Enter your{'\n'}mobile number</Text>
            <Text style={[TextStyles.body, styles.subtitle]}>
              We&apos;ll send a 6-digit OTP to verify your number. Standard SMS rates may apply.
            </Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.inputLabel}>Mobile number</Text>
            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, value } }) => (
                <PhoneInput
                  ref={phoneInputRef}
                  value={value}
                  onChangeText={onChange}
                  error={errors.phone?.message}
                  autoFocus
                  onSubmitEditing={handleSubmit(onSubmit)}
                />
              )}
            />

            {error && (
              <View style={styles.errorBanner}>
                <Text style={styles.errorBannerText}>{error}</Text>
              </View>
            )}

            <Button
              label="Send OTP"
              onPress={handleSubmit(onSubmit)}
              isLoading={isLoading}
              variant="primary"
              size="lg"
              style={styles.submitBtn}
            />
          </View>

          <Text style={[TextStyles.caption, styles.footerNote]}>
            By continuing, you agree to SaathiRide&apos;s Terms of Service and Privacy Policy. Your
            number will not be shared publicly.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing['4xl'],
  },
  backBtn: {
    marginTop: Spacing.base,
    marginBottom: Spacing.xl,
    alignSelf: 'flex-start',
  },
  backText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.base,
    color: Colors.primary,
  },
  header: {
    marginBottom: Spacing['2xl'],
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.base,
  },
  iconEmoji: {
    fontSize: 28,
  },
  title: {
    marginBottom: Spacing.md,
    color: Colors.textBrand,
  },
  subtitle: {
    color: Colors.textMuted,
    lineHeight: FontSize.base * 1.6,
  },
  form: {
    gap: Spacing.md,
  },
  inputLabel: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: -Spacing.xs,
  },
  errorBanner: {
    backgroundColor: Colors.errorLight,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.error,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
  },
  errorBannerText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.errorDark,
    lineHeight: FontSize.sm * 1.5,
  },
  submitBtn: {
    marginTop: Spacing.xs,
  },
  footerNote: {
    textAlign: 'center',
    marginTop: Spacing['2xl'],
    paddingHorizontal: Spacing.md,
    lineHeight: FontSize.xs * 1.7,
  },
});
