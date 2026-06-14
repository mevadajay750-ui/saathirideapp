import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius, TextStyles, IconSize } from '@/theme';
import { AppIcon, Button, ScreenWrapper } from '@/components/common';
import { OTPInput } from '@/components/common/OTPInput';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/auth.store';
import { useCountdown } from '@/hooks/useCountdown';
import { formatPhone } from '@/utils/formatters';
import { isMockOtpActive, sendOTP } from '@/services/auth.service';
import { DEV_OTP_CODE } from '@/config/dev.auth';
import type { AuthScreenProps } from '@/navigation/types';
import { styles } from './styles';

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

      const user = useAuthStore.getState().user;
      if (result.needsSetup || !user?.name?.trim()) {
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
    <ScreenWrapper contentStyle={styles.safe}>
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
              <AppIcon name="lock-closed-outline" size={IconSize.xl} color={Colors.primary} />
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

          {__DEV__ && isMockOtpActive() && (
            <View style={styles.devNote}>
              <Text style={styles.devNoteText}>
                Dev mode: enter OTP {DEV_OTP_CODE} (no SMS is sent).
              </Text>
            </View>
          )}

          {__DEV__ && !isMockOtpActive() && (
            <View style={styles.devNote}>
              <Text style={styles.devNoteText}>
                Dev: add test phone numbers in Firebase Console → Auth → Phone, or set
                MOCK_OTP_IN_DEV = true in src/config/dev.auth.ts.
              </Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}
