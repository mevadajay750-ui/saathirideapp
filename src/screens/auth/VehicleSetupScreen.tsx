import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius, TextStyles, IconSize, Icons } from '@/theme';
import { AppIcon, ScreenWrapper } from '@/components/common';
import { VehicleForm, VehicleFormData } from '@/components/profile/VehicleForm';
import { useUpsertVehicle } from '@/hooks/useProfile';
import { fetchProfile } from '@/services/profile.service';
import { useAuthStore } from '@/store/auth.store';
import type { AuthScreenProps } from '@/navigation/types';

type Props = AuthScreenProps<'VehicleSetup'>;

export default function VehicleSetupScreen(_props: Props) {
  const setUser = useAuthStore((s) => s.setUser);
  const completeProfileSetup = useAuthStore((s) => s.completeProfileSetup);

  const { mutateAsync: saveVehicle, isPending: isSavingVehicle } = useUpsertVehicle();
  const [isSkipping, setIsSkipping] = useState(false);

  const finishOnboarding = useCallback(async () => {
    const profile = await fetchProfile();
    setUser(profile);
    completeProfileSetup();
  }, [setUser, completeProfileSetup]);

  const handleSaveVehicle = useCallback(
    async (data: VehicleFormData) => {
      try {
        await saveVehicle(data);
        await finishOnboarding();
      } catch {
        Alert.alert('Error', 'Failed to save vehicle. Please try again.');
      }
    },
    [saveVehicle, finishOnboarding],
  );

  const handleSkip = useCallback(async () => {
    setIsSkipping(true);
    try {
      await finishOnboarding();
    } catch {
      completeProfileSetup();
    } finally {
      setIsSkipping(false);
    }
  }, [finishOnboarding, completeProfileSetup]);

  const isLoading = isSavingVehicle || isSkipping;

  return (
    <ScreenWrapper contentStyle={styles.safe}>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.logoMark}>
              <AppIcon name={Icons.carSport} size={IconSize.xl} color={Colors.primary} />
            </View>
            <Text style={[TextStyles.h2, styles.title]}>Register your vehicle</Text>
            <Text style={[TextStyles.body, styles.subtitle]}>
              Passengers will see these details when booking your ride
            </Text>
          </View>

          <View style={styles.progress}>
            <View style={styles.progressStep}>
              <View style={[styles.progressDot, styles.progressDotDone]}>
                <AppIcon name={Icons.check} size={14} color={Colors.white} />
              </View>
              <Text style={styles.progressLabel}>Profile</Text>
            </View>
            <View style={styles.progressLine} />
            <View style={styles.progressStep}>
              <View style={[styles.progressDot, styles.progressDotActive]}>
                <Text style={[styles.progressDotText, styles.progressDotTextActive]}>2</Text>
              </View>
              <Text style={[styles.progressLabel, styles.progressLabelActive]}>Vehicle</Text>
            </View>
          </View>

          <VehicleForm onSave={handleSaveVehicle} isLoading={isSavingVehicle} />

          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleSkip}
            disabled={isLoading}
            activeOpacity={0.6}
          >
            <Text style={styles.skipText}>Skip for now, add vehicle later</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
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
    paddingTop: Spacing.xl,
    paddingBottom: Spacing['4xl'],
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing['2xl'],
  },
  logoMark: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    color: Colors.textBrand,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: FontSize.base * 1.6,
  },
  progress: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing['2xl'],
  },
  progressStep: {
    alignItems: 'center',
  },
  progressLine: {
    height: 2,
    width: 40,
    backgroundColor: Colors.primary,
    marginHorizontal: Spacing.sm,
  },
  progressDot: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  progressDotDone: {
    backgroundColor: Colors.success,
  },
  progressDotActive: {
    backgroundColor: Colors.primary,
  },
  progressDotText: {
    fontFamily: FontFamily.headingSemiBold,
    fontSize: FontSize.xs,
    color: Colors.white,
  },
  progressDotTextActive: {
    color: Colors.white,
  },
  progressLabel: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  progressLabelActive: {
    color: Colors.primary,
  },
  skipButton: {
    alignItems: 'center',
    marginTop: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  skipText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    textDecorationLine: 'underline',
  },
});
