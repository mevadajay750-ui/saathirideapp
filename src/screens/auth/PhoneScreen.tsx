import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input } from '@/components/common';
import { Colors, FontFamily, FontSize, Spacing } from '@/theme';
import { phoneSchema } from '@/utils/validators';
import { INDIA_PHONE_PREFIX } from '@/config/constants';
import type { AuthScreenProps } from '@/navigation/types';

const formSchema = z.object({ phone: phoneSchema });
type FormValues = z.infer<typeof formSchema>;

type Props = AuthScreenProps<'Phone'>;

export default function PhoneScreen({ navigation }: Props) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { phone: '' },
  });

  const onSubmit = (data: FormValues) => {
    navigation.navigate('OTP', { phone: data.phone });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      <View style={styles.container}>
        <Text style={styles.title}>Enter your mobile number</Text>
        <Text style={styles.subtitle}>We will send you a one-time password to verify your number.</Text>

        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Mobile number"
              placeholder="9876543210"
              keyboardType="phone-pad"
              maxLength={10}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.phone?.message}
              suffix={<Text style={styles.prefix}>{INDIA_PHONE_PREFIX}</Text>}
            />
          )}
        />

        <Button label="Send OTP" onPress={handleSubmit(onSubmit)} />
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
    lineHeight: FontSize.base * 1.5,
  },
  prefix: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.base,
    color: Colors.textSecondary,
  },
});
