import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { styles } from './styles';
import {
  Colors,
  FontFamily,
  FontSize,
  Spacing,
  BorderRadius,
  TextStyles,
  IconSize,
  Icons,
} from '@/theme';
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
