import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
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
import { Colors, FontFamily, FontSize, Spacing, BorderRadius, TextStyles } from '@/theme';
import { Button, Input } from '@/components/common';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/auth.store';
import { UserRole } from '@/types';
import type { AuthScreenProps } from '@/navigation/types';

type Props = AuthScreenProps<'ProfileSetup'>;

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
});
type FormData = z.infer<typeof schema>;

type RoleOption = {
  id: UserRole;
  emoji: string;
  title: string;
  subtitle: string;
};

const ROLE_OPTIONS: RoleOption[] = [
  {
    id: 'driver',
    emoji: '🚗',
    title: "I'm a driver",
    subtitle: "Offer rides and earn money on trips I'm already making",
  },
  {
    id: 'passenger',
    emoji: '🎒',
    title: "I'm a passenger",
    subtitle: 'Find affordable, comfortable rides between cities',
  },
];

export default function ProfileSetupScreen(_props: Props) {
  const { isLoading, error, clearError, handleSetupProfile } = useAuth();
  const user = useAuthStore((s) => s.user);

  const [selectedRole, setSelectedRole] = useState<UserRole>('passenger');
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '' },
  });

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
      if (!user?.id) return;
      clearError();
      await handleSetupProfile({
        name,
        role: selectedRole,
        localPhotoUri: photoUri ?? undefined,
        userId: user.id,
      });
    },
    [user, selectedRole, photoUri, clearError, handleSetupProfile],
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={[TextStyles.h1, styles.title]}>Set up your profile</Text>
            <Text style={[TextStyles.body, styles.subtitle]}>
              This is how other SaathiRide members will see you. Use your real name — it builds
              trust.
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
                <Text style={styles.photoEmoji}>📷</Text>
                <Text style={styles.photoLabel}>Add photo</Text>
              </View>
            )}
            <View style={styles.photoBadge}>
              <Text style={styles.photoBadgeText}>✏️</Text>
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
                    {selectedRole === option.id && <Text style={styles.roleCheckMark}>✓</Text>}
                  </View>

                  <Text style={styles.roleEmoji}>{option.emoji}</Text>
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
            label="Complete setup"
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
    paddingTop: Spacing.xl,
  },
  header: {
    marginBottom: Spacing['2xl'],
  },
  title: {
    color: Colors.textBrand,
    marginBottom: Spacing.md,
  },
  subtitle: {
    color: Colors.textMuted,
    lineHeight: FontSize.base * 1.6,
  },
  photoPicker: {
    alignSelf: 'center',
    marginBottom: Spacing['2xl'],
    position: 'relative',
  },
  photoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primaryLight,
    borderWidth: 2,
    borderColor: Colors.primary200,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  photoImage: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.full,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  photoEmoji: {
    fontSize: 28,
  },
  photoLabel: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.xs,
    color: Colors.primary,
  },
  photoBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  photoBadgeText: {
    fontSize: 14,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionLabel: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  roleGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  roleCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    padding: Spacing.base,
    alignItems: 'center',
    position: 'relative',
    paddingTop: Spacing.xl,
  },
  roleCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  roleCheck: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: 22,
    height: 22,
    borderRadius: BorderRadius.full,
    borderWidth: 2,
    borderColor: Colors.gray300,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  roleCheckSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  roleCheckMark: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 12,
    color: Colors.white,
  },
  roleEmoji: {
    fontSize: 36,
    marginBottom: Spacing.sm,
  },
  roleTitle: {
    fontFamily: FontFamily.headingSemiBold,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  roleTitleSelected: {
    color: Colors.primaryDeep,
  },
  roleSubtitle: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: FontSize.xs * 1.6,
  },
  roleNote: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xs,
    color: Colors.textDisabled,
    textAlign: 'center',
    marginTop: Spacing.sm,
    lineHeight: FontSize.xs * 1.6,
  },
  errorBanner: {
    backgroundColor: Colors.errorLight,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.error,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.base,
  },
  errorText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.errorDark,
  },
  submitBtn: {
    marginBottom: Spacing.base,
  },
  footerNote: {
    textAlign: 'center',
    paddingHorizontal: Spacing.base,
  },
});
