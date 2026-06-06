import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius, TextStyles } from '@/theme';
import { Button } from '@/components/common';
import { OTPInput } from '@/components/common/OTPInput';
import { useAuth } from '@/hooks/useAuth';
import { useCountdown } from '@/hooks/useCountdown';
import { formatPhone } from '@/utils/formatters';
import { sendOTP } from '@/services/auth.service';
import type { AuthScreenProps } from '@/navigation/types';

type Props = AuthScreenProps<'OTP'>;

export default function OTPScreen({ navigation, route }: Props) {
  const { phone } = route.params;
  const { isLoading, error, clearError, handleVerifyOTP } = useAuth();
  const { secondsLeft, isRunning, start } = useCountdown(30);

  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    start();
  }, [start]);

  const handleVerify = useCallback(
    async (code: string = otp) => {
      if (code.length < 6) {
        setOtpError(true);
        return;
      }
      setOtpError(false);
      clearError();

      const result = await handleVerifyOTP(code);
      if (!result) {
        setOtpError(true);
        return;
      }

      if (result.isNewUser) {
        navigation.navigate('ProfileSetup');
      }
    },
    [otp, clearError, handleVerifyOTP, navigation],
  );

  const handleResend = useCallback(async () => {
    setResending(true);
    setOtp('');
    setOtpError(false);
    clearError();
    try {
      await sendOTP(phone);
      start();
    } finally {
      setResending(false);
    }
  }, [phone, clearError, start]);

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
              <Text style={styles.iconEmoji}>🔐</Text>
            </View>
            <Text style={[TextStyles.h1, styles.title]}>Verify your number</Text>
            <Text style={[TextStyles.body, styles.subtitle]}>
              Enter the 6-digit OTP sent to{' '}
              <Text style={styles.phoneHighlight}>{formatPhone(phone)}</Text>
            </Text>
          </View>

          <View style={styles.otpSection}>
            <OTPInput
              value={otp}
              onChange={(val) => {
                setOtp(val);
                setOtpError(false);
                clearError();
                if (val.length === 6) {
                  handleVerify(val);
                }
              }}
              error={otpError || !!error}
              disabled={isLoading}
            />

            {(error || otpError) && (
              <Text style={styles.errorText}>{error ?? 'Incorrect OTP. Please try again.'}</Text>
            )}
          </View>

          <Button
            label={isLoading ? 'Verifying...' : 'Verify OTP'}
            onPress={() => handleVerify()}
            isLoading={isLoading}
            disabled={otp.length < 6}
            variant="primary"
            size="lg"
            style={styles.verifyBtn}
          />

          <View style={styles.resendRow}>
            {isRunning ? (
              <Text style={styles.resendTimer}>
                Resend OTP in <Text style={styles.resendTimerCount}>{secondsLeft}s</Text>
              </Text>
            ) : (
              <TouchableOpacity
                onPress={handleResend}
                disabled={resending}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={[styles.resendLink, resending && { opacity: 0.5 }]}>
                  {resending ? 'Sending...' : 'Resend OTP'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.wrongNumberRow}>
            <Text style={styles.wrongNumberText}>Wrong number? </Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.changeLink}>Change number</Text>
            </TouchableOpacity>
          </View>

          {__DEV__ && (
            <View style={styles.devNote}>
              <Text style={styles.devNoteText}>
                Dev: Use Firebase test phone numbers{'\n'}
                configured in Firebase Console → Auth → Sign-in method → Phone
              </Text>
            </View>
          )}
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
  phoneHighlight: {
    fontFamily: FontFamily.bodySemiBold,
    color: Colors.primaryDeep,
  },
  otpSection: {
    marginBottom: Spacing.xl,
    gap: Spacing.md,
    alignItems: 'center',
  },
  errorText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.error,
    textAlign: 'center',
  },
  verifyBtn: {
    marginBottom: Spacing.xl,
  },
  resendRow: {
    alignItems: 'center',
    marginBottom: Spacing.base,
  },
  resendTimer: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  resendTimerCount: {
    fontFamily: FontFamily.bodySemiBold,
    color: Colors.primary,
  },
  resendLink: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.base,
    color: Colors.primary,
  },
  wrongNumberRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrongNumberText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  changeLink: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.sm,
    color: Colors.accent,
  },
  devNote: {
    marginTop: Spacing['2xl'],
    padding: Spacing.base,
    backgroundColor: Colors.warningLight,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.warning,
  },
  devNoteText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xs,
    color: Colors.warningDark,
    lineHeight: FontSize.xs * 1.7,
  },
});
