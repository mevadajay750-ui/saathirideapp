import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input } from '@/components/common';
import { Colors, FontFamily, FontSize, Spacing } from '@/theme';
import { otpSchema } from '@/utils/validators';
import { formatPhone } from '@/utils/formatters';
import { authService } from '@/services/auth.service';
import type { AuthScreenProps } from '@/navigation/types';

const formSchema = z.object({ otp: otpSchema });
type FormValues = z.infer<typeof formSchema>;

type Props = AuthScreenProps<'OTP'>;

export default function OTPScreen({ route }: Props) {
  const { phone } = route.params;
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { otp: '' },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      await authService.verifyOtp(phone, data.otp);
      Alert.alert('OTP verified', 'Authentication will be implemented in Prompt 2.');
    } catch (error) {
      Alert.alert(
        'Verification failed',
        error instanceof Error ? error.message : 'Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      <View style={styles.container}>
        <Text style={styles.title}>Enter OTP</Text>
        <Text style={styles.subtitle}>Sent to {formatPhone(phone)}</Text>

        <Controller
          control={control}
          name="otp"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="6-digit OTP"
              placeholder="000000"
              keyboardType="number-pad"
              maxLength={6}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.otp?.message}
            />
          )}
        />

        <Button label="Verify OTP" onPress={handleSubmit(onSubmit)} isLoading={isLoading} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  container: { flex: 1, padding: Spacing['2xl'] },
  title: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.xl,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.base,
    color: Colors.textMuted,
    marginBottom: Spacing['2xl'],
  },
});
