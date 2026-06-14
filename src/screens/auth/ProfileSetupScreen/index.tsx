import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { styles } from './styles';
import {
  Colors,
  FontFamily,
  FontSize,
  Spacing,
  BorderRadius,
  IconSize,
  Icons,
  TextStyles,
} from '@/theme';
import { AppIcon, Button, Input, ScreenWrapper } from '@/components/common';
import { useUpdateProfile, useUploadAndSavePhoto } from '@/hooks/useProfile';
import { setupProfile } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { UserRole } from '@/types';
import type { AuthScreenProps } from '@/navigation/types';

type Props = AuthScreenProps<'ProfileSetup'>;

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
});
type FormData = z.infer<typeof schema>;

import type { AppIconName } from '@/theme';

type RoleOption = {
  id: UserRole;
  icon: AppIconName;
  title: string;
  subtitle: string;
};

const ROLE_OPTIONS: RoleOption[] = [
  {
    id: 'driver',
    icon: Icons.car,
    title: "I'm a driver",
    subtitle: "Offer rides and earn money on trips I'm already making",
  },
  {
    id: 'passenger',
    icon: Icons.passenger,
    title: "I'm a passenger",
    subtitle: 'Find affordable, comfortable rides between cities',
  },
];

export default function ProfileSetupScreen({ navigation }: Props) {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const completeProfileSetup = useAuthStore((s) => s.completeProfileSetup);

  const { mutateAsync: updateProfile, isPending: isSavingProfile } = useUpdateProfile();
  const { mutateAsync: uploadPhoto, isPending: isUploadingPhoto } = useUploadAndSavePhoto();

  const [selectedRole, setSelectedRole] = useState<UserRole>('passenger');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: user?.name?.trim() ?? '' },
  });

  const isLoading = isSavingProfile || isUploadingPhoto;

  const handlePickPhoto = useCallback(() => {
    Alert.alert('Profile photo', 'Choose a photo', [
      {
        text: 'Camera',
        onPress: () =>
          launchCamera({ mediaType: 'photo', quality: 0.8 }, (res) => {
            if (!res.didCancel && res.assets?.[0]?.uri) {
              setPhotoUri(res.assets[0].uri);
            }
          }),
      },
      {
        text: 'Photo library',
        onPress: () =>
          launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, (res) => {
            if (!res.didCancel && res.assets?.[0]?.uri) {
              setPhotoUri(res.assets[0].uri);
            }
          }),
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }, []);

  const onSubmit = useCallback(
    async ({ name }: FormData) => {
      setError(null);
      try {
        try {
          await updateProfile({ name, role: selectedRole });
        } catch {
          const updatedUser = await setupProfile({ name, role: selectedRole });
          setUser(updatedUser);
        }

        if (photoUri) {
          try {
            await uploadPhoto(photoUri);
          } catch {
            // Photo upload is optional — profile save already succeeded
          }
        }

        if (selectedRole === 'driver') {
          navigation.navigate('VehicleSetup');
        } else {
          completeProfileSetup();
        }
      } catch {
        setError('Failed to save profile. Please try again.');
      }
    },
    [selectedRole, photoUri, updateProfile, uploadPhoto, navigation, completeProfileSetup, setUser],
  );

  const submitLabel = selectedRole === 'passenger' ? 'Get Started' : 'Next: Add Vehicle →';

  return (
    <ScreenWrapper contentStyle={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={[TextStyles.h1, styles.title]}>Complete your signup</Text>
            <Text style={[TextStyles.body, styles.subtitle]}>
              Add your name and choose how you&apos;ll use SaathiRide. This is how other members
              will see you.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.photoPicker}
            onPress={handlePickPhoto}
            activeOpacity={0.8}
          >
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.photoImage} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <AppIcon name={Icons.camera} size={IconSize.xl} color={Colors.primary} />
                <Text style={styles.photoLabel}>Add photo</Text>
              </View>
            )}
            <View style={styles.photoBadge}>
              <AppIcon name={Icons.edit} size={IconSize.xs} color={Colors.white} />
            </View>
          </TouchableOpacity>

          <View style={styles.section}>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Full name"
                  placeholder="Rahul Kumar"
                  value={value}
                  onChangeText={onChange}
                  error={errors.name?.message}
                  autoCapitalize="words"
                  autoCorrect={false}
                  returnKeyType="done"
                  hint="Use your real name — it helps passengers and drivers trust you"
                />
              )}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>I want to</Text>
            <View style={styles.roleGrid}>
              {ROLE_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[styles.roleCard, selectedRole === option.id && styles.roleCardSelected]}
                  onPress={() => setSelectedRole(option.id)}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.roleCheck,
                      selectedRole === option.id && styles.roleCheckSelected,
                    ]}
                  >
                    {selectedRole === option.id && (
                      <AppIcon name={Icons.check} size={12} color={Colors.white} />
                    )}
                  </View>

                  <AppIcon
                    name={option.icon}
                    size={IconSize['2xl']}
                    color={selectedRole === option.id ? Colors.primaryDeep : Colors.textSecondary}
                    style={styles.roleIcon}
                  />
                  <Text
                    style={[
                      styles.roleTitle,
                      selectedRole === option.id && styles.roleTitleSelected,
                    ]}
                  >
                    {option.title}
                  </Text>
                  <Text style={styles.roleSubtitle}>{option.subtitle}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.roleNote}>
              You can switch between driver and passenger anytime from your profile.
            </Text>
          </View>

          {error && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <Button
            label={isLoading ? 'Saving…' : submitLabel}
            onPress={handleSubmit(onSubmit)}
            isLoading={isLoading}
            variant="primary"
            size="lg"
            style={styles.submitBtn}
          />

          <Text style={[TextStyles.caption, styles.footerNote]}>
            You can update your profile photo and name later from settings.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}
